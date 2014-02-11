var data = require("../data.json");

function uniqueAccount(users, newUser) {
    for (var user in users) {
        if (user.email == newUser.email) {
            return false;
        }
    }
    return true;
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
    if(uniqueAccount(data['users'], newUser)) {
        data['users'].push(newUser);
        req.session.email = email;
        console.log(email+' is logged in! Yay!!!');
        res.redirect('home'); // Send new user to the homepage
    }
    res.redirect('login');
 }
