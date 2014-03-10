
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
mongoose.connect(database_uri); //, function() {mongoose.database_uri.db.dropDatabaes();

if(mongoose.connection.collections['completedexercise']) {
  mongoose.connection.collections['completedexercise'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['completedworkout']) {
  mongoose.connection.collections['completedworkout'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['workouttemplates']) {
  mongoose.connection.collections['workouttemplates'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['users']) {
  mongoose.connection.collections['users'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['invites']) {
  mongoose.connection.collections['invites'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['messages']) {
  mongoose.connection.collections['messages'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['teamathletes']) {
  mongoose.connection.collections['teamathletes'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['teamcoaches']) {
  mongoose.connection.collections['teamcoaches'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['exercisetemplates']) {
  mongoose.connection.collections['exercisetemplates'].drop( function(err) {
      console.log('collection dropped');
  });
}

if(mongoose.connection.collections['workouttemplates']) {
  mongoose.connection.collections['workouttemplates'].drop( function(err) {
      console.log('collection dropped');
      mongoose.connection.close();
  });
}



// Do the initialization here

// Step 1: load the JSON data
//var projects_json = require('./projects.json');
// var users = require("./json/users.json");
// var users_json= users["users"];
// var teams = require("./json2/teams.json"); //need this one to prepopulate teams.
// var teams = require("./json/teams.json");
// var teams_json= teams["teams"];
// var exercises = require("./json2/exercises.json");
// var exercises_json= exercises["exercises"];

// models.drop();

// models.Invite.drop();

// models.Message.drop();

// models.Team.drop();

// models.TeamAthlete.drop();

// models.TeamCoach.drop();

// models.ExerciseTemplate.drop();

// models.WorkoutTemplate.drop().exec(onceClearModels);

function onceClearModels(err) {
    mongoose.connection.close();
}



// models.ExerciseTemplate
// .find()
// .remove()
//   .exec(onceClearExercises); // callback to continue at

// // function onceClearExercises(err) {
// //   if(err) console.log(err);
// //     for(var i=0; i<exercises_json.length; i++) {
// //       var json = exercises_json[i];
// //       var proj = new models.ExerciseTemplate(json);
// //       proj.save(function(err, proj) {
// //         if(err) console.log(err);
// //     });
// //     }
// // }

// models.Team
// .find()
// .remove()
//   .exec(onceClearTeam); // callback to continue at

// // Step 3: load the data from the JSON file
// function onceClearTeam(err) {
//   if(err) console.log(err);

//   // loop over the projects, construct and save an object from each one
//   // Note that we don't care what order these saves are happening in...
//   var to_save_count = teams_json.length;
// // console.log("to save count: " + to_save_count);
//     for(var i=0; i<teams_json.length; i++) {
//       var json = teams_json[i];
//       var proj = new models.Team(json);

//       proj.save(function(err, proj) {
//         if(err) console.log(err);

//         to_save_count--;
//       //   console.log(to_save_count + ' left to save');
//       //   if(to_save_count <= 0) {
//       //     console.log('DONE');

//       // }
//     });

//     }

// }

// models.Team
// .find()
// .remove()
//   .exec(onceClearTeam); // callback to continue at

// // Step 3: load the data from the JSON file
// function onceClearTeam(err) {
//   if(err) console.log(err);

//   // loop over the projects, construct and save an object from each one
//   // Note that we don't care what order these saves are happening in...
//   var to_save_count = teams_json.length;
// // console.log("to save count: " + to_save_count);
//     for(var i=0; i<teams_json.length; i++) {
//       var json = teams_json[i];
//       var proj = new models.Team(json);

//       proj.save(function(err, proj) {
//         if(err) console.log(err);

//         to_save_count--;
//       //   console.log(to_save_count + ' left to save');
//       //   if(to_save_count <= 0) {
//       //     console.log('DONE');

//       // }
//     });

//     }

// }

// // Step 2: Remove all existing documents
// //models.Project
// models.User
// .find()
// .remove()
//   .exec(onceClear); // callback to continue at

// // Step 3: load the data from the JSON file
// function onceClear(err) {
//   console.log("once clear");
//   if(err) console.log(err);

//   // loop over the projects, construct and save an object from each one
//   // Note that we don't care what order these saves are happening in...
//   var to_save_count = users_json.length;
//   console.log("to save count: " + to_save_count);
//   // for(var i=0; i<projects_json.length; i++) {
//     // var json = projects_json[i];
//     // var proj = new models.Project(json);
//     for(var i=0; i<users_json.length; i++) {
//       var json = users_json[i];
//       var proj = new models.User(json);

//       proj.save(function(err, proj) {
//         if(err) console.log(err);

//         to_save_count--;
//         console.log(to_save_count + ' left to save');
//         if(to_save_count <= 0) {
//           console.log('DONE');
//         // The script won't terminate until the 
//         // connection to the database is closed
//         mongoose.connection.close()
//       }
//     });
//     }
//   }

