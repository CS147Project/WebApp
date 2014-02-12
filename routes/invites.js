var data = require("../json/teamcoaches.json");

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

// EXPORTED CONTROLLER METHODS
exports.send = function(req, res) { 
    var newInvite = {
        "iid": 2,
        "aid": "jeremy@h.com",
        "tid": 1,
        "datetime": "01/01/2014"
    }
    console.log(newInvite);
    res.redirect('settings');
}

exports.viewAll = function(req, res) {
    var invites = searchForInviteByCoachEmail(req.query.team);
    res.render('viewInvites', {
        'invites': invites
    });
}
