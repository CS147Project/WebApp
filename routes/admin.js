var data = require("../json/users.json");

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
        }
    }
}

function noBlank(newUser) {
    if(req.query.email == undefined || req.query.email == '') {
        return false;
    } else if(req.query.firstName == undefined || req.query.firstName == '') {
        return false;
    } else if(req.query.lastName == undefined || req.query.lastName == '') {
        return false;
    } else if(req.query.nickname == undefined || req.query.nickname == '') {
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
    res.render('login');
 }

// EXPORTED CONTROLLER METHODS
exports.signup = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
        res.redirect('home');
    }
    res.render('signup');
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
    verifyAccount(users, req, res); // Need to check if redirect end current function or allows continued execution
    res.render('login', {
        "msg": "I am sorry, but we were not ablt to find your account. Please try again."
    })
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
    if(uniqueAccount(data['users'], newUser) && noBlank(newUser)) {
        data['users'].push(newUser);
        req.session.email = email;
        console.log(email+' is logged in! Yay!!!');
        res.redirect('home'); // Send new user to the homepage
    }
    res.redirect('login');
 }
