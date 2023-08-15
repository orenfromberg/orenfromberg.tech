---
title: Terraform State Surgery
date: "2023-08-14"
description: Moving AWS Security Group Rules from Attributes-as-Blocks to standalone resources.
---

## The Condition

For users of the AWS Terraform Provider, using an `aws_security_group` resource to declare security group rules as inline blocks (known as [Attributes-as-Blocks](https://developer.hashicorp.com/terraform/language/attr-as-blocks)) can lead to painful consequences.

For example, if you wanted to add a rule to a particular security group, you would not be able to export the security group from the module and attach a rule directly to it since inline rules and standalone `aws_security_group_rules` will conflict with each other.

[The terraform documentation for security group rules](https://registry.terraform.io/providers/hashicorp/aws/3.76.1/docs/resources/security_group_rule) acknowledges this and explains that you can safely use one or the other but not both:

>Terraform currently provides both a standalone Security Group Rule resource (a single ingress or egress rule), and a Security Group resource with ingress and egress rules defined in-line. At this time you cannot use a Security Group with in-line rules in conjunction with any Security Group Rule resources. Doing so will cause a conflict of rule settings and will overwrite rules.

Using inline `ingress` and `egress` security group rules causes a condition that complicates our ability to add rules outside of the module. If we elect to refactor the module to use standalone `aws_security_group_rule` resources, we can avoid future complications.

## The Correction

Refactoring the security group module involves removing inline attributes as blocks and then replacing them with standalone resources.

For example, this security group module (called `old_sg_module`) consists of an `aws_security_group` resource with dynamic inline ingress rules:

```hcl
resource "aws_security_group" "sg" {
  name        = "the security group"

  dynamic "ingress" {
    for_each = ...
    content {
      from_port   = ...
      to_port     = ...
      protocol    = ...
      cidr_blocks = ...
      description = "ipv4 cidrs"
    }
  }
}
```

We can refactor this module to use standalone resources instead of dynamic attribute blocks (and call it `new_sg_module`):

```hcl
resource "aws_security_group" "sg" {
  name        = "the security group"
}

resource "aws_security_group_rule" "ipv4_cidrs" {
  for_each          = ...
  type              = "ingress"
  from_port         = ...
  to_port           = ...
  protocol          = ...
  cidr_blocks       = ...
  description       = "ipv4 cidrs"
  security_group_id = aws_security_group.sg.id
}
```
The module has now been refactored to create standalone security group rules that ostensibly provide redundancy for the previous inline rules. Unfortunately, migrating to this new module is not as simple as applying it directly.

## The Complication

Even though it looks like we can safely provision the new rules, if we try to run `terraform apply` with the new module then we see the following error:

```
╷
│ Error: [WARN] A duplicate Security Group rule was found on (sg-0325937ab0b75e23d). This may be
│ a side effect of a now-fixed Terraform issue causing two security groups with
│ identical attributes but different source_security_group_ids to overwrite each
│ other in the state. See https://github.com/hashicorp/terraform/pull/2376 for more
│ information and instructions for recovery. Error: InvalidPermission.Duplicate: the specified rule "peer: 172.31.1.15/32, TCP, from port: 443, to port: 443, ALLOW" already exists
│       status code: 400, request id: 7138a67d-626a-45fe-9abd-38896e5d2128
│ 
│   with module.security_group.aws_security_group_rule.ipv4_cidrs["0"],
│   on new_sg_module/main.tf line 10, in resource "aws_security_group_rule" "ipv4_cidrs":
│   10: resource "aws_security_group_rule" "ipv4_cidrs" {
│ 
╵
```

Running `terraform apply` directly with the refactored module will not work because the AWS provider is trying to provision rules that already exist. This is because security group rules are identified as a string containing the attributes of the security group.

For example, [take a look at the provider code here](https://github.com/hashicorp/terraform-provider-aws/blob/301d4690dd3e60e278df4a91aa860a5082fcc3cf/internal/service/ec2/security_group_rule.go#L902-L907). This shows examples of how the rules are identified internally as strings that concatenate the security group id, the type, the protocol, the to/from ports, and any source/destination ipv4/ipv6 CIDRs, security groups, or prefix lists:

	sg-09a093729ef9382a6_ingress_tcp_8000_8000_10.0.3.0/24
	sg-09a093729ef9382a6_ingress_92_0_65536_10.0.3.0/24_10.0.4.0/24
	sg-09a093729ef9382a6_egress_tcp_8000_8000_10.0.3.0/24
	sg-09a093729ef9382a6_egress_tcp_8000_8000_pl-34800000
	sg-09a093729ef9382a6_ingress_all_0_65536_sg-08123412342323
	sg-09a093729ef9382a6_ingress_tcp_100_121_10.1.0.0/16_2001:db8::/48_10.2.0.0/16_2002:db8::/48

Security group rules are defined by these parameters and will have a naming collision when identical rules are provisioned since they already exist as inline rules in the security groups.

One rough solution would be to rip out all the security groups and rules in AWS and reprovision them with the new module, leading to downtime in production.

A more elegant solution would be to surgically manipulate only the terraform state without affecting anything in AWS in order to achieve a zero-downtime transtion.

Here is the choice: Either bite the bullet and incur painful downtime by destroying and recreating the infrastructure, or employ the `terraform state` and `terraform import` commands to make precise state changes for a painless, zero-downtime migration.

Since hard things are the only things worth doing, we're going to go the zero-downtime route and manipulate the state using our precision tooling. Indeed, this can be a tricky operation and I've heard it called *Terraform State Surgery*.

## The Procedure

Now we see that the security groups will need to be surgically separated from the inline rules in order to make the terraform state match reality. Here is a high level overview of the steps we'll need to take to restore the integrity of the terraform state:

1. **Remove the security groups from state:** Removing the `aws_security_group` resources from the state will remove the bond between the security group and the inline rules.
2. **Import the individual rules to the state:** Next we need to import the existing rules into the standalone `aws_security_group_rule` resources.
3. **Import the security groups back to the state again:** Finally, importing the security groups again will exclude the rules that were imported already into standalone resources.

By utilizing the current and planned states, we can render the terraform commands needed to execute this operation.

## Preoperative Staging

First we'll need to get the current terraform state as JSON and write to a file `current_state.json`:

```shell-session
terraform show -json > current_state.json
```

Getting the planned state involves writing out the plan to the file `out.tfplan`, converting it to JSON, and write to a file `planned_state.json`:

```shell-session
terraform plan -var-file=vars.tfvars -out=out.tfplan
terraform show -json out.tfplan > planned_state.json
```

Lastly, we'll cache the JSON representations of the security groups that we will be removing from and then importing back to the state using the file `sgs.json`. To do this we will need to recursively descend into the current state and search for `aws_security_group` resources named `sg`:

```shell-session
jq -r \
'.. | select((type == "object") and (.type == "aws_security_group") and (.name == "sg"))' \
< current_state.json > sgs.json
```

Now that we have those three items, we are ready to begin.

## The Procedure

Now we have the current state, the planned state, and the cached existing security groups in JSON. We are going to use `jq` to render the terraform CLI commands that will migrate us to using the new module.

The first step is removing the existing security groups from the state.

```shell-session
jq -r '@sh "terraform state rm \(.address)"' < sgs.json 
```

This will render the following command:
```shell-session
terraform state rm \
'module.security_group.aws_security_group.sg'
```
Running this command will remove the resource with address `module.security_group.aws_security_group.sg` from the terraform state.

The next step is to import all the security group rules into their own standalone resources. This will use a somewhat beefy `jq` query on the planned state that we can cache in a file called `filter.jq`:

```jq
.resource_changes[] 
| select((.type == "aws_security_group_rule") and (.change.actions[] == "create")) 
| {address} + .change.after 
| {address} + {id: [.security_group_id, .type, .protocol, (.from_port|tostring), (.to_port|tostring), .cidr_blocks // .ipv6_cidr_blocks // .source_security_group_id // .prefix_list_ids] 
| flatten 
| join("_")} 
| @sh "terraform import -var-file=vars.tfvars \(.address) " + .id
```
Here is what this filter is doing:
1. filter out the resource changes that involve creating `aws_security_group` resources
2. compose a new object that includes the rule details and the terraform resource address
3. join the details of the security group rule with underscores to generate the string identifier [discussed above](#the-complication)
4. render the terraform import command used to import the security group rule

This filter can be executed on the planned state as follows:

```shell-session
jq -r -f filter.jq < planned_state.json
```

Which renders the commands:

```shell-session
terraform import -var-file=vars.tfvars \
'module.security_group.aws_security_group_rule.ipv4_cidrs["0"]' \
sg-0bbbc82520894df6d_ingress_tcp_443_443_172.31.1.15/32
terraform import -var-file=vars.tfvars \
'module.security_group.aws_security_group_rule.ipv4_cidrs["1"]' \
sg-0bbbc82520894df6d_ingress_tcp_443_443_172.31.1.16/32
terraform import -var-file=vars.tfvars \
'module.security_group.aws_security_group_rule.ipv4_cidrs["2"]' \
sg-0bbbc82520894df6d_ingress_tcp_443_443_172.31.1.1/32
```

Finally, we need to re-import our security groups. We will once again use the cached security groups to generate the necessary commands:

```shell-session
jq -r '@sh "terraform import -var-file=vars.tfvars \(.address) " + .values.id' < sgs.json
```

This will render the following command:

```shell-session
terraform import -var-file=vars.tfvars \
'module.security_group.aws_security_group.sg' \
sg-0bbbc82520894df6d
```

Running all the previous terraform commands in the shell will modify the state so that there is integrity between it and what currently exists in AWS.

Running `terraform apply` to adjust some defaults such as setting `revoke_rules_on_delete=false` and `timeouts {}`, then `terraform plan` will confirm:

>No changes. Your infrastructure matches the configuration.

## Postop

Now the terraform is fully migrated over to the new security group module that uses standalone rule resources. We've shown that it is possible to modify the terraform state so that no infrastructure in AWS is affected. At this point we can rest assured that the operation was a success and no downtime was incurred. 

All the code used for this blog post can be found on github here:

https://github.com/orenfromberg/terraform-sg-demo

