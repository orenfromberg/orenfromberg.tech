import React from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"

const Header = ({ menuLinks, location, title }) => (
  <div>
    <div>
      <nav>
        <ul>
          {menuLinks.map(link => (
            <li key={link.name}>
              {link.isGatsbyLink ? (
                <Link className={`headerLink`} to={link.link}>
                  {link.name}
                </Link>
              ) : (
                <a href={link.link} className={`headerLink`}>
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
    <header>
      <span className="header">
        <div
          style={{
            ...scale(location.pathname === `${__PATH_PREFIX__}/` ? 1.5 : 0.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
            fontWeight: "bold",
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </div>
      </span>
    </header>
  </div>
)

export default Header
