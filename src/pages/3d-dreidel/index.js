import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
// import { rhythm, scale } from "../utils/typography"

class Dreidel extends React.Component {
  constructor(props) {
    super(props)
    this.spin = this.spin.bind(this)
    this.dreidel = React.createRef()
  }

  componentDidMount() {
    // this.dreidel.
  }

  spin() {

  }
  render() {
    const siteTitle = this.props.data.site.siteMetadata.title

    return (
      <Layout location={this.props.location} title={siteTitle}>
        {/* <div id="ex1" className="modal">
        <h1 className="center he">חֲנוּכָּה שָׂמֵחַ</h1>
        <h2 className="center">Happy Hanukkah!</h2>
        <p className="center">Heavily based on <a href="https://codepen.io/laviperchik/pen/rnvzI">this codepen</a>. Submit
            issues <a target="_blank" rel="noopener noreferrer"
                href="https://github.com/orenfromberg/dreidel.xyz/issues">here</a>.
        </p>
        <p className="center">Tap on the dreidel or use the arrow keys on the keyboard to spin it.</p>
        <p className="center"><a href="rules.html">See rules of the game</a></p>
        <p className="center"><a href="support.html">Support this web app</a></p>
    </div> */}
        {/* <h1 className="center">dreidel.xyz</h1>
    <p className="center"><a href="#ex1" rel="modal:open">about</a></p> */}
        {/* <div style="padding:8rem;"></div> */}
        <div
          style={{
            padding: `8rem`,
          }}
        ></div>
        <div className="stage">
          <div ref={this.dreidel} className="pyramid3d" onClick={this.spin} style={{
        transform: `rotateX(90deg) rotate(320deg) scale(1.2)`
    }}>
            <div className="square side1"></div>
            <div className="square side2">נ</div>
            <div className="square side3">ה</div>
            <div className="square side4">ג</div>
            <div className="square side5">שׁ</div>
            <div className="square small side1"></div>
            <div className="rect side2"></div>
            <div className="rect side3"></div>
            <div className="rect side4"></div>
            <div className="rect side5"></div>
            <div className="triangle side2"></div>
            <div className="triangle side3"></div>
            <div className="triangle side4"></div>
            <div className="triangle side5"></div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default Dreidel

export const pageQuery = graphql`
  query DreidelQuery {
    site {
      siteMetadata {
        title
        author
      }
    }
  }
`
