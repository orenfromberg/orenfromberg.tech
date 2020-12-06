import React from "react"

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
        this.onValueChange = this.onValueChange.bind(this);
        this.onClickLabel = this.onClickLabel.bind(this);
        this.handleSpin = this.handleSpin.bind(this);
    }

    onValueChange(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    onClickLabel(event) {
        this.setState({
            selectedOption: event.target.value
        });
    }

    handleSpin(event) {
        event.preventDefault();
        this.props.onDreidelSpun(this.state.selectedOption);
    }

    render() {
        const { isGameStarted, players, currPlayer } = this.props;

        if (isGameStarted) {
            return (
                <div>
                    <h1>{`${players[currPlayer]}, what did you spin?`}</h1>
                    <form>
                        <div>
                            {/* this should be a dropdown */}
                            <input
                                type="radio"
                                id="nun"
                                name="letter"
                                value="nun"
                                checked={this.state.selectedOption === "nun"}
                                onChange={this.onValueChange}
                            />
                            <label htmlFor="num" onClick={this.onClickLabel}>Nun</label>
                            <br />
                            <input
                                type="radio"
                                id="gimel"
                                name="letter"
                                value="gimel"
                                checked={this.state.selectedOption === "gimel"}
                                onChange={this.onValueChange}
                            />
                            <label htmlFor="gimel" onClick={this.onClickLabel}>Gimel</label>
                            <br />
                            <input
                                type="radio"
                                id="hey"
                                name="letter"
                                value="hey"
                                checked={this.state.selectedOption === "hey"}
                                onChange={this.onValueChange}
                            />
                            <label htmlFor="hey" onClick={this.onClickLabel}>Hey</label>
                            <br />
                            <input
                                type="radio"
                                id="shin"
                                name="letter"
                                value="shin"
                                checked={this.state.selectedOption === "shin"}
                                onChange={this.onValueChange}
                            />
                            <label htmlFor="shin" onClick={this.onClickLabel}>Shin</label>
                        </div>
                        <div>
                            <button onClick={this.handleSpin} type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (<div></div>)
        }

    }
}

export default Game
