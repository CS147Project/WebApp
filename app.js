
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');
/*
//////// MYSQL CONFIG CODE
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});
*/


/*
connection.query('CREATE DATABASE IF NOT EXISTS appdb');
connection.query('USE appdb');

// Create db tables for app. Add new tables below.
// User table
connection.query("CREATE TABLE IF NOT EXISTS users (" +
  "email varchar(40) NOT NULL," +
  "firstName varchar(25) NOT NULL," +
  "lastName varchar(25) NOT NULL," +
  "nickname varchar(25)," +
  "password varchar(40) NOT NULL," +
  "PRIMARY KEY (email)" +
  ")");

// Athlete table
connection.query("CREATE TABLE IF NOT EXISTS athletes (" +
  "aid varchar(40) NOT NULL," +
  "PRIMARY KEY (aid)," +
  "FOREIGN KEY (aid) REFERENCES users(email)"+
  ")");

// Coach table
connection.query("CREATE TABLE IF NOT EXISTS coaches (" +
  "cid varchar(40) NOT NULL," +
  "PRIMARY KEY (cid)," +
  "FOREIGN KEY (cid) REFERENCES users(email)"+
  ")");

// Invite table
connection.query("CREATE TABLE IF NOT EXISTS invite (" +
  "iid bigint NOT NULL AUTO_INCREMENT," +
  "aid varchar(25) NOT NULL," +
  "tid bigint NOT NULL," +
  "created timestamp default now()," +
  "PRIMARY KEY (iid)," +
  "FOREIGN KEY (aid) REFERENCES athletes(aid),"+
  "FOREIGN KEY (tid) REFERENCES teams(tid)"+
  ")");

// Message table
connection.query("CREATE TABLE IF NOT EXISTS messages (" +
  "mid bigint NOT NULL AUTO_INCREMENT," +
  "text text NOT NULL," +
  "fromid varchar(40) NOT NULL," +
  "toid varchar(40) NOT NULL," +
  "created timestamp default now()," +
  "PRIMARY KEY (mid)," +
  "FOREIGN KEY (fromid) REFERENCES users(email),"+
  "FOREIGN KEY (toid) REFERENCES users(email)"+
  ")");

// Team table
connection.query("CREATE TABLE IF NOT EXISTS teams (" +
  "tid bigint NOT NULL AUTO_INCREMENT," +
  "name varchar(45) NOT NULL," +
  "sport varchar(45) NOT NULL," +
  "PRIMARY KEY (tid)" +
  ")");

// TeamAthlete table
connection.query("CREATE TABLE IF NOT EXISTS teamathletes (" +
  "tid bigint NOT NULL," +
  "aid varchar(40) NOT NULL," +
  "FOREIGN KEY (tid) REFERENCES teams(tid),"+
  "FOREIGN KEY (aid) REFERENCES athletes(aid)"+
  ")");

// TeamCoach table
connection.query("CREATE TABLE IF NOT EXISTS teamcoaches (" +
  "tid bigint NOT NULL," +
  "cid varchar(40) NOT NULL," +
  "FOREIGN KEY (tid) REFERENCES teams(tid),"+
  "FOREIGN KEY (cid) REFERENCES athletes(cid)"+
  ")");
*/

var admin = require('./routes/admin');
var settings = require('./routes/settings');
var home = require('./routes/home');
var team = require('./routes/team');
var messages = require('./routes/messages');
var workout = require('./routes/workout');
var workouts = require('./routes/workouts');


// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'appdb';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', admin.login);
app.get('/login', admin.login);
app.get('/loginAttempt', admin.loginHandler);
app.get('/signup', admin.signup);
app.get('/addUser', admin.addUser);
app.get('/settings', settings.index);
app.get('/logout', admin.logout);
app.get('/home', home.view);
app.post('/inviteTeam', team.sendRequest);
app.get('/respondTeam', team.respondRequest)
app.get('/messages', messages.get);
app.get('/messages/create', messages.create);
app.get('/startworkout', workout.start);
app.get('/goWorkout:id', workout.goWorkout);
app.get('/goWorkout/save', workout.save);
app.get('/goWorkout/next', workout.next);
app.get('/goWorkout/previous', workout.previous);
app.get('/workouts', workouts.view);
app.post('/workouts/create', workouts.create);
app.get('/workouts/getAll', workouts.getAll);
app.get('/workouts/getExercises', workouts.getExercises); //returns [] of exercises for workout
app.get('/workouts/getUserWorkouts', workouts.getUserWorkouts); //returns workouts assigned to a user
app.post('/workouts/assignWorkout', workouts.assignWorkout);
app.post('/workouts/addCompletedWorkout', workouts.addCompletedWorkout);
app.get('/analytics', workouts.analytics);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
