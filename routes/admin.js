var data = require("../json/users.json");
var teamCoachData = require("../json/teamcoaches.json");
var teamData = require("../json/teams.json");

// HELPER FUNCTIONS
function verifyAccount(users, req, res) {
    email = req.query.email;
    password = req.query.password;
    console.log(email, password);
    for (var user in users) {
        if (users[user].password == password) {
            req.session.email = email;
            console.log(email+' is logged in! Yay!!!');
            res.redirect('home');
            return true;
        }
    }
    return false;
}

function searchTeams(tid) {
    for(team in teamData['teams']) {
        if(teamData['teams'][team].tid == tid) return teamData['teams'][team];
    }
    return undefined;
}

function findTeamsForCoach(email) {
    var teams = [];
    for(element in teamCoachData['teamCoaches']) {
        var teamCoachElement = teamCoachData['teamCoaches'][element];
        if(teamCoachElement['cid'] == email) {
            teams.push(searchTeams(teamCoachElement['tid']));
        }
    }
    console.log(teams);
    return teams;
}

function noBlank(newUser, req) {
    if(req.query.email == undefined || req.query.email == '') {
        return false;
    } else if(req.query.firstName == undefined || req.query.firstName == '') {
        return false;
    } else if(req.query.lastName == undefined || req.query.lastName == '') {
        return false;
    } else if(req.query.password == undefined || req.query.password == '') {
        return false;
    }
    return true;
}

function uniqueAccount(users, newUser) {
    for (var user in users) {
        if (user.email == newUser.email) {
            return false;
        }
    }
    return true;
}

// EXPORTED CONTROLLER METHODS
exports.login = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
        res.redirect('home');
    }
    res.render('login', {layout: false});
 }

exports.signup = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
        res.redirect('home');
    }
    res.render('signup', {layout: false});
 }

exports.logout = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
        req.session.email = undefined;
    }
    res.redirect('login');
}

exports.loginHandler = function(req, res) { 
    var crypto = require('crypto'); //used for hashing passwords
    users = data['users'];
    if(!verifyAccount(users, req, res)) {
        res.render('login', {
            "msg": "I am sorry, but we were not ablt to find your account. Please try again.",
            layout: false
        });
    }
 }

exports.addUser = function(req, res) { 
    var crypto = require('crypto'); //used for hashing passwords
    newUser = {
        'email': req.query.email,
        'firstName': req.query.firstName,
        'lastName': req.query.lastName,
        'nickname': req.query.nickname,
        'password': req.query.password, //crypto.createHash('md5').update(req.query.name).digest('hex')    
    }
    if(uniqueAccount(data['users'], newUser) && noBlank(newUser, req)) {
        data['users'].push(newUser);
        req.session.email = req.query.email;
        console.log(req.session.email+' is logged in! Yay!!!');
        res.redirect('home'); // Send new user to the homepage
    }
    res.render('signup', {
        'msg': 'There was a problem creating your account. Please try again.',
        layout: false
    });
 }

exports.settings = function(req, res) { 
    if(req.query.email !== undefined) {
        console.log(req.session.email);
        var teams = findTeamsForCoach(req.query.email);
        if(teams.length == 0) var msg = 'Sorry, we couldn\'t a coach by that email.'; 
        res.render('settings', {
            'email': req.session.email,
            'teams': teams,
            'msg': msg,
            'pending': pending
        });
    } else {
        res.render('settings');
    }
}
