var data = require("../data.json");

function verifyAccount(users, req, res) {
    email = req.query.email;
    password = req.query.password;
    for (var user in users) {
        if (user.password = password) {
            res.session.email = email;
            console.log(email+' is logged in! Yay!!!');
            res.redirect('home');
        }
    }
}

exports.login = function(req, res) { 
    var crypto = require('crypto'); //used for hashing passwords

    users = data['users'];
    verifyAccount(users, req, res); // Need to check if redirect end current function or allows continued execution
    res.render('/', {
        "msg": "I am sorry, but we were not ablt to find your account. Please try again."
    })
 }
