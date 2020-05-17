import React from "react"


class BingoButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: false };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() { 
        this.setState(state => ({ isToggleOn: !state.isToggleOn })); 
    }

    render() {
        return (
        <button onClick={this.handleClick} style={{
            backgroundColor: this.state.isToggleOn ? "lightgreen" : "white",
            padding: "20px",
            width: "100px"
        }}>{this.props.children}</button>
        )
    }
}

export default BingoButton
