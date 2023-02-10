import './App.css';
import { useState } from 'react';

function Square({value, onSquareClick, isHighlight}) {
  return <button 
    className='square' 
    style={{ backgroundColor : isHighlight ? 'lightgreen' : '#fff'}} 
    onClick={onSquareClick}>{value}
  </button>;
}

function Board({xIsNext, squares, onPlay}) {
  
  const board = [];
  const [winner, line] = calculateWinner(squares);

  for(let i = 0; i < 3; i++){
    const row = [];
    for(let j = 0; j < 3; j++){
      const order = 3 * i + j;
      row.push(
        <Square 
          isHighlight={order === line[0] || order === line[1] || order === line[2]}
          value={squares[order]} 
          onSquareClick={() => handleClick(order)}
        />
      )
    }
    board.push(<div className="board-row">{row}</div>)
  }

  let status;
  if (winner) {
    status = "Winner: " + winner.toUpperCase();
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = [...squares];
    if (xIsNext) {
      nextSquares[i] = "x";
    } else {
      nextSquares[i] = "o";
    }
    onPlay(nextSquares);
  }

  return (
    <div className="board">
      <div className='status'>{status}</div>
      {board}
    </div>
  );
}

function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares){
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(move){
    setHistory(history.slice(0, move + 1));
    setXIsNext(move % 2 === 0 ? true : false);
  }

  const moves = history.map((squares, move) => {
    let description;
    const lastMove = history.length - 1;
    if (move > 0 && move < lastMove){
      description = 'Go to move #' + move;
    } else if (move === 0) {
      description = 'Go to game start';
    } else if (move === lastMove){
      description = 'You are at move #' + move;
    }

    return(
      <li key={move}>
        {move !== lastMove ? <button onClick={() => jumpTo(move)} >{description}</button> : <h4>{description}</h4>}
      </li>
    )
  })

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner (squares){
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for(let i=0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a],[a, b, c]];
    }
  }
  return [null, []];
}

export default Game;
