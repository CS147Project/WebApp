var data = require("../json/users.json");
var teamCoachData = require("../json/teamcoaches.json");
var teamData = require("../json/teams.json");
var admin = require("./admin");
var messages = require("./messages");
var teamsFns = require("./team");
//added
var teamathletes = require("../json/teamathletes.json");


exports.index = function(req, res) { 
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    console.log(req.session.email);
    var teams = messages.getTeamsByCoach(req.query.email);
    var requests = teamsFns.getRequestsForTeams(teams);
    if(req.query.email !== undefined) {
        if(teams.length != 0 && req.query.msg !== undefined) {
            var msg = req.query.msg;
            //get team athletes here
        } else if(teams.length == 0) {
            var msg = 'Sorry, we couldn\'t a coach by that email.';
        }
        res.render('settings', {
            'teams': teams,
            'msg': msg,
            'requests': requests
        });
    } else {
        res.render('settings', {
            'requests': requests
        }); // Put in all the invites a coach currently has in both situations.
    }
}

// exports.removeAthleteFromTeam = function(req, res) {
//     var aid = req.query.aid;
//     var tid = req.query.tid;
//     console.log("Before Removing: " + teamathletes[teamathletes].length);

//     models.TeamAthleteSchema
//         .find({"_id": aid, "tid": tid})
//         .remove()
//         .exec(afterRemoving);

//         function afterRemoving(err) {
//             if(err) {console.log(err); res.send(500);};
//             console.log("After Removing: " + teamathletes[teamathletes].length);

//             res.redirect('/settings');
//         }
// }
