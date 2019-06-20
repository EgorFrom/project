import React, { useContext, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Context from '../../context';

function ButtonIn() {
  const [nickname, setNickname] = useState(null);
	const { UpdatePage } = useContext(Context);
		
	useEffect(() => {
	  if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
		{
		 	fetch("https://eardrum.ru:8890/user/nickname", {
		  		  	method: "POST",
		  		  	headers: {
		  		  		"Content-type": "application/json",
		  		  		"accept": "application/json"
		  		  	},
		  		  	body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
		  		  }).then(resp => {
		  		  	if (resp.status === 200) {
		  		  		return resp.json();
		  		  	} else return "Error 40003";
		  		  }).then(data => { setNickname(data.nickname);});
		} else { if (nickname != null) setNickname(null);}
  });	
	
	return (
		<div>
		{ (nickname != null)?nickname:(<Button onClick={() => {UpdatePage("Enter")}}>Вход и Регистрация</Button>)}</div>
	);
}

export default ButtonIn;