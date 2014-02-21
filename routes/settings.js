var data = require("../json/users.json");
var teamCoachData = require("../json/teamcoaches.json");
var teamData = require("../json/teams.json");
var admin = require("./admin");
var messages = require("./messages");
var teamsFns = require("./team");


exports.index = function(req, res) { 
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    var teams = messages.findTeamsForCoach(req.session.email);
    var teamRequests = [];
    for(team in teams) {
        teamRequests.push({"requests": teamsFns.getRequestsForTeam(teams[team])});
    } 
    if(req.query.email !== undefined) {
        if(teams.length != 0 && req.query.msg !== undefined) {
            var msg = req.query.msg;
        } else if(teams.length == 0) {
            var msg = 'Sorry, we couldn\'t a coach by that email.';
        }
        res.render('settings', {
            'teams': teams,
            'msg': msg,
            'teamRequests': teamRequests
        });
    } else {
        res.render('settings', {
            'teamRequests': teamRequests
        }); // Put in all the invites a coach currently has in both situations.
    }
}
