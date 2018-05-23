module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getHouseStudents(res, mysql, context, house_id, complete){
      var sql = "SELECT id, fname, lname, dob, house_id FROM `character` WHERE house_id = ?";
      var inserts = [house_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character  = results;
            complete();
        });
    }

    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT id, fname, lname, role_id, dob, house_id FROM `character`", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            //console.log('this.sql', mysql.pool.query);
            context.character = results;
            complete();
        });
    }

    function getCharacter(res, mysql, context, id, complete){
        var sql = "SELECT id, fname, lname, dob FROM `character` WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
            complete();
        });
    }

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, complete);
        //getHouseStudents(res, mysql, context, req.body.house_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('house_characters', context);
            }

        }
    });

    router.get('/:house_id', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updatecharacter.js"];
        var mysql = req.app.get('mysql');
        //getCharacters(res, mysql, context, complete);
        getHouseStudents(res, mysql, context, req.params.house_id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('house_characters', context);
            }

        }
    });
    
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["selectedplanet.js", "updatecharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-character', context);
            }

        }
    });

    /* Display one person for the specific purpose of updating people */


    router.post('/', function(req, res){
        console.log(req.body.house_id)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "SELECT id, fname, lname, dob, house_id FROM `character` WHERE house_id = ?";
        var inserts = [req.body.house_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
              //getHouseStudents(res, mysql, context, req.body.house_id, complete);
               res.redirect('/house/' + req.body.house_id);
            }
        });
    });

    /* The URI that update data is sent to in order to update a person */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE `character` SET fname=?, lname=?, dob=?, house_id=? role_id=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.dob, req.body.house_id, req.params.role_id, req.params.id];
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

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM `character` WHERE id = ?";
        var inserts = [req.params.id];
        //console.log("QUERY IS...", sql, req.params.id);
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
