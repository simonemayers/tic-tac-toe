import React from "react"; 
import ReactDOM from "react-dom"
import "./index.css"

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                key= {i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }
    renderSqaures(n){
        let squares = []
        for(let i=n-2; i<n+1; i++){
            squares.push(this.renderSquare(i))
        }
        return squares
    }
    renderRows(rows, columns){
        let grid = []
        for(let i=0; i<rows+6; i++){
            grid.push(<div className="board-row">
                {this.renderSqaures(i+=2)}
            </div>)
        }
        return grid
    }

    render() {
        return (
        <div>
            {this.renderRows(3, 3)}
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }], 
            stepNumber: 0,
            xIsNext: true, 
            isReversed: true
        }
    }

    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length -1]
        const squares = current.squares.slice()
        const location = [
            [1, 1], 
            [2, 1], 
            [3, 1], 
            [1, 2], 
            [2, 2], 
            [3, 2], 
            [1, 3], 
            [2, 3], 
            [3, 3]
        ]
        
        if(calculateWinner(squares) || squares[i]){
            // console.log(squares)
            return; 
        } else if(!squares.includes(null)) {
            return "tie"
        }
        squares[i] = this.state.xIsNext? "X" : "O"
        this.setState({
            history: history.concat([{
                squares:squares, 
                location: location[i]
            }]),
            stepNumber:history.length,
            xIsNext: !this.state.xIsNext
        })
        
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step, 
            xIsNext: (step%2) === 0
        })
    }

    reverseMoves(){
        this.setState({
            isReversed: !this.state.isReversed
        })
    }

    render() {
        const history = this.state.history; 
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        console.log(current)

        const moves = history.map((step, move) => {
            const desc = move ? 
            "Go back to move #" +move : 
            "Go to game start";
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{move === this.state.stepNumber ? <b>{desc}</b> : desc}</button>
                </li>
            )
        })
        const detailedMoves = history.map((step, move) => {
            const desc = move ? 
            `Column ${history[move].location[0]} Row ${history[move].location[1]}` : 
            "No Moves";
            return(
                <li key={move}>{desc}</li>
            )
        })

        let status; 
        if(winner){
            status = "Winner: " + winner
        } 
        else if(!current.squares.includes(null)){
            status = "It's a draw!"
        }
        else {
            status = "Next player: " + (this.state.xIsNext? "X" : "O")
        }


        return (
            <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>
                    <button onClick={() => this.reverseMoves()}>Reverse Order</button>
                    {this.state.isReversed? moves : moves.reverse()}
                
                </ol>
            </div>
            <div>
                <div className="detailed-moves">Detailed Moves</div>
                <ol>
                    <button onClick={() => this.reverseMoves()}>Reverse Order</button>
                    {this.state.isReversed? detailedMoves : detailedMoves.reverse()}
                </ol>
            </div>
            </div>
        );
    }
}

function calculateWinner(squares){
    const lines = [
        [0, 1, 2], 
        [3, 4, 5], 
        [6, 7, 8], 
        [0, 3, 6], 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], 
        [2, 4, 6]
    ]
    for(let i=0; i< lines.length; i++){
        const [a, b, c] = lines[i]
        // console.log(squares)
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            Array.from(document.querySelectorAll(".square"))[a].style.backgroundColor = "#7fffd4"
            Array.from(document.querySelectorAll(".square"))[b].style.backgroundColor = "#7fffd4"
            Array.from(document.querySelectorAll(".square"))[c].style.backgroundColor = "#7fffd4"
            return squares[a]
        }
    }
    return null
}

  // ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);