import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../context';

function Start() {
	const { UpdateGamePage } = useContext(Context);
	return (
		<div className="overlay">
			<div style={{display:'table',width:'100%',height:'100%'}}>
			  <div style={{display:'table-cell',verticalAlign:'middle'}}>
			    <div style={{textAlign:'center'}}><button className="Start" onClick={() => {UpdateGamePage(0)}}>Жмяк</button></div>
			  </div>
			</div>
		</div>
		)
}

export default Start;
