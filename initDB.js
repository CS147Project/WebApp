
/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.

  IMPORTANT: You should make sure the

      local_database_name

  variable matches its value in app.js  Otherwise, you'll have
  initialized the wrong database.
  */

  var mongoose = require('mongoose');
  var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'appdb';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);


// Do the initialization here

// Step 1: load the JSON data
//var projects_json = require('./projects.json');
var users = require("./json/users.json");
var users_json= users["users"];
var teams = require("./json2/teams.json");
var teams_json= teams["teams"];

//var users_json = require("./json/users.json");

models.Team
.find()
.remove()
  .exec(onceClearTeam); // callback to continue at

// Step 3: load the data from the JSON file
function onceClearTeam(err) {
  console.log("once clear");
  if(err) console.log(err);

  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var to_save_count = teams_json.length;
  console.log("to save count: " + to_save_count);
  // for(var i=0; i<projects_json.length; i++) {
    // var json = projects_json[i];
    // var proj = new models.Project(json);
    for(var i=0; i<teams_json.length; i++) {
      var json = teams_json[i];
      var proj = new models.Team(json);

      proj.save(function(err, proj) {
        if(err) console.log(err);

        to_save_count--;
        console.log(to_save_count + ' left to save');
        if(to_save_count <= 0) {
          console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
      }
    });

    }

}

// Step 2: Remove all existing documents
//models.Project
models.User
.find()
.remove()
  .exec(onceClear); // callback to continue at

// Step 3: load the data from the JSON file
function onceClear(err) {
  console.log("once clear");
  if(err) console.log(err);

  // loop over the projects, construct and save an object from each one
  // Note that we don't care what order these saves are happening in...
  var to_save_count = users_json.length;
  console.log("to save count: " + to_save_count);
  // for(var i=0; i<projects_json.length; i++) {
    // var json = projects_json[i];
    // var proj = new models.Project(json);
    for(var i=0; i<users_json.length; i++) {
      var json = users_json[i];
      var proj = new models.User(json);

      proj.save(function(err, proj) {
        if(err) console.log(err);

        to_save_count--;
        console.log(to_save_count + ' left to save');
        if(to_save_count <= 0) {
          console.log('DONE');
        // The script won't terminate until the 
        // connection to the database is closed
        mongoose.connection.close()
      }
    });
    }
  }

