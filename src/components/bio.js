/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

import { rhythm } from "../utils/typography"

const Bio = () => {
  const data = useStaticQuery(graphql`query BioQuery {
  avatar: file(absolutePath: {regex: "/profile-image.jpg/"}) {
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, layout: FIXED)
    }
  }
  site {
    siteMetadata {
      author
      siteSrc
      social {
        keybase
      }
    }
  }
}`)

  const { author, siteSrc, social } = data.site.siteMetadata
  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
      }}
    >
      <GatsbyImage
        image={data.avatar.childImageSharp.gatsbyImageData}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }} />
      <p>
        Written by <strong>{author}</strong> {` `}
        <br />
        <a href={`https://keybase.io/${social.keybase}`}>keybase</a>
        <br />
        <a href={`${siteSrc}`}>blog sourcecode</a>
        <br />
        <span>orenfromberg at gmail dot com</span>
      </p>
    </div>
  );
}

export default Bio
