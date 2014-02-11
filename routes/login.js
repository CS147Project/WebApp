var data = require("../data.json");

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

exports.login = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
        res.redirect('home');
    }
    res.render('login');
 }

exports.loginHandler = function(req, res) { 
    var crypto = require('crypto'); //used for hashing passwords
    users = data['users'];
    verifyAccount(users, req, res); // Need to check if redirect end current function or allows continued execution
    res.render('login', {
        "msg": "I am sorry, but we were not ablt to find your account. Please try again."
    })
 }
