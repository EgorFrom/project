import React, { useEffect, useContext, useState } from 'react';
import Context from '../context';
import Loader from '../loader';
import '../css/preLoader.css';
import Popup from "reactjs-popup";
import Header from '../Header/header';
import Table from 'react-bootstrap/Table';
import Line from './Line/Line';
import Timer from "react-compound-timer";

function get00Today(){
	return new Date(new Date().getTime() - (new Date().getHours() * 60 * 60 * 1000 + new Date().getMinutes() * 60 * 1000 + new Date().getSeconds() * 1000 + new Date().getMilliseconds()));
}

function nextSunday(){
  return new Date(get00Today().getTime() + ((6-new Date().getDay() +7) %7 +1) *86400000);
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (parseInt(a[property]) < parseInt(b[property])) ? -1 : (parseInt(a[property]) > parseInt(b[property])) ? 1 : 0;
        return result * sortOrder;
    }
}

function Statistics(props) {
  const [arTable, setArTable] = useState(null);
  const [popupState, setPopupState] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [loading, setLoading] = useState(true);
	const { UpdatePage } = useContext(Context);

  useEffect(() => {
  	fetch("https://eardrum.ru:8890/getRating", {
  		  		      method: "POST",
  		  		      headers: {
  		  		        "Content-type": "application/json",
  		  		        "accept": "application/json"
  		  		      }
  		  		    }).then(resp => {
  		  		      if (resp.status === 200) {
  		  		        return resp.json();
  		  		      } else return "Error 40007";
  		  		    }).then(data => {
  		  		    	if (data.error != undefined)
  		  		    	{
  						  		openModal("Ошибка: "+ data.error);
  		  		    		setLoading(false);
  		  		    	} else {
  		  		    		setArTable(data.table);
  		  		    		setLoading(false);
  		  		    	}
  		  		    });
  }, [loading]); 


	function openModal (text){
    setPopupText(text);
    setPopupState(true);
  }
  function closeModal () {
    setPopupState(false);
  }
	return (
			<div style={{paddingBottom: '70px'}}>
      	{loading && <Loader />}
        <Header pageName={"Statistics"}/>
      	<Table responsive size="sm" hover>
      	  <thead>
      	    <tr>
      	      <th style={{fontWeight: '400', fontSize: '0.8rem'}}>#</th>
      	      <th style={{fontWeight: '400', fontSize: '0.8rem'}}>Nickname</th>
      	      <th style={{fontWeight: '400', fontSize: '0.8rem'}}>Кол-во игр</th>
      	      <th style={{fontWeight: '400', fontSize: '0.8rem'}}>Правильные ответы</th>
      	      <th style={{fontWeight: '400', fontSize: '0.8rem'}}>Счет</th>
      	      <th style={{fontWeight: '400', fontSize: '0.8rem'}}>Приз</th>
      	    </tr>
      	  </thead>
      	  <tbody>
      	  	{ 
      	  			arTable != null?arTable.map((element, index) => {
		      	  		return <Line index={index} key={index} element={element} />
      	  			}):'wait..'
      	  		
      	  	}
      	  </tbody>
      	</Table>
      	<div className="myPocketShop" style={{textAlign: 'center', padding: '5px'}}>
					<div className="myPocketShop_title" style={{textAlign: 'left'}}>До получения призов:</div>
      		<div style={{letterSpacing: '2px'}}>
	      		<Timer
	      		    initialTime={nextSunday().getTime() - new Date()}
	      		    direction="backward"
	      		>
	      		    <Timer.Days />: 
	      		    <Timer.Hours />:
	      		    <Timer.Minutes />:
	      		    <Timer.Seconds />
	      		</Timer>
      		</div>
      	</div>
			</div>
		)
}
export default Statistics;
