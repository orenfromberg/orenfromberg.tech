import React from "react"
import { rhythm } from "../utils/typography"
import Header from "./header.js"

const Layout = ({ location, title, children }) => (
  <div
    style={{
      marginLeft: `auto`,
      marginRight: `auto`,
      maxWidth: rhythm(24),
      padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
    }}
  >
    <Header location={location} title={title}/>
    <main>{children}</main>
    <footer>
      © {new Date().getFullYear()}, Oren Fromberg
    </footer>
  </div>
)

export default Layout
