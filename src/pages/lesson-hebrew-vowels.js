import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"

const material = ["בֲּ", "בִּ", "בֶּ", "בֱּ", "בֻּ", "בּוּ", "בֹּ", "בְּ", "בִּי", "בּוֹ", "בַּ", "בֳּ", "בָּ", "בֵּ", "בֵּי"]

const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

class LessonHebrewVowelsPage extends React.Component {
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
                <h1>Let's Learn Hebrew Vowels</h1>
                <details>
                    <table>
                        <tr>
                            <td class="he">בָּ</td>
                            <td>"bah", as in father</td>
                        </tr>
                        <tr>
                            <td class="he">בַּ</td>
                            <td>"bah", as in father</td>
                        </tr>
                        <tr>
                            <td class="he">בֵּ</td>
                            <td>"bay", as in baby</td>
                        </tr>
                        <tr>
                            <td class="he">בֶּ</td>
                            <td>"beh", as in bell</td>
                        </tr>
                        <tr>
                            <td class="he">בְּ</td>
                            <td>"b-", silent</td>
                        </tr>
                        <tr>
                            <td class="he">בִּ</td>
                            <td>"bee"</td>
                        </tr>
                        <tr>
                            <td class="he">בֻּ or בּוּ</td>
                            <td>"boo" as in boon</td>
                        </tr>
                        <tr>
                            <td class="he">בֹּ or בּוֹ</td>
                            <td>"boh" as in bore</td>
                        </tr>
                    </table>
                </details>
                <form>
                    <input ref={this.myInput} onSubmit={this.handleSubmit} type="text"></input>
                    <button ref={this.myButton} onClick={this.handleSubmit}>Add student</button>
                </form>
                <h4>{items.map((x, i, arr) => (<span>{`${x.name} `}<button onClick={x.removeStudent}>x</button>{i === arr.length - 1 ? ' ' : `, `}</span>))}</h4>
                <button onClick={this.quizStudent}>Quiz Student!</button>
                <hr />
                <h1>{quiz !== undefined ? `${quiz.student}, can you sound this out?` : ""}</h1>
                <p class="he quiz">{quiz !== undefined ? quiz.question : ""}</p>

            </Layout>
        )
    }
}

export default LessonHebrewVowelsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
