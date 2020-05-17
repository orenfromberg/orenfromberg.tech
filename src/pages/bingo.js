import React from "react"
import { 
    graphql } from "gatsby"

import Layout from "../components/layout"
import BingoButton from "../components/bingo-button"
import * as queryString from "query-string";

class BingoPage extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const { name, vals } = queryString.parse(this.props.location.search);
    let nums = [];
    if (vals !== undefined) {
      nums = vals.split(',')
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
          <div>
            <h1>{decodeURI(name)}</h1>
            <table>
              <tr>
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
              </tr>
              <tr>
                <td><BingoButton>{nums[0]}</BingoButton></td>
                <td><BingoButton>{nums[5]}</BingoButton></td>
                <td><BingoButton>{nums[10]}</BingoButton></td>
                <td><BingoButton>{nums[15]}</BingoButton></td>
                <td><BingoButton>{nums[20]}</BingoButton></td>
              </tr>
              <tr>
                <td><BingoButton>{nums[1]}</BingoButton></td>
                <td><BingoButton>{nums[6]}</BingoButton></td>
                <td><BingoButton>{nums[11]}</BingoButton></td>
                <td><BingoButton>{nums[16]}</BingoButton></td>
                <td><BingoButton>{nums[21]}</BingoButton></td>
              </tr>
              <tr>
                <td><BingoButton>{nums[2]}</BingoButton></td>
                <td><BingoButton>{nums[7]}</BingoButton></td>
                <td><BingoButton>FREE</BingoButton></td>
                <td><BingoButton>{nums[17]}</BingoButton></td>
                <td><BingoButton>{nums[22]}</BingoButton></td>
              </tr>
              <tr>
                <td><BingoButton>{nums[3]}</BingoButton></td>
                <td><BingoButton>{nums[8]}</BingoButton></td>
                <td><BingoButton>{nums[13]}</BingoButton></td>
                <td><BingoButton>{nums[18]}</BingoButton></td>
                <td><BingoButton>{nums[23]}</BingoButton></td>
              </tr>
              <tr>
                <td><BingoButton>{nums[4]}</BingoButton></td>
                <td><BingoButton>{nums[9]}</BingoButton></td>
                <td><BingoButton>{nums[14]}</BingoButton></td>
                <td><BingoButton>{nums[19]}</BingoButton></td>
                <td><BingoButton>{nums[24]}</BingoButton></td>
              </tr>

            </table>
              
          </div>
      </Layout>
    )
  }
}

export default BingoPage