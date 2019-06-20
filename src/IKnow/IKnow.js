import React, { useEffect, useState, useContext } from 'react';
import $ from 'jquery';
import Loader from '../loader';
import '../css/preLoader.css';
import Game from './Game/Game';
import Context from '../context';
import Popup from "reactjs-popup";
var array5films = new Array(5);



function IKnow(props) {
  const [loading, setLoading] = useState(true);
  const [popupState, setPopupState] = useState(false);
  const [popupText, setPopupText] = useState("");
  const { UpdatePage } = useContext(Context); 

  let url = (props.category == undefined)?('get5films'):('get5films/'+props.category);
	function get5() {
	if (loading)
  {
			fetch("https://eardrum.ru:8890/IKnow/"+url, {
			  	method: "POST",
			  	headers: {
			  		"Content-type": "application/json",
			  		"accept": "application/json"
			  	}
			  }).then(resp => {
			  	if (resp.status === 200) {
			  		return resp.json();
			  	} else return "Error 40001";
			  }).then(data => { 
							fetch("https://eardrum.ru:8890/IKnow/get3FalseVariants", {
			  		  	method: "POST",
			  		  	headers: {
			  		  		"Content-type": "application/json",
			  		  		"accept": "application/json"
			  		  	},
			  		  	body: JSON.stringify({films: data})
			  		  }).then(resp => {
			  		  	if (resp.status === 200) {
			  		  		return resp.json();
			  		  	} else return "Error 40004";
			  		  }).then(data2 => {
		  		  		let i = -1; data.forEach((element) => {i++; array5films[i] = {}; array5films[i]["descr"] = element["descr"].slice().replace("Описание фильма", "").replace("Описание мультфильма",""); array5films[i]["filmName"] = element["filmName"].slice(); array5films[i]["otherNames"] = [data2[i][0]["filmName"],data2[i][1]["filmName"],data2[i][2]["filmName"]]; }); setLoading(false);});		  		  
				});
		} 
	}
	useEffect(() => {
		get5();
  });	

  function openModal (text){
      setPopupText(text);
      setPopupState(true);
    }
    function closeModal () {
      setPopupState(false);
    }

  if (!loading) {
  	return (
	    <Context.Provider value={{UpdatePage: UpdatePage}}>
  			<Game arrayFilms={array5films} />
  			<Popup
				  open={popupState}
				  closeOnDocumentClick
				  onClose={() => closeModal()}
				>
				  <div className="modal" style={{display: 'block', position: 'relative'}}>
				    <a className="close" onClick={() => closeModal()}>
				      &times;
				    </a>
				    {popupText}
				  </div>
				</Popup>
  	  </Context.Provider>
  		);
  } else {
  	return (
  		<Loader />
  		);
  }
}

export default IKnow;
