module.exports = function(){
  var express = require('express');
  var router = express.Router();

  function getItem(res, mysql, context, id, complete){
    var sql = "SELECT id, name, description FROM `items` WHERE items.id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.item = results[0];
      complete();
    });
  }

  /* get all items... to populate in dropdown */
  function getItems(res, mysql, context, complete){
    var sql = "SELECT id, name, description FROM `items`"; //changed from SELECT id AS item_id to SELECT id AS id
    mysql.pool.query(sql, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      context.items = results;
      complete();
    });
  }

  /* get all owners of an item... to populate in dropdown */
  function getItemOwners(res, mysql, context, item_id, complete){
    var sql = "SELECT C.id, C.fname, C.lname, I.id AS item_id, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id WHERE I.id = ? ";
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

  function getItemIdGivenName(res, mysql, itemIdStruct, name, complete){
    var sql = "SELECT items.id FROM `items` WHERE items.name = ?";
    var inserts = [name];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }   
      itemIdStruct.submission_id = results[0].id;
      complete();
    }); 
  }

  function getItemInfoGivenCharacterAndItem(res, mysql, context, character_id, item_id, complete){
    var sql = "SELECT item_list.amount_of, items.name, items.id FROM `item_list` INNER JOIN `character` ON character.id = item_list.character_id INNER JOIN `items` ON items.id = item_list.item_id WHERE character.id = ? AND item_list.item_id = ?";
    var inserts = [character_id, item_id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }   
      context.item = results[0];
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
    var sql = "SELECT I.id AS item_id, C.id AS character_id, C.fname, C.lname, I.name, IL.amount_of, I.description FROM `character` C INNER JOIN`item_list` IL ON C.id = IL.character_id INNER JOIN `items` I ON IL.item_id =I.id WHERE C.id = ? "; 
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

  router.get('/:character_id', function(req, res){
    var callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["deleteInventory.js", "updateCharacter.js", "updateInventory.js", "updateItem.js"];
    var mysql = req.app.get('mysql');
    //getCharacters(res, mysql, context, complete);
    getCharacterInventory(res, mysql, context, req.params.character_id, complete);
    getItems(res, mysql, context, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 2){ 
        res.render('character-inventory', context); //redirect to character-inventory/:character_id
      }   
    }   
  });

  router.get('/:character_id/:item_id', function(req, res){
    console.log("in get update");
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateCharacterInventory.js"];
    var mysql = req.app.get('mysql');
    var handlebars_file = 'update-inventory';
    console.log("before two functions");
    console.log("between two functions");
    getCharacterInventory(res, mysql, context, req.params.character_id, complete);
    getItemInfoGivenCharacterAndItem(res, mysql, context, req.params.character_id, req.params.item_id, complete);
    context.item_id = req.params.item_id;
    console.log("two functions completed");
    function complete(){
      callbackCount++;
      if(callbackCount >= 2){
        res.render(handlebars_file, context);
      }
    }
  });

  //Gives the character some amount of a new item
    router.post('/:character_id', function(req, res){
        var callbackCount = 0;
        var mysql = req.app.get('mysql');
        var itemIdStruct = {};
        getItemIdGivenName(res, mysql, itemIdStruct, req.body.name, complete);
        var sql = "INSERT INTO `item_list` (character_id, item_id, amount_of) VALUES (?,?,?)";
        function complete(){
          callbackCount++;
          if(callbackCount >= 1){
              var inserts = [req.body.character_id, itemIdStruct.submission_id, req.body.amount_of];
              sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                  if(error){
                      console.log(JSON.stringify(error))
                      res.write(JSON.stringify(error));
                      res.end();
                  }else{
                      res.redirect('/character-inventory/' + req.body.character_id);
                  }
              });
          }
        }
    });

    //edit a character's inventory
    router.put('/update/:character_id/:item_id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log("req.body.amount_of");
        console.log(req.body.amount_of);
        console.log("params:");
        console.log(req.params);
        req.params.amount_of = req.body.amount_of;
        var sql = "UPDATE `item_list` SET character_id=?, item_id=?, amount_of=? WHERE character_id = ? AND item_id = ?";
        var inserts = [req.params.character_id, req.params.item_id, req.params.amount_of, req.params.character_id, req.params.item_id];
        console.log("in router.put update");
        console.log("req.params = ");
        console.log(req.params);
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


      router.delete('/:character_id/:item_id', function(req, res){
        //console.log("hello");
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

  return router;
}();
