module.exports = function(){
  var express = require('express');
  var router = express.Router();

  /* get all classe... to populate in dropdown */
  function getClasses(res, mysql, context, complete){
    var sql = "SELECT DISTINCT id, description, instructor, subject  FROM `class`";
    mysql.pool.query(sql, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.courses = results;
      complete();
    });
  }

  /* get all owners of an item... to populate in dropdown */
  function getCharacterClasses(res, mysql, context, character_id, complete){
    var sql = "SELECT class.id, class.description, class.instructor, class.instructor, class.subject FROM `class` INNER JOIN`student_class_list` ClassList ON class.id = ClassList.class_id WHERE ClassList.character_id = ?"
      var inserts = [character_id];  
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }   
      context.characterClasses = results;
      complete();
    }); 
  }


  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteCharacter.js", "deleteClasses.js"];
    var mysql = req.app.get('mysql');
    var handlebars_file = 'courses';

    //getPeople(res, mysql, context, complete);
    //getCertificates(res, mysql, context, complete);
    //getPeopleWithCertificates(res, mysql, context, complete);
    getClasses(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        res.render(handlebars_file, context);
      }
    }
  });

  //--getCharacterClasses...
  router.get('/:id', function(req, res){
    callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["deleteCharacter.js", "updateCharacter.js", "deleteClasses.js"];
    var mysql = req.app.get('mysql');
    var handlebars_file = 'classes';
    getCharacterClasses(res, mysql, context, req.params.id, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){ 
        res.render(handlebars_file, context);
      }   

    }   
  }); 


    router.post('/', function(req, res){
        console.log(req.body.homeworld)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `class` (id, subject, instructor, description) VALUES (?,?,?,?)";
        var inserts = [req.body.id, req.body.subject, req.body.instructor, req.body.description];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/classes');
            }   
        }); 
    });   
  

  
  // This deletes a character from a student_class_list. 
  router.delete('/class/del/:class_id/:character_id', function(req, res){
    //console.log(req) //I used this to figure out where did pid and cid go in the request
    console.log(req.params.class_id)
    console.log(req.params.character_id)
    var mysql = req.app.get('mysql');
  var sql = "DELETE FROM `student_class_list` WHERE class_id = ? AND character_id = ?";
  var inserts = [req.params.class_id, req.params.character_id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.status(400); 
      res.end(); 
    }else{
      res.status(202).end();
    }
  })
  })

  // This deletes a whole class and removes all associations. 
  router.delete('/class/del/:class_id', function(req, res){
    //console.log(req) //I used this to figure out where did pid and cid go in the request
    console.log(req.params.class_id)
    var mysql = req.app.get('mysql');
  var sql = "DELETE FROM `class` WHERE id  = ?";
  var inserts = [req.params.class_id];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      res.write(JSON.stringify(error));
      res.status(400); 
      res.end(); 
    }else{
      res.status(202).end();
    }   
  })  
  })


  return router;
}();
