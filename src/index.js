import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var DIM = 10;
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
    for(let j = 0; j < DIM; j++){
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
    for(let i = 0; i < DIM; i++){
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
function check_winner_one_direction(squares, start_x, start_y, delta_x, delta_y){
  let player = squares[start_x][start_y];
  let x_pos = start_x, y_pos = start_y, counter = 1;
  while(x_pos >=0 && x_pos < DIM && y_pos >=0 && y_pos < DIM){
    x_pos += delta_x;
    y_pos += delta_y;
    if(squares[x_pos][y_pos] != player || counter == 5){
      break;
    }
    counter += 1;
  }
  return counter == 5;
}
class Game extends React.Component {
  constructor(props){
    super(props);
    let double_squares = Array();
    for(let i = 0; i < DIM; i++){
      double_squares.push(Array(DIM).fill(null));
    }
    this.state = {
      history: [{
        squares: double_squares,
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
    const v= current.lastStep_vertical;
    const directions = [[1,1],[1,0],[1,-1],[0,1],[0,-1],[-1,0],[-1,1],[-1,-1]];
    for(let i = 0; i < 8; i++){
      let delta_x = directions[i][0], delta_y = directions[i][1];
      if(check_winner_one_direction(s, h, v, delta_x, delta_y)){
        return s[h][v];
      }
    }
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


