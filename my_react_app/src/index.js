/*
  Toggle button to sort moves
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
	    <button className={props.winner?'winner-square':'square'} onClick={()=>props.onClick()}>
	    {props.value}
	    </button>
    );
}
class Board extends React.Component {
    renderSquare(i, winner){
	return <Square winner={winner} value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>;
    }
    render() {
	return (
		<div>
		{Array.from({length: 3},(v,k)=>k).map(i=>{
		    const row = Array.from({length: 3}, (v,k)=>k).map(j=>{
			const square = i*3+j;
			let winnerSquare = null;
			if(this.props.status.finished)
			    if(this.props.status.won)
				winnerSquare = this.props.status.row.includes(square);
			return (
			<span key={j}>
				{this.renderSquare(square, winnerSquare)}
			</span>);
		    });
		    return (
			<div key={i} className="board-row">{row}</div>
		    );
		})}
		</div>
	);
    }
}
class Game extends React.Component{
    constructor(props){
	super(props);
	this.state = {
	    history: [{squares: Array(9).fill(null), move: null}],
	    xIsNext: true,
	    stepNumber: 0
	}
    }
    jumpTo(step){
	this.setState({
	    stepNumber: step,
	    xIsNext: step%2 === 0
	});
    }
    handleClick(i){
	const history = this.state.history.slice(0, this.state.stepNumber+1);
	const current = history[history.length-1];
	const squares = current.squares.slice();
	const status = gameStatus(squares);
	if(status.finished || squares[i])
	    return;
	squares[i] = this.state.xIsNext?'X':'O';
	this.setState({
	    history: history.concat([{squares: squares, move: i}]),
	    stepNumber: history.length,
	    xIsNext: !this.state.xIsNext,
	});
    }
    render(){
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	let status = gameStatus(current.squares);

	const moves = history.map((step, move)=>{
	    const desc = move ? 'Go to move #'+move: 'Go to start';
	    return (
		    <li key={move} className={this.state.stepNumber===move?'current-move':''}>
		    <button onClick={()=>this.jumpTo(move)}>{desc}</button>
		    {move%2===0?(move!==0?'O @':''):'X @'}
		{step.move || step.move===0?'('+(Math.floor(step.move/3)+1)+', '+
		 ((step.move%3)+1)+') ':''} 
		    </li>
	    );
	});

	let statusString;
	if (status.finished){
	    statusString = 'Game finished!';
	    if(status.won)
		statusString += ' Winner: '+status.winner;
	    else
		statusString += " It's a tie!";
	}
	else
	    statusString = 'Next : '+(this.state.xIsNext?'X': 'O');

	return (
		<div className="game">
		<div className="game-board">
		<Board status={status} squares={current.squares} onClick={(i)=>this.handleClick(i)}/>
		</div>
		<div className="game-info">
		<div>{statusString}</div>
		<ul>{moves}</ul>
		</div>
		</div>
	);
    }
}

ReactDOM.render (
	<Game/>,
    document.getElementById('root')
);



function gameStatus(squares){
    const winningLines = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
    ];
    for (let i=0; i<winningLines.length; i++){
	const [a, b, c] = winningLines[i];
	if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
	    return {
		finished: true,
		won:true,
		winner: squares[a],
		row: winningLines[i]
	    };
    }
    for (let i=0; i<9; i++){
	if(!squares[i])
	    return {
		finished: false,
	    };
    }
	
    return {
	finished: true,
	won: false,
    };

}
