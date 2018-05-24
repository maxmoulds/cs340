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
    context.jsscripts = ["deletecharacter.js"];
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

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {}; 
        context.jsscripts = ["selectedplanet.js", "updatecharacter.js"];
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


  /* Associate certificate or certificates with a person and 
   * then redirect to the people_with_certs page after adding 
   */
  router.post('/', function(req, res){
    console.log("We get the multi-select certificate dropdown as ", req.body.certs)
    var mysql = req.app.get('mysql');
  // let's get out the certificates from the array that was submitted by the form 
  var certificates = req.body.certs
    var person = req.body.pid
    for (let cert of certificates) {
      console.log("Processing certificate id " + cert)
    var sql = "INSERT INTO bsg_cert_people (pid, cid) VALUES (?,?)";
  var inserts = [person, cert];
  sql = mysql.pool.query(sql, inserts, function(error, results, fields){
    if(error){
      //TODO: send error messages to frontend as the following doesn't work
      /* 
         res.write(JSON.stringify(error));
         res.end();
         */
      console.log(error)
    }
  });
    } //for loop ends here 
  res.redirect('/people_certs');
  });

  /* Delete a person's certification record */
  /* This route will accept a HTTP DELETE request in the form
   * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form 
   */
  router.delete('/pid/:pid/cert/:cid', function(req, res){
    //console.log(req) //I used this to figure out where did pid and cid go in the request
    console.log(req.params.pid)
    console.log(req.params.cid)
    var mysql = req.app.get('mysql');
  var sql = "DELETE FROM bsg_cert_people WHERE pid = ? AND cid = ?";
  var inserts = [req.params.pid, req.params.cid];
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
