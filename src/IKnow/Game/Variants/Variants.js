import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../context';
import $ from 'jquery';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function Variants(props) {
	const { UpdateGamePage } = useContext(Context);
	function IsItRight(name, idChose){
		$(".overlay").append('<div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; z-index: 9999; background: transparent"></div>');
		var arVariants = $(".variant").not($("#answer_"+idChose));
		setTimeout(() => $(arVariants[0]).css({'transform' : 'translateX(-2000px)'}),100, arVariants);
		setTimeout(() => $(arVariants[1]).css({'transform' : 'translateX(-2000px)'}),1000, arVariants);
		setTimeout(() => $(arVariants[2]).css({'transform' : 'translateX(-2000px)'}),2000, arVariants);
		setTimeout(() =>
		{if (name === props.filmName)
				{
					$("#answer_"+idChose).css({'backgroundColor' : '#06cb43', 'color':'#fff'});
					setTimeout(() =>
					{
						props.setScore(parseFloat(props.score) + parseFloat(props.currentTime));
						UpdateGamePage(-6);
					}, 1000);
				}
				else {
					$("#answer_"+idChose).css({'backgroundColor' : '#ff003c', 'color':'#fff'});
					setTimeout(() =>
					{
						UpdateGamePage(-7);
					}, 1000);
		
				}}, 3000);
	}
	var array = [];
	props.otherNames.map((elem) => {array.push(elem);});
	array.push(props.filmName);
	
	array = shuffle(array);
	return (
		<div className="overlay">
			<div style={{display:'table',width:'100%',height:'100%'}}>
			  <div style={{display:'table-cell',verticalAlign:'middle'}}>
			    <div style={{textAlign:'center', paddingTop: '40px'}}>
				    <div style={{height: '25px', textAlign: 'center', padding: '0, 10px', position: 'fixed', top: '0', background: '#fbf4f5', width: '100%'}}>
				    	<span className="score" style={{float:'left', paddingLeft: '10px'}}>Счёт: {(props.score).toFixed(1)}</span>
				    	<span className="scoreNow">{props.currentTime}</span>
				    	<span className="NumberQuestion" style={{float:'right', paddingRight: '10px'}}>Вопрос: {props.NumberQuestion+1}/5</span>
				    </div>
			    	<button id={"answer_1"} className="variant" onClick={() => IsItRight(array[0], 1)}>{array[0]}</button>
			    	<button id={"answer_2"} className="variant" onClick={() => IsItRight(array[1], 2)}>{array[1]}</button>
			    	<button id={"answer_3"} className="variant" onClick={() => IsItRight(array[2], 3)}>{array[2]}</button>
			    	<button id={"answer_4"} className="variant" onClick={() => IsItRight(array[3], 4)}>{array[3]}</button>
			    </div>
			  </div>
			</div>
		</div>
		);
}

export default Variants;
