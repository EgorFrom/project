import React, { useEffect, useState } from 'react';
import Carousel from './Carousel/MyCarousel';
import Context from './context';
import Header from './Header/header';
import Enter from './Enter/enter';
import IKnow from './IKnow/IKnow';
import Popup from "reactjs-popup";
import Shop from "./Shop/Shop";
import BuyCategory from "./BuyCategory/BuyCategory";
import Statistics from './Statistics/Statistics';

var functions = require('./functions.js');

var category;

function updateUnregToken(viewItem) {
    localStorage.setItem (0, viewItem);
}
function updateRegToken(viewItem) {
    localStorage.setItem (1, JSON.stringify(viewItem));
}
function App() {
  const [popupState, setPopupState] = useState(false);
  const [popupText, setPopupText] = useState("");
  const [page, setPage] = React.useState("Profile");//Profile, Enter, IKnow, Shop
  useEffect(() => {
    if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
      functions.fetchMessages(openModal, closeModal);
  }, []); 
  function openModal (text){
    setPopupText(text);
    setPopupState(true);
  }
  function closeModal () {
    setPopupState(false);
  }

  function UpdatePage(name) {
    if (name.indexOf('IKnowCategory') > -1){
      if (name.indexOf('Buy') > -1){
        category = name.substring(17);
        name = name.substring(0,16);
      } else
      {
        category = name.substring(14);
        name = name.substring(0,13);
      }
      if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
      {
        functions.fetchIplayInEDG(updateRegToken);
      } 
    }
    if (name =="IKnow")
    {
      if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
        functions.fetchMinusStamina(setPage, name, openModal, closeModal, UpdatePage);
      else
        functions.fetchCanIPlay(setPage, name, openModal, closeModal, UpdatePage, updateUnregToken);
    } else if (name == "IKnowCategory"){
      if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
        functions.fetchCanIPlayEDGAndfetchMinusStamina(setPage, name, openModal, closeModal, UpdatePage);
      else 
        functions.fetchCanIPlay(setPage, name, openModal, closeModal, UpdatePage, updateUnregToken);
    } else if (name == "BuyIKnowCategory"){
        functions.fetchMinusStamina(setPage, name.substring(3), openModal, closeModal, UpdatePage);
    } else
    setPage(name);
  }
  return (
    <div>
      <Context.Provider value={{UpdatePage: UpdatePage}}>
        {page === "Profile" && <Header pageName={page}/>}
        {page === "Profile" && <Carousel />}
        {(page === "Registration" || page === "Enter") && <Enter pageName={page}/>}
        {page === "IKnow" && <IKnow />}
        {page === "IKnowCategory" && <IKnow category={category}/>}
        {page === "Shop" && <Shop />}
        {page === "BuyCategory" && <BuyCategory />}
        {page === "Statistics" && <Statistics />}
      </Context.Provider>
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
  );
}

export default App;
