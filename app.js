
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');
mongoose.set('debug', true);

// Routes
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
app.get('/home_grid', home.viewGrid);

app.post('/createTeam', team.createTeam);
app.post('/inviteTeam', team.sendRequest);
app.post('/respondTeam', team.respondRequest);
app.get('/teamPage', team.view);

app.get('/messages', messages.get);
app.get('/messages/create', messages.create);

app.get('/goWorkout:id', workout.goWorkout);
app.get('/goWorkout_alt:id', workout.goWorkout_alt);
app.get('/goWorkout/submit', workout.submit);
app.post('/goWorkout/save', workout.save);
app.get('/workouts', workouts.view);
app.get('/startWorkoutCreation', workouts.start);
app.post('/createWorkout', workouts.create);
app.get('/workouts/getAll', workouts.getAll);
app.get('/workouts/getExercises', workouts.getExercises); //returns [] of exercises for workout
app.get('/workouts/getUserWorkouts', workouts.getUserWorkouts); //returns workouts assigned to a user
app.get('/assign', workouts.assign);
app.post('/workouts/assignWorkout', workouts.assignWorkout);
app.post('/workouts/addCompletedWorkout', workouts.addCompletedWorkout);
app.get('/analytics', workouts.analytics);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
