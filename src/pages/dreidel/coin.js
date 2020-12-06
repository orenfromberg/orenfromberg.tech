import React from "react"

class Coin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    render() {
        return (
            <div className="goldcoin">
                <span>✡</span>
            </div>
        )
    }
}

export default Coin
