import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../context';
import Button from 'react-bootstrap/Button';
import { Link, animateScroll as scroll } from "react-scroll";
import { StickyContainer, Sticky } from 'react-sticky';

var source,len,now=0,delay=50,letters=1;
var timerIdShow, flagFirstly = true;
var timerId;

function Show(props) {
	const { UpdateGamePage } = useContext(Context);
  const [text, setText] = useState("");
	
	useEffect(() => {
		if (flagFirstly)
		{
			show_text();
			flagFirstly = false;
		}
  });

	function show_text()
	{
    source = props.source;
    len = source.length;
    show();
	}
	
	function show()
	{
		scroller();
    setText(source.substr(0, now));
    now+=letters;

    if(now<len)
    {	
    	clearTimeout(timerIdShow);
    	timerIdShow = setTimeout(() => show(),delay);
    }
    else
    {
    	clearTimeout(timerIdShow);
    	//showVariants
    }
  }
	function Next(e) {
		e.preventDefault();
		clearTimeout(timerIdShow);
		props.setCurrentTime((100-(100/len)*now).toFixed(1));
		source = "";
		len = 0;
		now=0;
		delay=50;
		letters=1;
		UpdateGamePage(props.NumberQuestion+1);
  	flagFirstly = true;
	}

	function scroller(){
    scroll.scrollToBottom(); 
	}
	return (
			<div>
				<div id="box">
					<div style={{height: '25px', textAlign: 'center', padding: '0, 10px', position: 'fixed', top: '0', background: '#fbf4f5', width: '100%'}}>
						<span className="score" style={{float:'left', paddingLeft: '10px'}}>Счёт: {(props.score).toFixed(1)}</span>
						<span className="scoreNow">{(100-(100/len)*now).toFixed(1)>10?(100-(100/len)*now).toFixed(1):10}</span>
						<span className="NumberQuestion" style={{float:'right', paddingRight: '10px'}}>Вопрос: {props.NumberQuestion+1}/5</span>
					</div>
					<div id="pageText" style={{height: '95vh'}}>
						<div style={{minHeight: '85vh', paddingBottom: '80px', paddingTop: '40px', paddingLeft: '5px', paddingRight: '5px'}}>
							{text}
						</div>
						<Button style={{position: 'fixed', bottom: '0', left: '0', width: '100%'}} className="IKnow" onClick={(e) => {Next(e);}}>ЯСМотрел!</Button>
					</div>
				</div>
			</div>
		)
}
export default Show;
