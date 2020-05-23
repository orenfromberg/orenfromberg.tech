import React from "react"
// import { 
//     graphql } from "gatsby"

import Layout from "../components/layout"
import BingoButton from "../components/bingo-button"
import * as queryString from "query-string";

class BingoPage extends React.Component {
  render() {
    const { name, vals } = queryString.parse(this.props.location.search);

    if (name === undefined || vals === undefined) {
      return <div/>
    }

    let nums = [];
    if (vals !== undefined) {
      nums = vals.split(',')
    }

    return (
      <Layout location={this.props.location} title={decodeURI(name)}>
        <h2>Hebrew Numerals</h2>
          <details>
            <table>
            <tr>
                <td>1</td>
                <td>א</td>
              </tr>
              <tr>
                <td>2</td>
                <td>ב</td>
              </tr>
              <tr>
                <td>3</td>
                <td>ג</td>
              </tr>
              <tr>
                <td>4</td>
                <td>ד</td>
              </tr>
              <tr>
                <td>5</td>
                <td>ה</td>
              </tr>
              <tr>
                <td>6</td>
                <td>ו</td>
              </tr>
              <tr>
                <td>7</td>
                <td>ז</td>
              </tr>
              <tr>
                <td>8</td>
                <td>ח</td>
              </tr>
              <tr>
                <td>9</td>
                <td>ט</td>
              </tr>
              <tr>
                <td>10</td>
                <td>י</td>
              </tr>
              <tr>
                <td>11</td>
                <td>י״א</td>
              </tr>
              <tr>
                <td>12</td>
                <td>י״ב</td>
              </tr>
              <tr>
                <td>13</td>
                <td>י״ג</td>
              </tr>
              <tr>
                <td>14</td>
                <td>י״ד</td>
              </tr>
              <tr>
                <td>15</td>
                <td>ט״ו</td>
              </tr>
              <tr>
                <td>16</td>
                <td>ט״ז</td>
              </tr>
              <tr>
                <td>17</td>
                <td>י״ז</td>
              </tr>
              <tr>
                <td>18</td>
                <td>י״ח</td>
              </tr>
              <tr>
                <td>19</td>
                <td>י״ט</td>
              </tr>
              <tr>
                <td>20</td>
                <td>כ</td>
              </tr>
              <tr>
                <td>30</td>
                <td>ל</td>
              </tr>
              <tr>
                <td>40</td>
                <td>מ</td>
              </tr>
              <tr>
                <td>50</td>
                <td>נ</td>
              </tr>
              <tr>
                <td>60</td>
                <td>ס</td>
              </tr>
              <tr>
                <td>70</td>
                <td>ע</td>
              </tr>
              <tr>
                <td>80</td>
                <td>פ</td>
              </tr>
              <tr>
                <td>90</td>
                <td>צ</td>
              </tr>
              <tr>
                <td>100</td>
                <td>ק</td>
              </tr>
              <tr>
                <td>200</td>
                <td>ר</td>
              </tr>
              <tr>
                <td>300</td>
                <td>ש</td>
              </tr>
              <tr>
                <td>400</td>
                <td>ת</td>
              </tr>
            </table>
          </details>
          <div>
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
                <td><BingoButton isToggled={true}>FREE</BingoButton></td>
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

// export const pageQuery = graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//   }
// `
