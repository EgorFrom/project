var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var datetime = require('node-datetime');
var jwt = require("jsonwebtoken");
var expressjwt = require("express-jwt");
var fs = require('fs');
var https = require('https');
var cron = require('node-cron');

var app = express();

optionsHttps = {
      key: fs.readFileSync('ssl/my-site-key.pem'),
      cert: fs.readFileSync('ssl/chain.pem')
    };

var httpsServer = https.createServer(optionsHttps, app);

app.all('*', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
 });


var options = require('./config.js').options;
var JWTsign = require('./functions.js').JWTsign;
var key = require('./config.js').key;
var connection = mysql.createConnection(options);
var fs = require('fs');

app.use(bodyParser.json());

var httpsServer = https.createServer(optionsHttps, app);


var enter = require('./modules/enter.js').enter;
app.post('/enter', function(req, res){ enter(req, res, jwt, JWTsign, key, connection) });

app.post('/getsalt', function(req, res){
  res.send({salt: ""+decodeURIComponent(req.body.email).toLowerCase().substring(1, 2).split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},5)+decodeURIComponent(req.body.email).toLowerCase().substring(0, 3).split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},5)});
});

var reg = require('./modules/reg.js').reg;
app.post('/reg', function(req, res){ reg(req, res, jwt, JWTsign, key, connection, datetime) });

app.post('/fact', function(req, res) {
  connection.query('SELECT * FROM facts ORDER BY rand() LIMIT 1', function(err, result) {
    if (result.length == 0){res.send("error")} else {res.send(result[0]);}  
  });
});

var user = require('./modules/user.js').user;
app.post('/user/:column', function(req, res) { user(req, res, jwt, JWTsign, key, connection) });

app.post('/IKnow/get5films/:category', function(req, res) {
  if (req.params.category != undefined)
  {
    if (req.params.category.indexOf('flag') > -1)
    {
      connection.query('SELECT * FROM films WHERE id IN (SELECT id FROM (SELECT id FROM films WHERE '+req.params.category+' = 1 ORDER BY RAND() LIMIT 5) t)', function(err, result) {
            if (!result){ res.send("error") } else {
              res.send(result);
            }
           });
    } else {
      connection.query('SELECT * FROM films WHERE id IN (SELECT id FROM (SELECT id FROM films WHERE productionCountry = "'+req.params.category+'" ORDER BY RAND() LIMIT 5) t)', function(err, result) {
        if (!result){ res.send("error") } else {
          res.send(result);
        }
      });
    }   
  }
})

var IKnow = require('./modules/IKnow.js').IKnow;
app.post('/IKnow/:sql', function(req, res) { IKnow(req, res, jwt, JWTsign, key, connection); })

var shop = require('./modules/shop.js').shop;
app.post('/shop/:action', function(req, res) { shop(req, res, jwt, JWTsign, key, connection); });

app.post('/getEverydayData', function(req, res) {
  connection.query('SELECT * FROM everydayDatas WHERE id = 1', function(err, result) {
    if (result){
      res.send({todayFlag: result[0].dataString});
    }
  });
});

 
cron.schedule('0 0 * * 7', () => {
  connection.query('SELECT * FROM rating ORDER BY score DESC LIMIT 10', function(err, result) {
    if (result.length > 0)
    {  
      for(let i = 1; i <= result.length; i++){
        var gems = getRandomInt(1, 10),
        nameGem = "",
        dbnameGem = "",
        countGem = 0;
        countGem = (i == 1)?(30):((i<4)?(20):(10));
        switch (gems) {
          case 1:
          case 2:
            nameGem = "Фирины: ";                   
            dbnameGem = "firini";
            break;
          case 3:
          case 4:
            nameGem = "Хризолиты: ";
            dbnameGem = "hrizoliti";
            break;
          case 5:
          case 6:
            nameGem = "Марджины: ";
            dbnameGem = "margini";
            break;
          case 7:
          case 8:
            nameGem = "Ваариты: ";
            dbnameGem = "vaariti";
            break;
          case 9:
            nameGem = "Букли: ";
            dbnameGem = "bukli";
            break;
        }
        let descr = "Поздравляем! Ты занял "+ i+ " место и получаешь в награду " + nameGem + countGem;
        connection.query('INSERT INTO enterPopup(name, descr, userId) VALUES ("'+
          result[i-1].nickname+'","'+
          descr+'","'+
          result[i-1].userId+'")', function(err, result32) {
        });
        connection.query('SELECT * FROM persons WHERE id = ' + result[i-1].userId, function(err, result1) {
          if (result1.length > 0)
          {
            connection.query('UPDATE persons SET '+dbnameGem+' = "'+
              (countGem + parseInt(result1[0][dbnameGem], 10))+'" WHERE id = ' + result[i-1].userId,  function(err, result2) {
                if (result2) {}
            });
          };
        });
      }
    }
   });
});

app.post('/getNewJWT', function(req, res) {
  var token = jwt.sign({
    date: new Date(),
    countPlayedGames: 0,
    EDG: 0 
  }, key, {expiresIn: "24 hours"});

  res.send({access_token: token, dateView: new Date()})
});

app.post('/getRating', function(req, res) {
  connection.query('SELECT * FROM rating ORDER BY score DESC LIMIT 10', function(err, result) {
    if (result.length > 0)
      res.send({table : result});
    else
      res.send({error : 'Таблица пуста'});
  });
});
httpsServer.listen(8890);



function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
