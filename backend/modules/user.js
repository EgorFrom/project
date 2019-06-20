module.exports.user = function(req, res, jwt, JWTsign, key, connection) {
  var token = req.body.token || req.query.token;
  if (!token) {
   res.status(401).send("Must pass token");
   return;
  }
  let flag = true;
  var decoded = jwt.verify(token, key, (err, result) => { if (err) { if (err.message == "jwt expired") {flag = false; return res.status(200).send({error: 'jwt expired'});} else {flag = false; return  res.status(400).send(err);} } else return result});
  if (flag)
  {
    if (req.params.column == "nickname"){
      if (flag)
      res.status(200).send({nickname: decoded.nickname});
    } else
    if (req.params.column == "gems"){
      if (flag)
      res.status(200).send({
        firini: decoded.firini, 
        hrizoliti: decoded.hrizoliti, 
        bukli: decoded.bukli, 
        margini: decoded.margini, 
        vaariti: decoded.vaariti });
    } else
    if (req.params.column == "addGems"){
      connection.query('SELECT * FROM persons WHERE id = ' + decoded.id, function(err, result) {
        if (result)
        {
          connection.query('UPDATE persons SET '+req.body.nameGems+' = "'+
            ((parseInt(req.body.countGems, 10) < 500 ? parseInt(req.body.countGems, 10) : 0) + parseInt(result[0][req.body.nameGems], 10))+'" WHERE id = ' + decoded.id,  function(err, result2) {
              if (result2) {
                connection.query('SELECT * FROM persons WHERE email = "'+decodeURIComponent(decoded.email)+'"', function(err, result2) {
                  if (result2) {
                    var user = result2[0];
                    var token = jwt.sign(JWTsign(user), key, {expiresIn: "24 hours"});
                    res.send({id: user.id, access_token: token, dateView: new Date()}); 
                  } else res.send({error: "Ошибка, попробуйте войти еще раз или обратитесь в службу поддержки"});
              });
            }
          });
        };
      });
    } else 
    if (req.params.column == "getStamina") {
      connection.query('SELECT * FROM persons WHERE id = "'+decodeURIComponent(decoded.id)+'"', function(err, result) {
        if (result){
          res.status(200).send({stamina: result[0].stamina});
        }
      });
    } else 
    if (req.params.column == "minusStamina") {
      connection.query('SELECT * FROM persons WHERE id = ' + decoded.id, function(err, result) {
        if (result && parseInt(result[0]["stamina"], 10) > 18)
        {
          connection.query('UPDATE persons SET stamina = "'+
          (parseInt(result[0]["stamina"], 10) - 19)+'" WHERE id = ' + decoded.id,  function(err, result2) {
            if (result2){
              res.status(200).send({result: 'ok'});
            } else {
              res.status(200).send({error: 'Ошибка бд'});
            }
          });
        } else res.status(200).send({error: 'Ошибка, не хватает энергии'});
      });
    } else if (req.params.column == "canIPlay"){
      if (decoded.countPlayedGames < 1){
        var wtoken = jwt.sign({
          date: new Date(),
          countPlayedGames: (decoded.countPlayedGames + 1)
        }, key, {expiresIn: "24 hours"});
    
        res.send({access_token: wtoken, dateView: new Date()});
      } else {
        return res.send({error: 'Ошибка, пора авторизоваться'}); 
      }
    } else if (req.params.column == "IplayInEDG"){
    		decoded.EDG = 1;
        var wtoken = jwt.sign(JWTsign(decoded), key, {expiresIn: "24 hours"});
        res.send({id: decoded.id, access_token: wtoken, dateView: new Date()}); 
    } else if (req.params.column == "canIPlayEDG"){
      if (decoded.EDG == 0)
        res.send({result: 'ok'});
      else 
        res.send({error: 'Уже играл'});
    } else if (req.params.column == "statistics") {
      connection.query('SELECT * FROM statistics WHERE userId = ' + decoded.id, function(err, result) {
        if (result.length != 0){
          let countRightAns = result[0].countRightAns + ',' + req.body.countRightAns;
          let score = result[0].score + ',' + req.body.score;
          connection.query('UPDATE statistics SET countGames = '+ (result[0].countGames+1) +
            ', countRightAns = "'+ countRightAns +
            '", score = "'+ score +'" WHERE userId = ' + decoded.id, function(err, result) {
              res.send({result: 'ok'});
              updateRating(req, res, connection, decoded.id);
            });
        } else {
          connection.query('INSERT INTO statistics(nickname,userId,countGames,countRightAns,score) VALUES("'+
            decoded.nickname+'","'+
            decoded.id+'","'+
            1+'","'+
            req.body.countRightAns+'","'+
            req.body.score+'")',  function(err, result) {
              res.send({result: 'ok'});
              updateRating(req, res, connection, decoded.id);
          });
        }
      });
    } else if (req.params.column == "messages") {
      connection.query('SELECT * FROM enterPopup WHERE userId = ' + decoded.id, function(err, result) {
        if (result.length > 0){
          connection.query('DELETE FROM enterPopup WHERE userId = ' + decoded.id, function(err, result3) {
          });
          res.send({message: result[0].descr});
        } else {
          res.send({error: "No messages"});
        }
      });
    }
  } else {
    res.send({error: 'jwt expired'});
  }
}

function updateRating(req, res, connection, id) {
  connection.query('SELECT * FROM statistics WHERE userID = '+ id, function(err, result) {
    let countRightAns = result[0].countRightAns.split(',').reduce(function(sum, current) {
      return sum + parseInt(current, 10);
    }, 0);
    let score = result[0].score.split(',').reduce(function(sum, current) {
      return sum + parseInt(current, 10);
    }, 0);
    connection.query('SELECT * FROM rating WHERE userId = ' + id, function(err, result2) {
    if (result2.length > 0) {
      connection.query('UPDATE rating SET countGames = '+ result[0].countGames +
        ', countRightAns = "'+ countRightAns +
        '", score = "'+ score +'" WHERE userId = ' + id, function(err, result3) {
      
      });
    } else {
      connection.query('INSERT INTO rating (nickname,userId,countGames,countRightAns,score) VALUES("'+
              result[0].nickname+'","'+
              result[0].userId+'","'+
              result[0].countGames+'","'+
              countRightAns+'","'+
              score+'")', function(err, result2) {

      });
    }

    });
  });
}