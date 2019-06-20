import React, { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Context from '../../../context';
import firin from '../../../firin.png';
import hrizolit from '../../../hrizolit.png';
import bukli from '../../../bukli.png';
import margin from '../../../margin.png';
import vaarit from '../../../vaarit.png';

function Result(props) {
  const { UpdatePage } = useContext(Context);  
	function updateRegToken(viewItem) {
	    localStorage.setItem (1, JSON.stringify(viewItem));
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	var gems = getRandomInt(1, 10),
	nameGem = "",
	dbnameGem = "",
	countGem = 0,
	gem;
	switch (gems) {
    case 1:
    case 2:
      nameGem = "Фирины: ";						        
      dbnameGem = "firini";
      gem = firin;
      break;
    case 3:
    case 4:
      nameGem = "Хризолиты: ";
      dbnameGem = "hrizoliti";
      gem = hrizolit;
      break;
    case 5:
    case 6:
      nameGem = "Марджины: ";
      dbnameGem = "margini";
      gem = margin;
      break;
    case 7:
    case 8:
      nameGem = "Ваариты: ";
      dbnameGem = "vaariti";
      gem = vaarit;
      break;
    case 9:
      nameGem = "Букли: ";
      dbnameGem = "bukli";
      gem = bukli;
      break;
	}
	countGem = getRandomInt(1,10);

	if (countGem < 6)
		countGem = 1;
	else if (countGem < 9)
		countGem = 2;
	else countGem = 3;

	countGem = Math.round(props.score / getRandomInt(80, 130)) * countGem;


	useEffect(() => {
		if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
		{
			fetch("https://eardrum.ru:8890/user/statistics", {
		 		  	method: "POST",
		 		  	headers: {
		 		  		"Content-type": "application/json",
		 		  		"accept": "application/json"
		 		  	},
		 		  	body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"], "countRightAns": props.countRightAns, "score": (props.score).toFixed(1)})
		 		  }).then(resp => {
		 		  	if (resp.status === 200) {
		 		  		return resp.json();
		 		  	} else { console.log("Errka"); return "Error 40001"};
		 		  }).then(data => {
			 		  if (data.error != undefined)
			 		  {
							console.log("error");
			 		   	localStorage[1] = 'undefined';
              UpdatePage("Profile");
            }
			 		});
			fetch("https://eardrum.ru:8890/user/addGems", {
		 		  	method: "POST",
		 		  	headers: {
		 		  		"Content-type": "application/json",
		 		  		"accept": "application/json"
		 		  	},
		 		  	body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"], "countGems": countGem, "nameGems": dbnameGem})
		 		  }).then(resp => {
		 		  	if (resp.status === 200) {
		 		  		return resp.json();
		 		  	} else { console.log("Errka"); return "Error 40001"};
		 		  }).then(data => {
			 		  if (data.error != undefined)
			 		  {
			 		    localStorage[1] = 'undefined';
              UpdatePage("Profile");
            }
			 		  else
			 		  {
			 		    updateRegToken(data);
							setTimeout(() => props.init(),2400);
							setTimeout(() => UpdatePage("Profile"),2500);
			 		  }
		 			});
		} else {
			setTimeout(() => props.init(),2400);
			setTimeout(() => UpdatePage("Profile"),2500);
		}
  });	

	return (
		<div className="overlay">
			<div style={{display:'table',width:'100%',height:'100%'}}>
			  <div style={{display:'table-cell',verticalAlign:'middle'}}>
			    <div className="result-text" style={{textAlign:'center'}}>
						Твой счет: {(props.score).toFixed(1)} <br />
						{(localStorage[1] == 'undefined' || localStorage[1] == undefined) && <div><div>Войдя в аккаунт, вы бы получили <img src={gem} style={{width: '50px'}} /> {nameGem} {countGem}</div>
							<Button onClick={() => {UpdatePage("Enter")}}>Вход и Регистрация</Button>
						  </div>}
						{(localStorage[1] != 'undefined' && localStorage[1] != undefined)  && <div> Ты получаешь <img src={gem} style={{width: '50px'}} /> {nameGem} {countGem} </div>}
			    </div>
			  </div>
			</div>
		</div>
		);
}

export default Result;
