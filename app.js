
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');

//////// MYSQL CONFIG CODE
// var mysql = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'vagrant',
//   port     : '3000'
// });
// connection.connect();
// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The solution is: ', rows[0].solution);
// });

var admin = require('./routes/admin');
var home = require('./routes/home');
var team = require('./routes/team');
var messages = require('./routes/messages');
var workout = require('./routes/workout');
var invites = require('./routes/invites');

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
app.get('/settings', admin.settings);
app.get('/logout', admin.logout);
app.get('/home', home.view);
app.get('/team/invite', team.sendRequest);
app.get('/team/respond', team.respondRequest)
app.get('/messages', messages.get);
app.get('/messages/create', messages.create);
app.get('/startworkout', workout.start);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
