import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"

const { lessons } = require('./lessons.json')

const get_random_question = (material) => {
  return material[Math.floor(Math.random() * material.length)].question
}

class LessonPage extends React.Component {
  constructor(props) {
    super(props)
    this.myInput = React.createRef();
    this.myButton = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeLesson = this.handleChangeLesson.bind(this)
    this.quizStudent = this.quizStudent.bind(this);
    this.challengeNextStudent = this.challengeNextStudent.bind(this);
    this.getRemoveFunction = this.getRemoveFunction.bind(this)

    this.state = {
      items: [],
      students: {},
      quiz: undefined,
      curr_student: undefined,
      curr_lesson: 0
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

  challengeNextStudent() {
    const { curr_student, items, quiz } = this.state;

    if (curr_student === undefined) {
      return;
    }

    const new_student = (curr_student + 1) % items.length

    this.setState({
      curr_student: new_student,
      quiz: {
        student: items[new_student].name,
        question: quiz.question
      }
    })
  }

  quizStudent() {
    const { curr_student, curr_lesson, items } = this.state;

    const i = curr_student === undefined ? 0 : (curr_student + 1) % items.length;

    this.setState({
      curr_student: i,
      quiz: {
        student: items[i].name,
        question: get_random_question(lessons[curr_lesson].material)
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

  handleChangeLesson(event) {
    const { curr_student, items } = this.state;

    const curr_lesson = event.target.value;

    let quiz = undefined;

    if (curr_student !== undefined) {
      quiz = {
        student:items[curr_student].name,
        question: get_random_question(lessons[curr_lesson].material)
      }
    }

    this.setState({
      curr_lesson,
      curr_student,
      quiz
    })
  }

  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const { items, quiz, curr_lesson } = this.state;

    const display_lesson_selection = () => {
      return (
        <div>
          <label htmlFor="lessons">Select a lesson:</label>
          <select onChange={this.handleChangeLesson} value={curr_lesson} name="lessons" id="lessons">
            {
              lessons.map((lesson, i) => (<option key={i} value={i}>{lesson.title}</option>))
            }
          </select>
        </div>
      )
    }

    const display_quiz = (items, prompt) => {
      if (items.length > 0) {
        return (
          <div>
            <button onClick={this.quizStudent}>Next Challenge</button>
            <button onClick={this.challengeNextStudent}>Let another student try</button>
            <hr />
            <h1>{quiz !== undefined ? `${quiz.student}, ${prompt}` : ""}</h1>
            <p className="he quiz">{quiz !== undefined ? quiz.question : ""}</p>
          </div>
        )
      }
    }

    const display_details = () => {
      return (
        <details>
          <h2>Letters</h2>
          <table><tbody>
            <tr><td>Vav</td><td>Hey</td><td>Dalet</td><td>Gimel</td><td>Vet</td><td>Bet</td><td>Alef</td></tr>
            <tr className="he"><td>ו</td><td>ה</td><td>ד</td><td>ג</td><td>ב</td><td>בּ</td><td>א</td></tr>
            </tbody></table>
          <table><tbody>
            <tr><td>Final Chaf</td><td>Chaf</td><td>Kaf</td><td>Yud</td><td>Tet</td><td>Chet</td><td>Zayin</td></tr>
            <tr className="he"><td>ך</td><td>כ</td><td>כּ</td><td>י</td><td>ט</td><td>ח</td><td>ז</td></tr>
          </tbody></table>
          <table><tbody>
            <tr><td>Ayin</td><td>Samech</td><td>Final Nun</td><td>Nun</td><td>Final Mem</td><td>Mem</td><td>Lamed</td></tr>
            <tr className="he"><td>ע</td><td>ס</td><td>ן</td><td>נ</td><td>ם</td><td>מ</td><td>ל</td></tr>
          </tbody></table>
          <table><tbody>
            <tr><td>Resh</td><td>Kuf</td><td>Final Tzadee</td><td>Tzadee</td><td>Final Fey</td><td>Fey</td><td>Pey</td></tr>
            <tr className="he"><td>ר</td><td>ק</td><td>ץ</td><td>צ</td><td>ף</td><td>פ</td><td>פּ</td></tr>
          </tbody></table>
          <table><tbody>
            <tr><td>Tav</td><td>Sin</td><td>Shin</td></tr>
            <tr className="he"><td>ת</td><td>שׂ</td><td>שׁ</td></tr>
          </tbody></table>
          <h2>Vowels</h2>
          <table><tbody>
            <tr>
              <td className="he">בָּ</td>
              <td>"bah", as in father</td>
            </tr>
            <tr>
              <td className="he">בַּ</td>
              <td>"bah", as in father</td>
            </tr>
            <tr>
              <td className="he">בֵּ</td>
              <td>"bay", as in baby</td>
            </tr>
            <tr>
              <td className="he">בֶּ</td>
              <td>"beh", as in bell</td>
            </tr>
            <tr>
              <td className="he">בְּ</td>
              <td>"b-", silent</td>
            </tr>
            <tr>
              <td className="he">בִּ</td>
              <td>"bee"</td>
            </tr>
            <tr>
              <td className="he">בֻּ or בּוּ</td>
              <td>"boo" as in boon</td>
            </tr>
            <tr>
              <td className="he">בִּיעַ</td>
              <td>"bee'ah"</td>
            </tr>
            <tr>
              <td className="he">בִּיחַ</td>
              <td>"bee'ach"</td>
            </tr>
          </tbody></table>
        </details>
      )
    }

    const display_students = () => {
      return (
        <div>
          <form>
            <input ref={this.myInput} onSubmit={this.handleSubmit} type="text"></input>
            <button ref={this.myButton} onClick={this.handleSubmit}>Add student</button>
          </form>
          <h4>{items.map((x, i, arr) => (<span key={i}>{`${x.name} `}<button onClick={x.removeStudent}>x</button>{i === arr.length - 1 ? ' ' : `, `}</span>))}</h4>
        </div>
      )
    }

    return (
      <Layout location={this.props.location} title={siteTitle}>
        {
          display_lesson_selection()
        }
        <hr />
        {
          <div>
            <h1>{`Let's Learn ${lessons[curr_lesson].title}!`}</h1>
            <p>{lessons[curr_lesson].description}</p>
          </div>
        }
        {
          display_details()
        }
        {
          display_students()
        }
        {
          display_quiz(items, lessons[curr_lesson].prompt)
        }
      </Layout>
    )
  }
}

export default LessonPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
