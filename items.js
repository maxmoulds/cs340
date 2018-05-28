module.exports = function(){
  var express = require('express');
  var router = express.Router();

  /* get all items... to populate in dropdown */
  function getItems(res, mysql, context, complete){
    var sql = "SELECT id AS item_id, name, description FROM `items`";
    mysql.pool.query(sql, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.inventory = results;
      complete();
    });
  }

  /* get all owners of an item... to populate in dropdown */
  function getItemOwners(res, mysql, context, item_id, complete){
    var sql = "SELECT C.id, C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id WHERE I.id = ? ";
    var inserts = [item_id];  
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }   
      context.itemOwners = results;
      complete();
    }); 
  }

  /* get all items. (uses items_lists) */
  function getAllInventory(res, mysql, context, character_id, complete){
    var sql = "SELECT I.id AS item_id, C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id ";
    mysql.pool.query(sql, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }   
      context.inventory = results;
      complete();
    }); 
  }

  /* get all items. (uses items_lists) */
  function getCharacterInventory(res, mysql, context, character_id, complete){
    var sql = "SELECT I.id AS item_id, C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id WHERE C.id = ? "; 
    var inserts = [character_id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }   
      context.inventory = results;
      complete();
    }); 
  }

  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deletecharacter.js"];
    var mysql = req.app.get('mysql');
    var handlebars_file = 'items';
    getItems(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){
        res.render(handlebars_file, context);
      }
    }
  });

  router.get('/info/:character_id', function(req, res){
    var callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["selectedplanet.js", "updatecharacter.js"];
    var mysql = req.app.get('mysql');
    //getCharacters(res, mysql, context, complete);
    getCharacterInventory(res, mysql, context, req.params.character_id, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){ 
        res.render('items', context);
      }   
    }   
  });


  router.get('/inventory/:item_id', function(req, res){
    var callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["selectedplanet.js", "updatecharacter.js"];
    var mysql = req.app.get('mysql');
    getItemOwners(res, mysql, context, req.params.item_id, complete);
    var handlebars_file = 'inventory'; 
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){ 
        res.render(handlebars_file, context);
      }   
    }   
  }); 

    router.post('/new', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `items` (item_id, name, description) VALUES (?,?,?)";
        var inserts = [req.body.item_id, req.body.name, req.body.description];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/items');
            }
        });
    });

    router.post('/info/:character_id/add/:item_id/:amount_of', function(req, res){
        console.log(req.body);
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `item_list` (character_id, item_id, amount_of) VALUES (?,?,?)";
        var inserts = [req.body.character_id, req.body.item_id, req.body.amount_of];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/info/:character_id');
            }   
        }); 
    }); 

    /* The URI that update data is sent to in order to update a person */
    //---updateCharacter...
    // var sql = "UPDATE `character` SET fname=[fnameInput], lname=[lnameInput],
    //   dob=[dobInput], house_id=[house_idInput] role_id=[role_idInput] 
    //   WHERE id=[auto_incremented int]"
    router.put('/:item_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE `item` SET fname=?, lname=?, role_id=?, dob=?, house_id=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.role_id, req.body.dob, req.params.house_id, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });



  /* Delete a person's certification record */
  /* This route will accept a HTTP DELETE request in the form
   * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form 
   */
  router.delete('/info/:character_id/:item_id/:amount_of', function(req, res){
    //console.log(req) //I used this to figure out where did pid and cid go in the request
    console.log(req.params.character_id)
    console.log(req.params.item_id)
    var mysql = req.app.get('mysql');
  var sql = "DELETE FROM `item_list` WHERE character_id = ? AND item_id = ?";
  var inserts = [req.params.character_id, req.params.item_id];
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
/* delete an item from a character. */
    router.delete('/items/info/:character_id/:item_id/:amount_of', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM `items_list` WHERE character_id = ?, item_id = ?";
        var inserts = [req.params.character_id, req.params.item_id];
        console.log("QUERY IS...", sql, req.params.character_id, req.params.item_id);
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
