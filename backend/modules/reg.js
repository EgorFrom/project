module.exports.reg = function(req, res, jwt, JWTsign, key, connection, datetime){
  var dt = datetime.create(), sec = dt.format('S'), hours = dt.format('H');
  var activation = sec + decodeURIComponent(req.body.email).toLowerCase().split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},5) +""+ hours;
  connection.query('INSERT INTO persons(email,password,activation,nickname) VALUES("'+
    decodeURIComponent(req.body.email)+'","'+
    decodeURIComponent(req.body.pass)+'","'+
    activation+'","'+
    decodeURIComponent(req.body.nickname)+'")',  function(err, result) {
    if (result) { 
      connection.query('SELECT * FROM persons WHERE email = "'+decodeURIComponent(req.body.email)+'"', function(err, result2) {
        if (result2) {
          var user = result2[0];
          var token = jwt.sign(JWTsign(user), key, {expiresIn: "24 hours"});
          res.send({id: user.id, access_token: token, dateView: new Date()}); 
        } else res.send({error: "Ошибка, попробуйте войти еще раз или обратитесь в службу поддержки"}); 
      });
    } else res.send({error: "Неккоректный email/пароль/никнейм. Скорее всего, данный ник уже занят"});
  });
}