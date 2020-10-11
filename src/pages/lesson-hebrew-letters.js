import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const material = ["א","בּ","ב","גּ","ג","דּ","ד","ה","ו","ז","ח","ט","י","כּ","כ","ךְ","ל","מ","מּ","ם","נ","נּ","ן","ס","ע","פּ","פ","ף","צ","ץ","ק","ר","שׁ","שׂ","ת","תּ"]

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

class LessonHebrewLettersPage extends React.Component {
  constructor(props) {
    super(props)
    this.myInput = React.createRef();
    this.myButton = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.quizStudent = this.quizStudent.bind(this);
    this.getRemoveFunction = this.getRemoveFunction.bind(this)

    this.state = {
      items: [],
      students: {},
      quiz: undefined,
      curr_student: undefined
    }
  }

  addStudent(name) {
    const { students } = this.state;

    if (students[name] === undefined) {
      this.setState({
        students: Object.assign(students, {
          [name]: {
            // card: create_bingo_card(),
            // isWinner: false
          }
        })
      })
      return true
    } else {
      console.log("student already exists")
      return false
    }
  }

  componentDidMount() {
    this.myButton.current.addEventListener("click", (event) => {
      let result = ""
      if (!this.addStudent(this.myInput.current.value)) {
        result = "Student already exists!";
      } else {
        this.myInput.current.value = ""
      }
      this.myInput.current.setCustomValidity(result)
    })
  }

  quizStudent() {
    const { curr_student, items } = this.state;

    const i = curr_student === undefined ? 0 : (curr_student + 1) % items.length;

    this.setState({
      curr_student: i,
      quiz: {
        student: items[i].name,
        question: sample(material)
      }
    })
  }

  getRemoveFunction(name) {
    return () => {
      const { students } = this.state;
      delete students[name]
      const items = this.getItems(students);
      this.setState({
        items,
        students
      })
    }
  }

  getItems(students) {
    const items = [];
    for (const student in students) {
      if (students.hasOwnProperty(student)) {
        // const c = students[student].card;
        // let vals = c[0].concat(c[1]).concat(c[2]).concat(c[3]).concat(c[4]).join(",")
        items.push({
          name: student,
          // url: `${window.origin}/bingo/?name=${encodeURI(player)}&vals=${vals}`,
          removeStudent: this.getRemoveFunction(student)
        })
      }
    }
    return items;
  }

  handleSubmit(event) {
    event.preventDefault()
    const students = this.state.students;
    const items = this.getItems(students);
    this.setState({
      items,
      students
    })
  }

  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const { items, quiz } = this.state;

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <h1>Let's Learn Hebrew Letters</h1>
        <details>
        <table>
          <tr><td>Vav</td><td>Hey</td><td>Dalet</td><td>Gimel</td><td>Vet</td><td>Bet</td><td>Alef</td></tr>
          <tr class="he"><td>ו</td><td>ה</td><td>ד</td><td>ג</td><td>ב</td><td>בּ</td><td>א</td></tr>
          </table>
          <table>
          <tr><td>Final Chaf</td><td>Chaf</td><td>Kaf</td><td>Yud</td><td>Tet</td><td>Chet</td><td>Zayin</td></tr>
          <tr class="he"><td>ך</td><td>כ</td><td>כּ</td><td>י</td><td>ט</td><td>ח</td><td>ז</td></tr>
          </table>
          <table>
          <tr><td>Ayin</td><td>Samech</td><td>Final Nun</td><td>Nun</td><td>Final Mem</td><td>Mem</td><td>Lamed</td></tr>
          <tr class="he"><td>ע</td><td>ס</td><td>ן</td><td>נ</td><td>ם</td><td>מ</td><td>ל</td></tr>
          </table>
          <table>
          <tr><td>Resh</td><td>Kuf</td><td>Final Tzadee</td><td>Tzadee</td><td>Final Fey</td><td>Fey</td><td>Pey</td></tr>
          <tr class="he"><td>ר</td><td>ק</td><td>ץ</td><td>צ</td><td>ף</td><td>פ</td><td>פּ</td></tr>
          </table>
          <table>
          <tr><td>Tav</td><td>Sin</td><td>Shin</td></tr>
          <tr class="he"><td>ת</td><td>שׂ</td><td>שׁ</td></tr>
          </table>
        </details>
        <form>
          <input ref={this.myInput} onSubmit={this.handleSubmit} type="text"></input>
          <button ref={this.myButton} onClick={this.handleSubmit}>Add student</button>
        </form>
        <h4>{items.map((x, i, arr) => (<span>{`${x.name} `}<button onClick={x.removeStudent}>x</button>{i === arr.length - 1 ? ' ' : `, `}</span>))}</h4>
        <button onClick={this.quizStudent}>Quiz Student!</button>
        <hr />
        <h1>{quiz !== undefined ? `${quiz.student}, what letter is this?` : ""}</h1>
        <p class="he quiz">{quiz !== undefined ? quiz.question : ""}</p>

      </Layout>
    )
  }
}

export default LessonHebrewLettersPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
