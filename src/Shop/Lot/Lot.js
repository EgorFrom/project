import React, { useContext, useState } from 'react';
import Context from '../../context';
import Popup from "reactjs-popup";
import firin from '../../firin.png';
import hrizolit from '../../hrizolit.png';
import bukli from '../../bukli.png';
import margin from '../../margin.png';
import vaarit from '../../vaarit.png';

function Lot(props) {
  const [popupState, setPopupState] = useState(false);
	const { UpdateGamePage } = useContext(Context);
	
	function buy(){
		openModal();
	}
	
	function openModal (text){
	  setPopupState(true);
	}
	
	function closeModal () {
	  setPopupState(false);
	}

	function nextBuy() {
		closeModal();
		props.buy(props.id);
	}
	//f,h,b,m,v 
	return (
		<div className="module-lot">
			<button className="lot" onClick={() => buy()}>
				<div className="lot_name">Купить {props.img != "null" && <img src={props.img} style={{width: '25px'}} />} {props.name}</div>
				<div className="lot_cost">
					{props.cost[0] > 0 &&<div className="lot_gemBlock"><span className="lot_gemName"><img src={firin} style={{width: '50px'}} />x</span><span className="lot_gemCost">{props.cost[0]}</span></div>}
					{props.cost[1] > 0 &&<div className="lot_gemBlock"><span className="lot_gemName"><img src={hrizolit} style={{width: '50px'}} />x</span><span className="lot_gemCost">{props.cost[1]}</span></div>}
					{props.cost[2] > 0 &&<div className="lot_gemBlock"><span className="lot_gemName"><img src={bukli} style={{width: '50px'}} />x</span><span className="lot_gemCost">{props.cost[2]}</span></div>}
					{props.cost[3] > 0 &&<div className="lot_gemBlock"><span className="lot_gemName"><img src={margin} style={{width: '50px'}} />x</span><span className="lot_gemCost">{props.cost[3]}</span></div>}
					{props.cost[4] > 0 &&<div className="lot_gemBlock"><span className="lot_gemName"><img src={vaarit} style={{width: '50px'}} />x</span><span className="lot_gemCost">{props.cost[4]}</span></div>}
				</div>
			</button>
			<Popup
			  open={popupState}
			  closeOnDocumentClick
			  onClose={() => closeModal()}
			>
			  <div className="modal" style={{display: 'block', position: 'relative'}}>
			    <a className="close" onClick={() => closeModal()}>
			      &times;
			    </a>
			 		Вы хотите купить:<br />
			 		{props.name}?
			    <div className="popup-btns">
			    	<button className="popup-btn popup-btn_succes" onClick={() => nextBuy()}>Да!</button>
			    	<button className="popup-btn popup-btn_cancel" onClick={() => closeModal()}>Отмена</button>
			    </div>	
			  </div>
			</Popup>
		</div>
		)
}
export default Lot;
