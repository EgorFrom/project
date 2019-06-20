import React, { useEffect, useContext, useState } from 'react';
import Lot from '../Shop/Lot/Lot';
import Context from '../context';
import firin from '../firin.png';
import hrizolit from '../hrizolit.png';
import bukli from '../bukli.png';
import margin from '../margin.png';
import vaarit from '../vaarit.png';
import energy from '../energy.png';
import Loader from '../loader';
import '../css/preLoader.css';
import Popup from "reactjs-popup";
import Header from '../Header/header';

var gems = null;
var arrayLots = null;

function updateRegToken(viewItem) {
    localStorage.setItem (1, JSON.stringify(viewItem));
}

function BuyCategory(props) {
  const [popupState, setPopupState] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [loading, setLoading] = useState(true);
	const { UpdatePage } = useContext(Context);
 
  useEffect(() => {
    if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
    {
    	fetch("https://eardrum.ru:8890/shop/getLotsCategory", {
    	      method: "POST",
    	      headers: {
    	        "Content-type": "application/json",
    	        "accept": "application/json"
    	      },
    	      body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
    	    }).then(resp => {
    	      if (resp.status === 200) {
    	        return resp.json();
    	      } else return "Error 40005";
    	    }).then(data1 => {
    	    	if (data1.error != undefined)
    	    	{
    	    		localStorage[1] = 'undefined';
    	    		openModal("Войдите в аккаунт!");
              setTimeout(() => {closeModal()}, 1500);
              setTimeout(() => {UpdatePage("Enter");}, 1600);
    	    	}
    	    	else {
	    	    	arrayLots = data1;
	    	    	arrayLots = arrayLots.map((elem) => {elem['cost'] = elem['cost'].split(','); return elem;});
				      fetch("https://eardrum.ru:8890/user/gems", {
				            method: "POST",
				            headers: {
				              "Content-type": "application/json",
				              "accept": "application/json"
				            },
				            body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
				          }).then(resp => {
				            if (resp.status === 200) {
				              return resp.json();
				            } else return "Error 40006";
				          }).then(data => { 
				            gems = {};
				            gems["firini"] = data.firini;
				            gems["hrizoliti"] = data.hrizoliti;
				            gems["bukli"] = data.bukli;
				            gems["margini"] = data.margini;
				            gems["vaariti"] = data.vaariti;
				    				setTimeout(() => {setLoading(false);}, 0);
				          });
				    }
			    });
    } else {
      openModal("Пора войти в аккаунт!");
      setTimeout(() => {closeModal()}, 1500);
      setTimeout(() => {UpdatePage("Enter");}, 1600);
    }
  }); 

  function openModal (text){
    setPopupText(text);
    setPopupState(true);
  }
  function closeModal () {
    setPopupState(false);
  }

  function buy(id){
  	let index = 0;
  	for (var i = 0; i < arrayLots.length; i++)if (arrayLots[i]['id'] == id){index = i;break;}

  	if (arrayLots[index]['cost'][0] <= gems["firini"] &&
  			arrayLots[index]['cost'][1] <= gems["hrizoliti"] &&
  			arrayLots[index]['cost'][2] <= gems["bukli"] &&
  			arrayLots[index]['cost'][3] <= gems["margini"] &&
  			arrayLots[index]['cost'][4] <= gems["vaariti"]
  		)
  	{
  			fetch("https://eardrum.ru:8890/shop/buy", {
  		  		      method: "POST",
  		  		      headers: {
  		  		        "Content-type": "application/json",
  		  		        "accept": "application/json"
  		  		      },
  		  		      body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"], id: id})
  		  		    }).then(resp => {
  		  		      if (resp.status === 200) {
  		  		        return resp.json();
  		  		      } else return "Error 40007";
  		  		    }).then(data => {
  		  		    	if (data.error != undefined)
  		  		    	{
  						  		openModal("Ошибка: "+ data.error);
  		  		    	} else {
                    if (data.action != undefined)
                    {
                      updateRegToken(data.token);
                      UpdatePage("BuyIKnowCategory/"+data.action);
                    }
                    else if (data.message != undefined){
                      openModal(data.message);
                    } else {
    		  		    		updateRegToken(data);
    		  		    		setLoading(true);
    						  		openModal("Успешная покупка!");
    						  		setTimeout(() => {closeModal();}, 1500);
  		  		    	  }
                  }
  		  		    });
  	}
  	else
  		openModal("Недостаточно камней");
  }
								//f,h,b,m,v 
	return (
		<div style={{paddingBottom: '120px'}}>
      {loading && <Loader />}
      <Header pageName={"BuyCategory"}/>
      {
        arrayLots != null?arrayLots.map((element, index) => {
          return <Lot key={index} id={arrayLots[index]['id']} cost={arrayLots[index]['cost']} name={arrayLots[index]['name']} img={arrayLots[index]['img']} buy={buy}/>
        }):'wait..'
      }

			
			<div className="myPocketShop">
				<div className="myPocketShop_title">У вас есть:</div>
				<div className="myPocketShop_gems">
					<div className="lot_gemBlock"><span className="lot_gemName"><img src={firin} style={{width: '50px'}} />x</span><span className="lot_gemCost">{gems?gems["firini"]:'Error'}</span></div>
					<div className="lot_gemBlock"><span className="lot_gemName"><img src={hrizolit} style={{width: '50px'}} />x</span><span className="lot_gemCost">{gems?gems["hrizoliti"]:'Error'}</span></div>
					<div className="lot_gemBlock"><span className="lot_gemName"><img src={bukli} style={{width: '50px'}} />x</span><span className="lot_gemCost">{gems?gems["bukli"]:'Error'}</span></div>
					<div className="lot_gemBlock"><span className="lot_gemName"><img src={margin} style={{width: '50px'}} />x</span><span className="lot_gemCost">{gems?gems["margini"]:'Error'}</span></div>
					<div className="lot_gemBlock"><span className="lot_gemName"><img src={vaarit} style={{width: '50px'}} />x</span><span className="lot_gemCost">{gems?gems["vaariti"]:'Error'}</span></div>
				</div>
			</div>
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
		</div>
		)
}
export default BuyCategory;
