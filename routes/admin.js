var data = require("../json/users.json");
var teamCoachData = require("../json/teamcoaches.json");
var teamData = require("../json/teams.json");
var models = require('../models');

// HELPER FUNCTIONS
function verifyAccount(users, req, res) {
    email = req.query.email;
    password = req.query.password;
    console.log("verifying: " + email, password);
    for (var user in users) {
        if (users[user].password == password && users[user].email == email) {
            req.session.email = email;
            console.log(req.session.email+' is logged in! Yay!!!');
            console.log(req.session);
            res.redirect('home');
            return true;
        }
    }
    return false;
}

exports.searchTeams = function(tid) {
    for(team in teamData['teams']) {
        if(teamData['teams'][team].tid == tid) return teamData['teams'][team];
    }
    return undefined;
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
    models.User.find({'email': req.query.email, 'password': req.query.password}).exec(afterQuery);
    function afterQuery(err, account) {
        if(err) {console.log(err); res.send(500);}
        if(account.length != 0) { // account does exist
            req.session.account = account;
            console.log(account.email);
            res.render('home');
        } else {
            res.render('login', {
                "msg": "We were not able to find your account. Please try again.",
                layout: false
            });
        }
        // console.log(account[0]);
    }
 }

exports.addUser = function(req, res) { 
    console.log("Query", req.query);
    var crypto = require('crypto'); //used for hashing passwords
    var athlete = false; 
    var coach = false;
    if(req.query.accountType == "athlete") {
        athlete = true;
    } else if(req.query.accountType == "coach") {
        coach = true;
    } else if(req.query.accountType == "both") {
        athlete = true;
        coach = true;
    }

    newUserData = {
        'email': req.query.email,
        'firstName': req.query.firstName,
        'lastName': req.query.lastName,
        'isAthlete': athlete,
        'isCoach': coach,
        'password': req.query.password, //crypto.createHash('md5').update(req.query.name).digest('hex')    
    }
    if(noBlank(newUserData, req)) {
        models.User.find({'email': req.query.email}).exec(afterQuery);
        function afterQuery(err, account) {
            if(err) {console.log(err); res.send(500);}
            console.log("account", account);

            if(account.length != 0) { // account taken
                console.log("Account found with same email.");
                res.render('signup', {
                    'msg': 'That email account is taken. Please choose another one.',
                    layout: false
                });
                return;
            } else { // create account
                console.log("Let's set up an account.");
                var newUser = new models.User(newUserData);
                newUser.save(afterSaving);

                function afterSaving(err) {
                    if(err) {console.log(err); res.send(500);}
                    req.session.email = newUserData['email'];
                    res.redirect('home');
                }
            }
        }
    } else { // Left fields blank.
       res.render('signup', {
            'msg': 'Please fill in all the fields.',
            layout: false
        }); 
    }
 }

