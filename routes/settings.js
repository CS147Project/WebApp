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
    console.log("user's email", req.session.email);
    var teams = messages.findTeamsForCoach(req.session.email);
    console.log("teams", teams);
    var requests = teamsFns.getRequestsForTeams(teams);
    console.log("requests", requests);
    // var teamathletes = [];
    // for(var i = 0; i<teams.length; i++) {
    //     var players = teamsFns.getPlayersByTeams(teams);

    // }



    var players = teamsFns.getPlayersByTeams(teams);
    var teamathletes = [];
    for(var i=0; i<players.size; i++) {
        var player = {
            "aid": player[i]
        };
        teamathletes.push(player);
    }


    console.log("playersL: " + players.length);

    if(req.session.email !== undefined) {
        if(teams.length != 0 && req.query.msg !== undefined) {
            var msg = req.query.msg;
        } else if(teams.length == 0) {
            var msg = 'Sorry, we couldn\'t a coach by that email.';
        }
        res.render('settings', {
            'teams': teams,
            'msg': msg,
            'requests': requests,
            'teamathletes': teamathletes
        });
    } else {
        res.render('settings', {
            'requests': requests
        }); // Put in all the invites a coach currently has in both situations.
    }
}