import React, { useEffect, useContext } from 'react';
import Context from '../../../context';


function Overlay(props) {
	const { UpdateGamePage } = useContext(Context);
	useEffect(() => {
			if (props.yourScore || props.fail)
				setTimeout(() => UpdateGamePage(-8),1500);
  });
	return (
		<div className="overlay">
			<div style={{display:'table',width:'100%',height:'100%'}}>
			  <div style={{display:'table-cell',verticalAlign:'middle'}}>
			    <div style={{textAlign:'center'}}>
			    	{props.schet && <button className="Start">{props.schet}</button>}
			    	{props.yourScore && <button className="Start">+{props.yourScore}</button>}
			    	{props.fail && <button className="Start">+0</button>}

			    </div>
			  </div>
			</div>
		</div>
		)
}

export default Overlay;