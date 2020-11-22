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
    this.nextChallenge = this.nextChallenge.bind(this);
    this.nextRandomChallenge = this.nextRandomChallenge.bind(this);
    this.challengeNextStudent = this.challengeNextStudent.bind(this);

    this.state = {

      students: [],

      quiz: undefined,
      curr_student: undefined,
      curr_lesson: 0,
      curr_question: undefined
    }
  }

  removeStudent(name) {
    return () => {
      const { students, curr_student, quiz } = this.state;

      let new_quiz = {}
      Object.assign(new_quiz, quiz)

      const new_students = students.filter(student => student !== name)

      let new_student = curr_student;
      if (students[curr_student] === name) {
        new_student = (curr_student - 1) >= 0 ? curr_student - 1 : 0;
      } else {
        new_student = new_students.findIndex(el => el === students[curr_student])
      }

      new_quiz.student = new_students[new_student]

      if (new_students.length === 0) {
        new_student = undefined;
        new_quiz = undefined
      }

      this.setState({
        curr_student: new_student,
        students: new_students,
        quiz: new_quiz
      })
    }
  }

  addStudent(name) {
    const { students } = this.state;

    if (name === "") {
      return false;
    }

    if (students.includes(name)) {
      console.log("student already exists")
      return false
    } else {
      students.push(name)
      this.setState({
        students
      })
      return true;
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
    const { curr_student, students, quiz } = this.state;

    if (curr_student !== undefined) {
      let new_student = (curr_student + 1) % students.length
      this.setState({
        curr_student: new_student,
        quiz: {
          student: students[new_student],
          question: quiz.question
        }
      })
    }
  }

  nextChallenge() {
    const { curr_student, curr_lesson, students, curr_question } = this.state;

    const i = curr_student === undefined ? 0 : (curr_student + 1) % students.length;

    const next_question = curr_question === undefined ? 0 : (curr_question + 1) % lessons[curr_lesson].material.length;

    this.setState({
      curr_student: i,
      curr_question: next_question,
      quiz: {
        student: students[i],
        question: lessons[curr_lesson].material[next_question].question
      }
    })
  }

  nextRandomChallenge() {
    const { curr_student, curr_lesson, students } = this.state;

    const i = curr_student === undefined ? 0 : (curr_student + 1) % students.length;

    this.setState({
      curr_student: i,
      quiz: {
        student: students[i],
        question: get_random_question(lessons[curr_lesson].material)
      }
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const students = this.state.students;
    this.setState({
      students
    })
  }

  handleChangeLesson(event) {
    const { 
      curr_student,
      students,
    } = this.state;

    const curr_lesson = event.target.value;

    let quiz = undefined;

    if (curr_student !== undefined) {
      quiz = {
        student: students[curr_student],
        question: get_random_question(lessons[curr_lesson].material)
      }
    }

    this.setState({
      curr_question: undefined,
      curr_lesson,
      curr_student,
      quiz
    })
  }

  render() {
    const { data } = this.props;
    const siteTitle = data.site.siteMetadata.title;
    const { 
      students,
      quiz, curr_lesson, curr_student } = this.state;

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

    const display_quiz = (students, prompt) => {
      if (students.length > 0) {
        return (
          <div>
            <button onClick={this.nextChallenge}>Next Challenge</button>
            <button onClick={this.nextRandomChallenge}>Random Challenge</button>
            <button disabled={students.length === 1} onClick={this.challengeNextStudent}>Let another student try</button>
            <hr />
            <h1 style={{textAlign: "center"}}>{quiz !== undefined ? `${quiz.student}, ${prompt}` : ""}</h1>
            <p className="he quiz">{quiz !== undefined ? quiz.question : ""}</p>
          </div>
        )
      }
    }

    const display_details = () => {
      return (
        <details>
          <summary>Display Cheatsheet</summary>
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
              <td className="he">בָּ or בֳּ</td>
              <td>"bah", as in father</td>
            </tr>
            <tr>
              <td className="he">בַּ or בֲּ</td>
              <td>"bah", as in father</td>
            </tr>
            <tr>
              <td className="he">בֵּ</td>
              <td>"bay", as in baby</td>
            </tr>
            <tr>
              <td className="he">בֶּ or בֱּ</td>
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
              <td className="he">בֹּ or בּוֹ</td>
              <td>"boh" as in bone</td>
            </tr>
            <tr>
              <td className="he">בִּיחַ</td>
              <td>"bee'ach"</td>
            </tr>
          </tbody></table>
        </details>
      )
    }

    const display_students = (students, curr_student) => {
      return (
        <div>
          <form>
            <input ref={this.myInput} onSubmit={this.handleSubmit} type="text"></input>
            <button ref={this.myButton} onClick={this.handleSubmit}>Add student</button>
          </form>
          {
            students.length === 0 && <h1><span role="img" aria-label="point up">👆</span> Add a student to begin</h1>
          }
          <p>{students.map((x, i, arr) => (<span key={i} className={i === curr_student ? "bold" : ""}>{`${x} `}<button onClick={this.removeStudent(x)}>x</button>{i === arr.length - 1 ? ' ' : `, `}</span>))}</p>
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
          display_students(students, curr_student)
        }
        {
          display_quiz(students, lessons[curr_lesson].prompt)
        }
        {
          display_details()
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
