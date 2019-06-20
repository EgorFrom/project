module.exports.shop = function(req, res, jwt, JWTsign, key, connection) {
  var token = req.body.token || req.query.token;
  if (!token) {
   res.send({error: 'jwt expired'});
  }
  let flag = true;
  var decoded = jwt.verify(token, key, (err, result) => { if (err) { if (err.message == "jwt expired") {flag = false; return res.status(200).send({error: 'jwt expired'});} else return res.status(400).send(err); } else return result});
  if (flag)
  {
    if (req.params.action == "getLots"){
      connection.query('SELECT * FROM shop WHERE page = 1', function(err, result) {
        if (result) {
          res.send(result);
        }
      }); 
    } else
    if (req.params.action == "getLotsCategory"){
      connection.query('SELECT * FROM shop WHERE page = 2 ORDER BY rand()', function(err, result) {
        if (result.length > 0) {
          res.send(result);
        } else {
          res.send({error: 'Нет данных'});
        }
      }); 
    } else  
    if (req.params.action == "buy"){
      connection.query('SELECT * FROM shop WHERE id = ' + req.body.id, function(err, result) {
        if (result){
          let setAction = null;
          let ar = result[0]['cost'].split(',');
         //f,h,b,m,v 
          if (decoded.firini >= ar[0] & decoded.hrizoliti >= ar[1] & decoded.bukli >= ar[2] & decoded.margini >= ar[3] & decoded.vaariti >= ar[4]){
            connection.query('UPDATE persons SET firini = '+ (decoded.firini - ar[0]) + 
            ' , hrizoliti = ' + (decoded.hrizoliti - ar[1]) +
            ' , bukli = ' + (decoded.bukli - ar[2]) +
            ' , margini = ' + (decoded.margini - ar[3]) +
            ' , vaariti = ' + (decoded.vaariti - ar[4]) + ' WHERE id = ' + decoded.id, function(err, result2) {
              if (result2){
                let action = result[0]['action'];
                if (action == "add19energy"){
                  connection.query('SELECT * FROM persons WHERE id = ' + decoded.id, function(err, result) {
                    if (result && parseInt(result[0]["stamina"], 10) < 82)
                    {
                      connection.query('UPDATE persons SET stamina = "'+
                      (parseInt(result[0]["stamina"], 10) + 19)+'" WHERE id = ' + decoded.id,  function(err, result2) {});
                    }
                  });
                } else if (action.indexOf("flag") > -1) {
                  setAction = action;
                } else if (action.indexOf("СССР") > -1) {
                  setAction = action;
                }
                
                var wtoken = jwt.sign(JWTsign(decoded), key, {expiresIn: "24 hours"});
                if (setAction != null)
                {
                  connection.query('SELECT * FROM persons WHERE id = "'+decodeURIComponent(decoded.id)+'"', function(err, result) {
                    if (result.length > 0){
                      if (result[0].stamina > 18){
                        res.send({token: {id: decoded.id, access_token: wtoken, dateView: new Date()}, action: setAction}); 
                        decoded.firini = (decoded.firini - ar[0]);
                        decoded.hrizoliti = (decoded.hrizoliti - ar[1]);
                        decoded.bukli = (decoded.bukli - ar[2]);
                        decoded.margini = (decoded.margini - ar[3]);
                        decoded.vaariti = (decoded.vaariti - ar[4]);
                      } else {
                        res.send({token: {id: decoded.id, access_token: wtoken, dateView: new Date()}, message: 'Не хватает энергии!'}); 
                      }
                    } else {
                      res.send({error: 'not found'});
                    }
                  });
                } else
                {
                  decoded.firini = (action == "add5firini")?(decoded.firini - ar[0]+5):(decoded.firini - ar[0]);
                  decoded.hrizoliti = (action == "add5hrizoliti")?(decoded.hrizoliti - ar[1]+5):(decoded.hrizoliti - ar[1]);
                  decoded.bukli = (action == "add5bukli")?(decoded.bukli - ar[2]+5):(decoded.bukli - ar[2]);
                  decoded.margini = (action == "add5margini")?(decoded.margini - ar[3]+5):(decoded.margini - ar[3]);
                  decoded.vaariti = (action == "add5vaariti")?(decoded.vaariti - ar[4]+5):(decoded.vaariti - ar[4]);
                  res.send({id: decoded.id, access_token: wtoken, dateView: new Date()}); 
                }
              }
            });
          } else {
            res.send({error: 'Не хватает камней'})
          }
        }
      });
    }
  }
  else   
  {
    res.send({error: 'jwt expired'});
  }
}