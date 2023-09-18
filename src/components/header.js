import React from "react"
import { Link } from "gatsby"
import { rhythm, scale } from "../utils/typography"

const Header = ({ menuLinks, location, title }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header
  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
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
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          marginTop: 0,
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
      </h3>
    )
  }
  return (
    <div>
      <div>
        <nav>
          <ul>
            {menuLinks.map(link => (
              <li
                key={link.name}
                // style={{
                //   listStyleType: `none`,
                //   padding: `1rem`,
                // }}
              >
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
        <span className="header">{header}</span>
      </header>
    </div>
  )
}

export default Header
