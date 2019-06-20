import React, { useEffect, useState, useContext } from 'react';
import Start from './Start/Start';
import Show from './Show/Show';
import Result from './Result/Result';
import Overlay from './Overlay/Overlay';
import Variants from './Variants/Variants';
import Context from '../../context';

var NumberQuestion = 0;
var score = 0;
var currentTime = 0;
var countRightAns = 0;
function init(){
	NumberQuestion = 0;
	score = 0;
	currentTime = 0;
	countRightAns = 0;
}

function Game(props) {
  const [number, setNumber] = useState(1);
  const [gamePage, setGamePage] = useState(-1);
  const { UpdatePage } = useContext(Context);  
  
  function setCurrentTime(val){
		currentTime = val;
  }
  function setScore(val){
  	score = val;
  }
	function UpdateGamePage(count) {
		if (count === 0)
			//first page
			setGamePage(count);
		if (count > 0)
		{	
			//variants
			setGamePage(-5);
		}
		if (count < -5 & count > -8){
			//show addedScore
			setGamePage(count);
		}
		if (count <= -8){
			//3
			setTimeout(() => setGamePage(-4),1000);
			//2
			setTimeout(() => setGamePage(-3),2000);
			//1
			setTimeout(() => setGamePage(-2),3000);

			setTimeout(function(){
				NumberQuestion++;
				//nextQuestion
				setGamePage(NumberQuestion);	
			} ,4000);
		}
	}
	if (gamePage === -7)
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Overlay NumberQuestion={NumberQuestion} fail={currentTime} /></Context.Provider>);
	if (gamePage === -6)
  {	
  	countRightAns++;
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Overlay NumberQuestion={NumberQuestion} yourScore={currentTime} /></Context.Provider>);
  }
	if (gamePage === -5)
		{return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Variants 
					NumberQuestion={NumberQuestion} 
					currentTime={currentTime} 
					setCurrentTime={setCurrentTime} 
					score={score} 
					setScore={setScore} 
					filmName={props.arrayFilms[NumberQuestion]["filmName"]} 
					otherNames={props.arrayFilms[NumberQuestion]["otherNames"]} /></Context.Provider>);}
	if (gamePage === -4)
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Overlay NumberQuestion={NumberQuestion} schet={3} /></Context.Provider>);
	if (gamePage === -3)
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Overlay NumberQuestion={NumberQuestion} schet={2} /></Context.Provider>);
	if (gamePage === -2)
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Overlay NumberQuestion={NumberQuestion} schet={1} /></Context.Provider>);
	if (gamePage === -1)
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Start /></Context.Provider>);
	if (gamePage < 5)
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage}}><Show NumberQuestion={NumberQuestion} score={score} source={props.arrayFilms[NumberQuestion]["descr"]} setCurrentTime={setCurrentTime}/></Context.Provider>);
	else 
		return (<Context.Provider value={{UpdateGamePage: UpdateGamePage, UpdatePage: UpdatePage}}><Result init={init} score={score} countRightAns={countRightAns}/></Context.Provider>);
}

export default Game;
