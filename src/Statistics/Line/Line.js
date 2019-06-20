import React from 'react';
import box1 from '../../1_gold-box.png';
import box2 from '../../2_gold-box.png';
import box3 from '../../3_gold-box.png';


function Line(props) {
	return (
  			<tr>
  		 		<td style={{fontSize: '1rem'}}>{props.index+1}.</td>
  	  		<td style={{fontSize: '1rem'}}>{props.element != null?props.element['nickname']:'wait..'}</td>
  	  		<td style={{fontSize: '1rem'}}>{props.element != null?props.element['countGames']:'wait..'}</td>
  	  		<td style={{fontSize: '1rem'}}>{props.element != null?props.element['countRightAns']:'wait..'}</td>
          <td style={{fontSize: '1rem'}}>{props.element != null?props.element['score']:'wait..'}</td>
  	  		<td style={{fontSize: '1rem'}}>{(props.index+1 == 1)?<img src={box1} style={{width: '50px'}} />:((props.index+1 < 4)?<img src={box2} style={{width: '50px'}} />:<img src={box3} style={{width: '50px'}} />)}</td>
  	    </tr>
		)
}

export default Line;
