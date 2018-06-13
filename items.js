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
    var sql = "SELECT id AS id, name, description FROM `items`"; //changed from SELECT id AS item_id to SELECT id AS id
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

  router.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteCharacter.js", "updateCharacter.js", "deleteItem.js", "updateInventory.js", "updateItem.js"];
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
    context.jsscripts = ["deleteCharacter.js", "updateCharacter.js", "updateInventory.js", "updateItem.js"];
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

  router.get('/info/:character_id/update/:item_id/:amount_of', function(req, res){
    var callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["deleteCharacter.js", "updateCharacter.js", "updateInventory.js", "updateItem.js"];
    var mysql = req.app.get('mysql');
    //getCharacters(res, mysql, context, complete);
    getCharacterInventory(res, mysql, context, req.params.character_id, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){ 
        res.render('update-items', context);
      }   
    }   
  }); 

  router.get('/inventory/:item_id', function(req, res){
    var callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["deleteCharacter.js", "updateCharacter.js", "updateInventory.js", "updateItem.js"];
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

  router.get('/:id', function(req, res){
    var callbackCount = 0;
    var context = {}; 
    context.jsscripts = ["deleteCharacter.js", "updateCharacter.js", "updateInventory.js", "updateItem.js"];
    var mysql = req.app.get('mysql');
    getItem(res, mysql, context, req.params.id, complete);
    function complete(){
      callbackCount++;
      if(callbackCount >= 1){ 
        res.render('update-items', context);
      }   
    }   
  }); 

//below post added by Chase. Remove if not working.
     /* Adds a person, redirects to the people page after adding */
    //--newCharacter...
    // var sql = "INSERT INTO `character` (fname, lname, dob, house_id) VALUES ([fnameInput], [lnameInput], [dobInput], [house_idInput])"
    //
    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO `items` (id, name, description) VALUES (?,?,?)";
        var inserts = [req.body.id, req.body.name, req.body.description];
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
    router.put('/info/:character_id/update/:item_id/:amount_of', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE `item_list` SET amount_of=?  WHERE character_id=? AND item_id=?";
        var inserts = [req.body.amount_of, req.params.character_id, req.params.item_id];
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


    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body);
        var sql = "UPDATE `items` SET id=?, name=?, description=? WHERE id=?";

        var inserts = [req.body.id, req.body.name, req.body.name, req.params.id];
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

//edit a single 
    router.put('/update/:item_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE `items` SET id=?, name=?, description=? WHERE id=?";
        var inserts = [req.body.item_id, req.body.name, req.body.description, req.body.item_id];
        console.log("inserting/updating = " + inserts);
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

    //If this works correctly it should delete an item from the items table
      router.delete('/:id', function(req, res){
      //console.log(req) //I used this to figure out where did pid and cid go in the request
        console.log("hello");
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM `items` WHERE id = ?";
        var inserts = [req.params.id];
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
