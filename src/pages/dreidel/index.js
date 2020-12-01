import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"

// const letters = [ "nun", "gimel", "hey", "shin"]
const letters = [ "front", "right", "back", "left"]

class DreidelPage extends React.Component {
    constructor(props) {
        super(props)

        this.myInput = React.createRef();
        this.myButton = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);

        this.startGame = this.startGame.bind(this);
        this.spin = this.spin.bind(this)

        this.state = {
            players: [],
            is_game_started: false,
            curr_player: undefined,
            curr_letter: undefined
        }
    }

    removePlayer(name) {
        return () => {
            const { players } = this.state;

            const new_players = players.filter(p => p !== name)

            this.setState({
                players: new_players,
            })
        }
    }

    addPlayer(name) {
        const { players } = this.state;

        if (name === "") {
            return false;
        }

        if (players.includes(name)) {
            console.log("player already exists")
            return false
        } else {
            players.push(name)
            this.setState({
                players
            })
            return true;
        }
    }

    componentDidMount() {
        this.myButton.current.addEventListener("click", (event) => {
            let result = ""
            if (!this.addPlayer(this.myInput.current.value)) {
                result = "Student already exists!";
            } else {
                this.myInput.current.value = ""
            }
            this.myInput.current.setCustomValidity(result)
        })
    }

    spin() {
        this.setState({
            curr_letter: letters[Math.floor(Math.random() * letters.length)]
        })
    }

    startGame() {
        this.setState({
            is_game_started: true
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        const players = this.state.players;
        this.setState({
            players
        })
    }

    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;
        const {
            players,
            curr_letter,
            curr_player,
            is_game_started
        } = this.state;

        const display_game = (curr_letter) => {
            return (
                <div>
                    <div className="scene">
                        <div className={`cube show-${curr_letter}`}>
                            <div className="cube__face cube__face--front">נ</div>
                            <div className="cube__face cube__face--back">ה</div>
                            <div className="cube__face cube__face--right">ג</div>
                            <div className="cube__face cube__face--left">שׁ</div>
                        </div>
                    </div>
                    <button type="button" onClick={this.spin}>Spin</button>
                </div>
            )
        }

        const display_details = () => {
            return (
                <details className="cheatsheet">
                    <summary>Display Rules</summary>
                    <p>Each side of the dreidel bears a letter of the Hebrew alphabet: נ‎ (nun), ג‎ (gimel), ה‎ (hei), ש‎ (shin). These letters are translated in Yiddish to a mnemonic for the rules of a gambling game played with a dreidel: Nun stands for the Yiddish word nisht ("nothing"), Gimel for gants ("all"), Hei for halb ("half"), and Shin for shtel arayn ("put in"). However, they represent the Hebrew phrase nes gadol hayah sham ("a great miracle happened there"), referring to the miracle of the cruse of oil.</p>
                </details>
            )
        }

        const display_players = (players, curr_player, is_game_started) => {
            return (
                <div>
                    {
                        is_game_started === false && <form>
                            <input ref={this.myInput} onSubmit={this.handleSubmit} type="text"></input>
                            <button ref={this.myButton} onClick={this.handleSubmit}>Add player</button>
                        </form>

                    }
                    {
                        players.length === 0 && <h1><span role="img" aria-label="point up">👆</span> Add some players to begin</h1>
                    }
                    {
                        is_game_started === false && players.map((x, i, arr) => (<span key={i} className={i === curr_player ? "bold" : ""}>{`${x} `}<button onClick={this.removePlayer(x)}>x</button>{i === arr.length - 1 ? ' ' : `, `}</span>))
                    }
                    {
                        is_game_started === true && <ul>{
                            players.map(x => (<li>{x}</li>))
                        }</ul>
                    }
                </div>
            )
        }

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <hr />
                {
                    <div>
                        <h1>{`Let's play Dreidel!`}</h1>
                        <p>A dreidel is a four-sided spinning top, played during the Jewish holiday of Hanukkah.</p>
                    </div>
                }
                {
                    display_players(players, curr_player, is_game_started)
                }
                {
                    is_game_started === false && <button onClick={this.startGame} disabled={players.length > 1 ? false : true}>Start Game!</button>
                }
                <hr />
                {
                    is_game_started === true && display_game(curr_letter)
                }
                {
                    display_details()
                }
                {
                    <div>
                        If you find this useful, <a rel="noreferrer" target="_blank" href="/donate" >please support my work!</a> 🙌🙇
          </div>
                }
            </Layout>
        )
    }
}

export default DreidelPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
