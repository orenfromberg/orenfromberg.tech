import React from "react"
import { rhythm } from "../utils/typography"
import Header from "./header.js"
import { graphql, StaticQuery } from "gatsby"

const Layout = ({ location, title, children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
            menuLinks {
              name
              link
              isGatsbyLink
            }
          }
        }
      }
    `}
    render={data => (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <Header menuLinks={data.site.siteMetadata.menuLinks} location={location} title={title} />
        <main>{children}</main>
        <footer>© {new Date().getFullYear()}, Oren Fromberg</footer>
      </div>
    )}
  />
)

export default Layout
