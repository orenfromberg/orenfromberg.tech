const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type MarkdownRemarkFrontmatter {
      draft: Boolean
    }
  `)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const tagTemplate = path.resolve(`src/templates/tags.js`)

  const result = await graphql(
    `
    {
      PostsRemark: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(
        limit: 2000
        filter: { frontmatter: { draft: { ne: true } } }
      ) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
    }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  // const posts = result.data.allMarkdownRemark.edges
  const posts = result.data.PostsRemark.edges

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    })
  })

  // Extract tag data from query
  const tags = result.data.tagsGroup.group

  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
