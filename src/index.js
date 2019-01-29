import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" 
        onClick={ props.onClick }>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square 
        value = {this.props.squares[i][j]}
        onClick = {() => this.props.onClick(i, j)}
      />
    );
  }
  // render a row of squares
  renderSquareRow(i){
    let returnValue = [];
    for(let j = 0; j < 3; j++){
      returnValue.push(<Square 
        value = {this.props.squares[i][j]}
        onClick = {() => this.props.onClick(i, j)}
        key = {j}
        />);
    }
    return returnValue;
  }
  // render multiple rows of squares
  renderSquares(){
    let returnValue = [];
    for(let i = 0; i < 3; i++){
      returnValue.push(<div 
        className="board-row" key={i}>
        {this.renderSquareRow(i)}
        </div>);      
    }
    return returnValue;
  }
  render() {
    return (
      <div>
        {this.renderSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)),
        lastStep_horizontal: null,
        lastStep_vertical: null
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }
  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) == 0,
    });
  }
  calculateWinner(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const h = current.lastStep_horizontal; 
    if(h == null)
      return null;   
    const s = current.squares;
    if(s[h][0] && s[h][0] == s[h][1] && s[h][1] == s[h][2])
      return s[h][0];
    const v= current.lastStep_vertical;
    if(s[0][v] && s[0][v] == s[1][v] && s[1][v] == s[2][v])
      return s[0][v];
    if(h == v && s[0][0] && s[0][0] == s[1][1] && s[1][1] == s[2][2])
      return s[h][v];
    if(h + v == 2 && s[0][2] && s[0][2] == s[1][1] && s[1][1] == s[2][0])
      return s[h][v];
    return null;
  }
  handleClick(i, j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = Array();
    for(let i = 0; i < current.squares.length; i++){
      let square_row_copy = current.squares[i].slice();
      squares.push(square_row_copy);
    }
    if(squares[i][j] || this.calculateWinner()){
      return;
    }
    squares[i][j] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastStep_horizontal: i,
        lastStep_vertical: j
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner();
    const moves = history.map((step, move) => {
      const h = step.lastStep_horizontal, v = step.lastStep_vertical;
      const desc = move ?
        'Go to move #' + move + `(${h}, ${v})`:
        'Go to game start';
      const button_class = this.state.stepNumber == move ? 'button_bold' : 'button_normal';
      return (
        <li key={move}> 
          <button onClick={() => this.jumpTo(move)} className={button_class}>{desc}</button>
        </li>
      );
    })

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick = {(i, j) => this.handleClick(i, j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }  
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


