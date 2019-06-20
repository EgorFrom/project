import React, { useContext, useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import Context from '../context';
import firin from '../firin.png';
import hrizolit from '../hrizolit.png';
import bukli from '../bukli.png';
import margin from '../margin.png';
import vaarit from '../vaarit.png';
import Loader from '../loader';
import '../css/preLoader.css';
var arFlags = {'flagDD': 'Для детей',
'flagVoe': 'Военные',
'flagIst': 'Исторические',
'flagDoc': 'Документальные',
'flagDVS': 'Для всей семьи',
'flagDet': 'Детективы',
'flagDra': 'Драмы',
'flagCom': 'Комедии',
'flagTri': 'Триллеры',
'flagMel': 'Мелодрамы',
'flagBoe': 'Боевики',
'flagCri': 'Криминальные',
'flagMis': 'Мистические',
'flagPri': 'Приключения',
'flagFK': 'Фильмы-катастрофы',
'flagUja': 'Ужасы',
'flagFan': 'Фантастика',
'flagFen': 'Фэнтези',
'flagArt': 'Артхаус'
};



function updateUnregToken(viewItem) {
    localStorage.setItem (0, viewItem);
}
function updateRegToken(viewItem) {
    localStorage.setItem (1, JSON.stringify(viewItem));
}

var gems = null;
var todayGame = "";
var todayFlag = "";

function MyCarousel() {
  const [fact, setFact] = useState(null);
  const { UpdatePage } = useContext(Context);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://eardrum.ru:8890/getEverydayData", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "accept": "application/json"
        }
      }).then(resp => {
        if (resp.status === 200) {
          return resp.json();
        } else return "Error 40010";
      }).then(data => {
        todayGame = arFlags[data.todayFlag];
        todayFlag = data.todayFlag;
      if (localStorage[1] != "undefined" && localStorage[1] != undefined)
      {
        
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
                  } else return "Error 40011";
                }).then(data2 => { 
                  if (data2.error != undefined){
                    localStorage[1] = 'undefined';
                    UpdatePage("Profile");
                  } else {
                    gems = {};
                    gems["firini"] = data2.firini;
                    gems["hrizoliti"] = data2.hrizoliti;
                    gems["bukli"] = data2.bukli;
                    gems["margini"] = data2.margini;
                    gems["vaariti"] = data2.vaariti;
                    setLoading(false);
                  }
            });
     } else {

          if (localStorage[0] == "undefined" || localStorage[0] == undefined)
          {
            fetch("https://eardrum.ru:8890/getNewJWT", {
                        method: "POST",
                        headers: {
                          "Content-type": "application/json",
                          "accept": "application/json"
                        }
                      }).then(resp => {
                        if (resp.status === 200) {
                          return resp.json();
                        } else return "Error 40013";
                      }).then(data2 => {
                         updateUnregToken(data2.access_token);
                         setLoading(false); 
                      });
          } else setLoading(false); 
     }
    });      

  }); 
  function newFact() {
    fetch("https://eardrum.ru:8890/fact", {
           method: "POST",
           headers: { 
             "Content-type": "application/json",
             "accept": "application/json"
           }
         }).then(resp => {
           if (resp.status === 200) {
             return resp.json();
           } else return "Error 40014";
         }).then(data => {
           setFact(data);
         });
  }
  return (
    <div> 
    {loading && <Loader />}
    <Carousel onSelect={(value) => {if (value  == 2) newFact()}}>
      <Carousel.Item>
        <Container>
          <div style={{display:'table',width:'80%',height:'100%',margin:'auto'}}>
            <div style={{display:'table-cell',verticalAlign:'middle'}}>
              <div>
                <h1>Задания:</h1>
                <button className="task" onClick={() => {UpdatePage("IKnowCategory/"+todayFlag)}}>Категория дня: <span className="category">{todayGame}</span></button>
                <button className="task task_2" onClick={() => {UpdatePage("IKnow")}}>Угадывай по описанию</button>
                <button className="task" onClick={() => {UpdatePage("BuyCategory")}}>Угадывай по категориям</button>
                <button className="task locked">Угадывай по актеру</button>
              </div>
            </div>
          </div>
        </Container>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Container>
          <div style={{display:'table',width:'80%',height:'100%',margin:'auto'}}>
            <div style={{display:'table-cell',verticalAlign:'middle'}}>
              <div style={{textAlign:'center'}}>
                <h2>Кол-во драгоценностей:</h2>

                
                
                
                
                <p className="gem"><img src={firin} style={{width: '25px'}} />Фирины <span className="gem-count">{gems?gems["firini"]:'0'}</span></p>
                <p className="gem"><img src={hrizolit} style={{width: '25px'}} />Хризолиты <span className="gem-count">{gems?gems["hrizoliti"]:'0'}</span></p>
                <p className="gem"><img src={margin} style={{width: '25px'}} />Марджины <span className="gem-count">{gems?gems["margini"]:'0'}</span></p>
                <p className="gem"><img src={vaarit} style={{width: '25px'}} />Ваариты <span className="gem-count">{gems?gems["vaariti"]:'0'}</span></p>
                <p className="gem"><img src={bukli} style={{width: '25px'}} />Букли <span className="gem-count">{gems?gems["bukli"]:'0'}</span></p>
                <p><button className="btn btn-outline my-2 my-sm-0" onClick={() => {UpdatePage("Shop")}}>Потратить</button></p>
              </div>
            </div>
          </div>
        </Container>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Container>
          <div style={{display:'table',width:'80%',height:'100%',margin:'auto'}}>
            <div style={{display:'table-cell',verticalAlign:'middle'}}>
              <div style={{textAlign:'right'}}>
                <h3>Интересный факт:</h3>
                <p>{fact?fact.descr:"Позже"}</p>
                <p><a className="btn btn-outline my-2 my-sm-0 locked" href="#" role="button">Поделиться вк</a></p>
              </div>
            </div>
          </div>
        </Container>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
  )
}

export default MyCarousel;
