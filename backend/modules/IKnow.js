module.exports.IKnow = function(req, res, jwt, JWTsign, key, connection) {
  if (req.params.sql == "get5films"){
    connection.query('SELECT * FROM films WHERE id IN (SELECT id FROM (SELECT id FROM films ORDER BY RAND() LIMIT 5) t)', function(err, result) {
      if (!result){ res.send("error") } else {
        res.send(result);
      }  
    });
  }
  if (req.params.sql == "get3FalseVariants"){
    var array = [];
    for (var i = 0; i < req.body.films.length; i++)
    {
      var flagCat = false;
      var country = null;

      if (req.body.films[i]["productionCountry"].indexOf("СССР") > -1) country = "СССР";
      else if (req.body.films[i]["categories"].indexOf("Для детей") > -1) flagCat = "flagDD";
      else if (req.body.films[i]["categories"].indexOf("Военные") > -1) flagCat = "flagVoe";
      else if (req.body.films[i]["categories"].indexOf("Исторические") > -1) flagCat = "flagIst";
      else if (req.body.films[i]["categories"].indexOf("Документальные") > -1) flagCat = "flagDoc";
      else if (req.body.films[i]["categories"].indexOf("Для всей семьи") > -1) flagCat = "flagDVS";
      else if (req.body.films[i]["categories"].indexOf("Детективы") > -1) flagCat = "flagDet";
      else if (req.body.films[i]["categories"].indexOf("Драмы") > -1) flagCat = "flagDra";
      else if (req.body.films[i]["categories"].indexOf("Комедии") > -1) flagCat = "flagCom";
      else if (req.body.films[i]["categories"].indexOf("Триллеры") > -1) flagCat = "flagTri";
      else if (req.body.films[i]["categories"].indexOf("Мелодрамы") > -1) flagCat = "flagMel";
      else if (req.body.films[i]["categories"].indexOf("Боевики") > -1) flagCat = "flagBoe";
      else if (req.body.films[i]["categories"].indexOf("Криминальные") > -1) flagCat = "flagCri";
      else if (req.body.films[i]["categories"].indexOf("Мистические") > -1) flagCat = "flagMis";
      else if (req.body.films[i]["categories"].indexOf("Приключения") > -1) flagCat = "flagPri";
      else if (req.body.films[i]["categories"].indexOf("Фильмы-катастрофы") > -1) flagCat = "flagFK";
      else if (req.body.films[i]["categories"].indexOf("Ужасы") > -1) flagCat = "flagUja";
      else if (req.body.films[i]["categories"].indexOf("Фантастика") > -1) flagCat = "flagFan";
      else if (req.body.films[i]["categories"].indexOf("Фэнтези") > -1) flagCat = "flagFen";
      else if (req.body.films[i]["categories"].indexOf("Артхаус") > -1) flagCat = "flagArt";
      else {flagCat = "flagPri";}
      var myData;
      country != null?myData = {"productionCountry": country}:myData = {"categories": flagCat};
      if (country != null)
        connection.query('SELECT filmName FROM films WHERE id IN (SELECT id FROM (SELECT id FROM films WHERE productionCountry = "'+ myData["productionCountry"] +'" AND filmName != "'+req.body.films[i]['filmName']+'" ORDER BY RAND() LIMIT 3) t)', function(err, result) {
          if (!result){ res.send("error") } else {
            array.push(result);
            if (array.length == req.body.films.length){
              res.send(array);
            }
          }  
        });
      else 
        connection.query('SELECT filmName FROM films WHERE id IN (SELECT id FROM (SELECT id FROM films WHERE '+ flagCat +' = 1 AND filmName != "'+req.body.films[i]['filmName']+'" ORDER BY RAND() LIMIT 3) t)', function(err, result) {
          if (!result){ res.send("error") } else {
            array.push(result);
            if (array.length == req.body.films.length){
              res.send(array);
            }
          }  
        });
    } 
  }
}