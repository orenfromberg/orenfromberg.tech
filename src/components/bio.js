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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin, 
  // faSquareXTwitter, faReddit 
} from '@fortawesome/free-brands-svg-icons'

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
        github
        email
        linkedin
        twitter
        reddit
      }
    }
  }
}`)

  const { author, 
    // siteSrc, 
    social } = data.site.siteMetadata
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
        <FontAwesomeIcon icon={faGithub} /> <a className={`social`} href={`https://github.com/${social.github}`}>{social.github}</a>
        <br />
        <FontAwesomeIcon icon={faLinkedin} /> <a className={`social`} href={`https://linkedin.com/${social.linkedin}`}>{social.linkedin}</a>
        <br />
        {/* <FontAwesomeIcon icon={faSquareXTwitter} /> <a className={`social`} href={`https://x.com/${social.twitter}`}>{social.twitter}</a>
        <br />
        <FontAwesomeIcon icon={faReddit} /> <a className={`social`} href={`https://reddit.com/${social.reddit}`}>{social.reddit}</a>
        <br /> */}
        <FontAwesomeIcon icon={faEnvelope} /> <a className={`social`} href={`mailto:${social.email}`}>{social.email}</a>
      </p>
    </div>
  );
}

export default Bio
