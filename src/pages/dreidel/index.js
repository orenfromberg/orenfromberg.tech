import React from "react"
import { graphql } from "gatsby"

import Layout from "../../components/layout"
import Game from "./game"
import Scoreboard from "./scoreboard"

class DreidelPage extends React.Component {
    constructor(props) {
        super(props)

        this.myInput = React.createRef();
        this.myButton = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.startGame = this.startGame.bind(this);
        this.handleDreidelSpun = this.handleDreidelSpun.bind(this);

        this.state = {
            players: [],
            scores: [],
            pot: 0,
            is_game_started: false,
            curr_player: undefined, // this is an index
            has_winner: false
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

    startGame() {
        const { players } = this.state;

        const scores = new Array(players.length).fill(5)

        this.setState({
            is_game_started: true,
            scores,
            curr_player: Math.floor(Math.random() * players.length),
            pot: players.length,
            has_winner: false
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        const players = this.state.players;
        this.setState({
            players
        })
    }

    handleDreidelSpun(letter) {
        const { scores, players, curr_player, pot } = this.state;

        let new_pot = pot;
        let next_player = curr_player;
        let new_scores = [...scores];
        let is_game_started = true;
        let has_winner = false;

        if (letter === "nun") {
            // nothing happens

            // go to next player with non-zero score
            let done = false;
            while (!done) {
                next_player = (next_player + 1) % players.length
                done = new_scores[next_player] > 0 ? true : false;
            }

            // is next_player same as curr_player?
            if (curr_player === next_player) {
                // game is over
                is_game_started = false;
                has_winner = true;
            }
        }
        else if (letter === "gimel") {
            // curr player gets pot
            new_scores[curr_player] += pot

            // pot is empty
            new_pot = 0;

            // players with non-zero scores put a point in pot
            players.forEach((player, i) => {
                if (new_scores[i] > 0) {
                    new_scores[i] -= 1;
                    new_pot++;
                }
            });

            // go to next player with non-zero score
            let done = false;
            while (!done) {
                next_player = (next_player + 1) % players.length
                done = new_scores[next_player] > 0 ? true : false;
            }

            // is next_player same as curr_player?
            if (curr_player === next_player) {
                // game is over
                is_game_started = false;
                has_winner = true;
            }
        }
        else if (letter === "hey") {
            // curr player gets half the pot
            let half_pot = Math.ceil(pot / 2);
            new_pot = pot - half_pot;
            new_scores[curr_player] += half_pot;

            // is pot empty?
            if (new_pot === 0) {
                // players with non-zero scores put a point in pot
                players.forEach((player, i) => {
                    if (new_scores[i] > 0) {
                        new_scores[i] -= 1;
                        new_pot++;
                    }
                });
            }

            // go to next player with non-zero score
            let done = false;
            while (!done) {
                next_player = (next_player + 1) % players.length
                done = new_scores[next_player] > 0 ? true : false;
            }

            // is next_player same as curr_player?
            if (curr_player === next_player) {
                // game is over
                is_game_started = false;
                has_winner = true;
            }
        } else if (letter === "shin") {
            // curr_player puts 1 into pot
            new_scores[curr_player] -= 1
            new_pot++;

            // go to next player with non-zero score
            let done = false;
            while (!done) {
                next_player = (next_player + 1) % players.length
                done = new_scores[next_player] > 0 ? true : false;
            }

            // is the next_player the only player left?
            if (new_scores[next_player] === new_scores.reduce((prev, currVal, currIdx) => {
                return prev + new_scores[currIdx];
            }, 0)) {
                is_game_started = false;
                has_winner = true;
            }
        }

        this.setState({
            pot: new_pot,
            curr_player: next_player,
            scores: new_scores,
            is_game_started,
            has_winner
        })
    }

    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;
        const {
            players,
            curr_player,
            is_game_started,
            scores,
            pot,
            has_winner
        } = this.state;

        const display_details = () => {
            return (
                <details className="cheatsheet">
                    <summary>Display Rules</summary>
                    <p>Each side of the dreidel bears a letter of the Hebrew alphabet: נ‎ (nun), ג‎ (gimel), ה‎ (hei), ש‎ (shin).</p>
                    <p>These letters are translated in Yiddish to a mnemonic for the rules of a gambling game played with a dreidel:</p>
                    <ul>
                        <li>Nun stands for the Yiddish word nisht ("nothing"),</li>
                        <li>Gimel for gants ("all"),</li>
                        <li>Hei for halb ("half"),</li>
                        <li>and Shin for shtel arayn ("put in").</li>
                    </ul>
                    <p>However, they represent the Hebrew phrase nes gadol hayah sham ("a great miracle happened there"), referring to the miracle of the cruse of oil.</p>
                </details>
            )
        }

        const display_players = (players, curr_player, is_game_started, scores, pot) => {
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
                </div>
            )
        }

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <hr />
                {
                    <div>
                        <h1>Let's play Dreidel!</h1>
                        <p>A dreidel is a four-sided spinning top, played during the Jewish holiday of Hanukkah.</p>
                        <p>Don't have a dreidel to play with? <a target="_blank" rel="noopener noreferrer" href="https://www.dreidel.xyz">Use this virtual dreidel!</a></p>
                    </div>
                }
                {
                    display_players(players, curr_player, is_game_started, scores, pot)
                }
                <Scoreboard players={players} currPlayer={curr_player} isGameStarted={is_game_started} scores={scores} pot={pot} />
                {
                    has_winner && <h1>{`${players[curr_player]} won!`}</h1>
                }
                {
                    is_game_started === false && <button onClick={this.startGame} disabled={players.length > 1 ? false : true}>Start New Game!</button>
                }
                <hr />
                <Game isGameStarted={is_game_started} players={players} currPlayer={curr_player} onDreidelSpun={this.handleDreidelSpun} />
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
