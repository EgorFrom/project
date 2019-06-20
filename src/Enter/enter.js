import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Context from '../context';
import PropTypes from 'prop-types';
import $ from 'jquery';

function useInputValue(defaultValue = '') {
  const [value, setValue] = useState('');

  return {
    bind: {
      value,
      onChange: event => setValue(event.target.value)
    },
    clear: () => setValue(''),
    value: () => value
  }
}
var flagRightEmail = false;
var flagRightPass = false;

function updateRegToken(viewItem) {
    localStorage.setItem(1, JSON.stringify(viewItem));
}


function Enter(props) {
  const [myError, setMyError] = useState(null);
  
  const inputEmail = useInputValue('');
  const inputPass = useInputValue('');

  function clearInputs(value) {
    inputPass.clear();
    UpdatePage(value);
  }

  function submitHandler(event){
    event.preventDefault();
    // Создаётся объект promise
    new Promise((resolve, reject) => {
      $(".password").val().length < 3?$(".password").css('background-color', '#ff000057'):$(".password").css('background-color', 'white');
      $(".password").val().length < 3?flagRightPass=false:flagRightPass=true;
      $(".email").val().indexOf('@') > -1?$(".email").css('background-color', 'white'):$(".email").css('background-color', '#ff000057');  
      $(".email").val().indexOf('@') > -1?flagRightEmail=true:flagRightEmail=false;  
      resolve("ok");
    }).then(
      result => {
        if (!flagRightEmail || !flagRightPass)
          return;

        let formData = $("form").serialize().split('&').map(function(el) {return el.split('=');});

        let hashCode = function(s){return s.toLowerCase().split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);}
        let salt;

        //Set charset for json
        $.ajaxSetup({scriptCharset: "utf-8",contentType: "application/json; charset=utf-8", xhrFields: { withCredentials:true }});
        
        //get salt
        fetch("https://eardrum.ru:8890/getsalt", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
                "accept": "application/json"
              },
              body: JSON.stringify({email: formData[0][1]})
            }).then(resp => {
              if (resp.status === 200) {
                return resp.json();
              } else return "Error 40005";
            }).then(data => {
              if (data.error != undefined)
              {
                setMyError(data.error);
              } else {
                salt = data.salt;
              }
            });

        if (props.pageName === "Enter")
        {
          formData[1][1] = hashCode(formData[1][1]+salt);
          fetch("https://eardrum.ru:8890/enter", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                  "accept": "application/json"
                },
                body: JSON.stringify({email: formData[0][1],pass: formData[1][1]})
              }).then(resp => {
                if (resp.status === 200) {
                  return resp.json();
                } else return "Error 40005";
              }).then(data => {
                if (data.error != undefined)
                  setMyError(data.error);
                else
                {
                  updateRegToken(data);
                  UpdatePage("Profile");
                }
              });
        }
        else if (props.pageName === "Registration")
        {
          formData[1][1] = hashCode(formData[1][1]+salt);
          fetch("https://eardrum.ru:8890/reg", {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                  "accept": "application/json"
                },
                body: JSON.stringify({email: formData[0][1], nickname: formData[2][1], pass: formData[1][1]})
              }).then(resp => {
                if (resp.status === 200) {
                  return resp.json();
                } else return "Error 40005";
              }).then(data => {
                if (data.error != undefined)
                  setMyError(data.error);
                else
                {
                  updateRegToken(data);
                  UpdatePage("Profile");
                }
              });
        }

      },
      error => {
        console.log("Rejected: " + error);
      }
    );
  }  

  const { UpdatePage } = useContext(Context);  
  return (
    <Form className="login_form" onSubmit={submitHandler}>
      <Form.Label className="login_title">{props.pageName === "Enter"?'Вход':'Регистрация'}</Form.Label>
      <Form.Group controlId="formBasicEmail">
        <Form.Label className="login_subtitle">Email</Form.Label>
        <Form.Control className="email" name="email" type="email" placeholder="Введите Email" {...inputEmail.bind}/>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label className="login_subtitle">Пароль</Form.Label>
        <Form.Control className="password" name="pass" type="password" placeholder="Пароль"  {...inputPass.bind}/>
      </Form.Group>
      

      {props.pageName === "Registration"&&
      <Form.Group controlId="formBasicNickname">
        <Form.Label className="login_subtitle">Никнейм</Form.Label>
        <Form.Control name="nickname" type="nickname" placeholder="Введите Nickname" />
      </Form.Group>}

      <Button className="login_btn login_btn__enter" variant="primary" type="submit">
        {props.pageName === "Enter"?'Войти':'Зарегистрироваться'}
      </Button>

      {props.pageName === "Enter"&&
      <Button className="login_btn login_btn__register" variant="primary" type="submit" onClick={() => clearInputs("Registration")}>
        Регистрация
      </Button>}

      { myError != null &&
      <Form.Group controlId="formBasicError">
        <Form.Label className="login_subtitle">{myError}</Form.Label>
      </Form.Group>}

      <Button className="login_btn login_btn__cancel" variant="primary" type="submit" onClick={() => clearInputs("Profile")}>
        На главную
      </Button>
    </Form>
  );
}

Enter.propTypes = {
  pageName: PropTypes.string.isRequired
}

export default Enter;
