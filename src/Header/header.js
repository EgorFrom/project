import React, { useContext, useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Context from '../context';
import ButtonIn from './ButtonIn/ButtonIn';

function Header(props) {
  const [stamina, setStamina] = useState(100);
	const { UpdatePage } = useContext(Context);

  useEffect(() => {
	  if (localStorage[1] != 'undefined' && localStorage[1] != undefined)
	  {
  		fetch("https://eardrum.ru:8890/user/getStamina", {
 		  	method: "POST",
 		  	headers: {
 		  		"Content-type": "application/json",
 		  		"accept": "application/json"
 		  	},
 		  	body: JSON.stringify({token: JSON.parse(localStorage[1])["access_token"]})
 		  }).then(resp => {
 		  	if (resp.status === 200) {
 		  		return resp.json();
 		  	} else return "Error 40002";
 		  }).then(data => { 
 		  	if (data.error != undefined){
          localStorage[1] = 'undefined';
          UpdatePage("Enter");
        } else {
 		  		setStamina(data.stamina);
 				}
 			});
 		}
  }); 

	return (
		<Navbar bg="light" expand="lg" style={{paddingBottom: '15px', zIndex: '1'}}>
		  <Navbar.Brand><ButtonIn /></Navbar.Brand>
		  <Navbar.Toggle aria-controls="basic-navbar-nav" />
		  <Navbar.Collapse id="basic-navbar-nav">
		    <Nav className="mr-auto">
		      <button className="header_play" onClick={() => UpdatePage('IKnow')}>Играть в ЯСмотрел!</button>
		      {props.pageName != "Profile" && <button className="header_play" onClick={() => UpdatePage('Profile')}>На главную</button>}
		      {props.pageName != "Shop" && <button className="header_play" onClick={() => UpdatePage('Shop')}>В магазин</button>}
		      {props.pageName != "Statistics" && <button className="header_play" onClick={() => UpdatePage('Statistics')}>Рейтинг</button>}
		      {props.pageName != "BuyCategory" && <button className="header_play" onClick={() => UpdatePage('BuyCategory')}>Играть в ЯСмотрел по категориям</button>}
		    </Nav>
		  </Navbar.Collapse>
		  
		  	<div className="stamina" style={{width: stamina + '%', background: 'rgb('+(6+1.5*(100 - stamina))+', '+(203-1.5*(100 - stamina))+', '+(67-1.5*(100 - stamina))+')'}}></div>
		  	{(stamina < 50 && props.pageName === "Profile")&& <div className="stamina-energy" onClick={() => UpdatePage('Shop')}><div className="stamina-energy_img"></div>Обменять камни на энергию</div>}
		</Navbar>
		);
} 

Header.propTypes = {
  pageName: PropTypes.string.isRequired
}

export default Header;
