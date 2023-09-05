import { graphql } from 'gatsby'
import React from 'react'

import Gallery from '@browniebroke/gatsby-image-gallery'

const MyGallery = ({ data }) => {
  const images = data.allFile.edges.map(({ node }) => node.childImageSharp)
  // `images` is an array of objects with `thumb` and `full`
  return <Gallery images={images} />
}

export const pageQuery = graphql`
  query ImagesForGallery {
    allFile(filter: {extension: {in: "jpg"}}) {
      edges {
        node {
          childImageSharp {
            thumb: gatsbyImageData(width: 270, height: 270, placeholder: BLURRED)
            full: gatsbyImageData(layout: FULL_WIDTH)
          }
          dir
          relativeDirectory
          extension
          relativePath
          root
          size
          sourceInstanceName
          uid
        }
      }
    }
  }
  
`

export default MyGallery