module.exports.enter = function(req, res, jwt, JWTsign, key, connection){
  if (!req.body.email || !req.body.pass)
  { 
    res.send({error: "Нужен email и пароль"});  
    return;
  }
  var query = connection.query('SELECT * FROM persons WHERE email = "'+decodeURIComponent(req.body.email)+'" AND password = "'+decodeURIComponent(req.body.pass)+'"',  function(err, result) {
     if (!result || result == "") {
       res.send({error: "Неправильный email или пароль"});
     }else {
       var user = result[0];
       var token = jwt.sign(JWTsign(user), key, {expiresIn: "24 hours"});
 
       res.status(200)
       .send({id: user.id, access_token: token, dateView: new Date()})
     } 
   });
}