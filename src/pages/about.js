import React from "react"
import PropTypes from "prop-types"

// Components
import Bio from "../components/bio"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = ({
  location,
  data: {
    site: {
      siteMetadata: { title },
    },
  },
}) => (
  <Layout location={location} title={title}>
    <Seo title={title} />
    <Bio />
    <p>Todo: add stuff here</p>
  </Layout>
)

AboutPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`