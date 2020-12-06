import React from "react"
import Coin from "./coin"

class Scoreboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    render() {
        const { players, currPlayer, isGameStarted, scores, pot } = this.props;



        if (isGameStarted) {
            return (
                <div>
                    <ul>
                        {
players.map((x, i) => (<li key={x}><span className={
    [i === currPlayer ? "bold" : "",
    scores[i] === 0 ? "strikeout" : ""].join(" ")
}>{x}</span>{`: `}{new Array(scores[i]).fill(0).map(()=>(<Coin />))}</li>))
                    }</ul>
                    <p className="bold">{`Pot: `}{new Array(pot).fill(0).map(()=>(<Coin />))}</p>
                </div>
            )
        } else {
            return (<div></div>)
        }
    }
}

export default Scoreboard
