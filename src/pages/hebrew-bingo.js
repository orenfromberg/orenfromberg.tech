import React from "react"
import Layout from "../components/layout"

const numerals = require('./bingo/hebrew-numerals.json')

const create_bingo_card = () => {
    let card = Array(5).fill(0).map(() => [])
    for (let i = 0; i < 5; i++) {
        // get set of numbers to choose from
        let set = Array(15).fill(1).map((x, idx) => x + idx + i * 15)

        // get random numbers from set
        for (let j = 0; j < 5; j++) {
            let num = Math.floor(Math.random() * set.length);
            let r = set.splice(num, 1)
            card[i].push(...r)
        }
    }
    return card;
}

let has_bingo = (card, vals) => {
    let result = false;

    // check rows
    for (let row = 0; row < 5; row++) {
        if (row === 2) {
            result |= vals.includes(card[0][row]) &&
                vals.includes(card[1][row]) &&
                vals.includes(card[3][row]) &&
                vals.includes(card[4][row]);
        } else {
            result |= vals.includes(card[0][row]) &&
                vals.includes(card[1][row]) &&
                vals.includes(card[2][row]) &&
                vals.includes(card[3][row]) &&
                vals.includes(card[4][row]);
        }
    }

    // check cols
    for (let col = 0; col < 5; col++) {
        if (col === 2) {
            result |= vals.includes(card[col][0]) &&
                vals.includes(card[col][1]) &&
                vals.includes(card[col][3]) &&
                vals.includes(card[col][4]);
        } else {
            result |= vals.includes(card[col][0]) &&
                vals.includes(card[col][1]) &&
                vals.includes(card[col][2]) &&
                vals.includes(card[col][3]) &&
                vals.includes(card[col][4]);
        }
    }

    // check diagonals
    result |= vals.includes(card[0][0]) &&
        vals.includes(card[1][1]) &&
        vals.includes(card[3][3]) &&
        vals.includes(card[4][4]);

    result |= vals.includes(card[0][4]) &&
        vals.includes(card[1][3]) &&
        vals.includes(card[3][1]) &&
        vals.includes(card[4][0]);

    return result;
}

class HebrewBingoPage extends React.Component {
    constructor(props) {
        super(props);
        this.myInput = React.createRef();
        this.myButton = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.pickNumber = this.pickNumber.bind(this);
        this.checkForBingo = this.checkForBingo.bind(this)
        this.getRemoveFunction = this.getRemoveFunction.bind(this)
        this.state = {
            items: [],
            players: {},
            hat: Array(75).fill(0).map((x, i) => x + i + 1),
            picked: [],
            num: undefined
        }
    }

    resetGame() {
        this.setState({
            hat: Array(75).fill(0).map((x, i) => x + i + 1),
            picked: [],
            num: undefined,
        })

        const { players } = this.state;
        for (const player in players) {
            if (players.hasOwnProperty(player)) {
                const element = players[player];
                element.isWinner = false;
            }
        }
        this.setState({
            players
        })

    }
    
    addPlayer(name) {
        const { players } = this.state;

        if (players[name] === undefined) {
            this.setState({
                players: Object.assign(players, {
                    [name]: {
                        card: create_bingo_card(),
                        isWinner: false
                    }
                })
            })
            return true
        } else {
            console.log("player already exists")
            return false
        }
    }

    componentDidMount() {
        this.myButton.current.addEventListener("click", (event) => {
            let result = ""
            if (!this.addPlayer(this.myInput.current.value)) {
                result = "Player already exists!";
            } else {
                this.myInput.current.value = ""
            }
            this.myInput.current.setCustomValidity(result)
        })
    }

    checkForBingo() {
        const { players, picked } = this.state;

        for (const name in players) {
            if (players.hasOwnProperty(name)) {
                let c = players[name].card;
                if (has_bingo(c, picked)) {
                    console.log(`${name} has bingo!`)
                    players[name].isWinner = true;
                }
            }
        }

        this.setState({
            players
        })
    }

    pickNumber() {
        const { hat, picked } = this.state;

        if (hat.length > 0) {
            let val = hat.splice(Math.floor(Math.random() * hat.length), 1)
            console.log(`You picked: ${val[0]}:\n${numerals[val[0]]}`)
            picked.push(...val)
            console.log(JSON.stringify(picked.sort((a, b) => a - b)))
            this.setState({
                hat,
                picked,
                num: val
            })
        } else {
            console.log("all numbers have been picked!")
        }
    
        this.checkForBingo();
    }

    getRemoveFunction(name) {
        return () => {
            const { players } = this.state;
            delete players[name]
            const items = this.getItems(players);
            this.setState({
                items,
                players
            })
        }
    }

    getItems(players) {
        const items = [];
        for (const player in players) {
            if (players.hasOwnProperty(player)) {
                const c = players[player].card;
                let vals = c[0].concat(c[1]).concat(c[2]).concat(c[3]).concat(c[4]).join(",")
                items.push({
                    name: player,
                    url: `${window.origin}/bingo/?name=${encodeURI(player)}&vals=${vals}`,
                    removePlayer: this.getRemoveFunction(player)
                })
            }
        }
        return items;
    }

    handleSubmit(event) {
        event.preventDefault()
        const players = this.state.players;
        const items = this.getItems(players);
        this.setState({
            items,
            players
        })

    }

    render() {

        const { items, hat, picked, num, players } = this.state;

        const listItem = (x => (
            <li key={x.name}>
                {players[x.name].isWinner ? "⭐ " : ""}<a rel="noreferrer" target="_blank" href={x.url}>{x.name}</a>
                <button name={x.name} onClick={x.removePlayer}>remove</button>
            </li>
        ))

        return (
            <Layout location={this.props.location} title="Let's play Hebrew Bingo!">
                <form>
                    <input ref={this.myInput} onSubmit={this.handleSubmit} type="text"></input>
                    <button ref={this.myButton} onClick={this.handleSubmit}>Add player</button>
                </form>
                <ul>{items.map(listItem)}</ul>
                <button onClick={this.pickNumber}>Pick Number!</button>
                <button onClick={this.resetGame}>Reset Game</button>
                <h1>{num !== undefined? `You picked: ${numerals[num]}` : ""}</h1>
                <details>
                    {num}
                </details>
                <h2>Numbers picked so far</h2>
                <details>
                    <p>{picked.join(', ')}</p>
                </details>
                <h2>Contents of hat</h2>
                <details>
                    <p>{hat.join(', ')}</p>
                </details>
            </Layout>
        )
    }
}

export default HebrewBingoPage