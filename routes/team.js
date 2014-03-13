var data = require("../json/users.json");
var teamathletes = require("../json/teamathletes.json");
var invites = require("../json/invites.json");
var teamData = require("../json/teams.json");
var athletes = require("../json/athletes.json");
var models = require('../models');
var messages = require("./messages");



exports.view = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    var cid = req.session._id;
    var teamRequests = [];


    console.log("cid: "+ cid);
    //get teamReq with database
    models.TeamCoach
    .find({"cid": cid})
    .exec(afterTeamQuery);
    function afterTeamQuery(err, team) {
        if(team!=null && team.length>0) {
            //IDK why TID is undefined in the following line!!!
            var tid = team[0].tid;
            console.log("found tid at 0 for this coach: "+ tid);
            models.Invite
            .find({"tid": tid}).exec(afterInviteQuery);
            function afterInviteQuery(err, invites) {
                if(invites!=null && invites.length>0) {
                    var j =0;
                    for(var i=0; i<invites.length; i++) {
                        models.User.find({"_id": invites[i].aid}).exec(afterUserQuery);
                        function afterUserQuery(err, user) {
                            console.log("I: " + i);
                            console.log("j: " + j);
                            console.log("full name: "+ user[0].firstName + " " + user[0].lastName);
                            console.log("invites: "+ invites);
                            var request = {
                                "name": user[0].firstName + " " + user[0].lastName,
                                "requestId": invites[j]._id
                            }
                            teamRequests.push(request);
                            if(j+1 == invites.length) {
                                res.render('team', {
                                    'teamRequests': teamRequests,
                                    'players': players,
                                    'isCoach': true,
                                    'hasTeam': true
                                }); 
                            }
                            j++;
                        }
                    }      
                } else {
                    console.log("this coach has no invites");
                    res.render('team', {'isCoach': true, 'hasTeam': true});
                }
                var players = [];
                    // models.TeamAthlete
                    // .find({"tid": tid}).exec(afterTeamAthleteQuery);
                    // function afterTeamAthleteQuery(err, TeamAthletes) {
                    //     console.log("num athletest on my team: "+ TeamAthletes.length);
                    //     for(var i = 0; i<TeamAthletes.length; i++) {
                    //         players.push(TeamAthletes[i]);
                    //     }
                    // }

                    console.log("num requests: "+ teamRequests.length);
                // res.render('team', {
                //     'teamRequests': teamRequests,
                //     'players': players
                // }); 
}
} else {
    console.log("this coach as no teams");
    models.User
    .find({"_id": cid})
    .exec(afterCoachQuery);
    function afterCoachQuery(err, user) {
        if(user[0].isCoach) {
            res.render('team', {'isCoach': true, 'hasTeam': false});
        }
        else {
           res.render('team', {'isCoach': false});   
       }
   }
}
}
//Get TEam Requests with Database



// var teams = messages.findTeamsForCoach(req.session.email);
// for(team in teams) {
//     teamRequests.push({"requests": getRequestsForTeam(teams[team])});
// }
// res.render('team', {
//     'teamRequests': teamRequests
// }); 
  //  res.render('team');
}

exports.getAllRequests = function() {
    var requests = [];
    for(team in teamData['teams']) {
        for(invite in invites['allInvites']) {
            if(teamData['teams'][team].tid == invites['allInvites'][invite].tid) {
                requests.push(invites['allInvites'][invite]);
            }
        }
    }
    return requests;
}

exports.getRequestsForTeam = function(team) {
    var requests = [];
    for(invite in invites['allInvites']) {
        console.log("invite tid's", invites['allInvites'][invite].tid);
        if(team == invites['allInvites'][invite].tid) {
            requests.push(invites['allInvites'][invite]);
        }
    }
    return requests;
}

exports.getRequestsForTeams = function(teams) {
    var requests = [];
    for(team in teams) {
        for(invite in invites['allInvites']) {
            if(teams[team].tid == invites['allInvites'][invite].tid) {
                requests.push(invites['allInvites'][invite]);
            }
        }
    }
    return requests;
}

//delete later (when move away from JSON and into database)

function getRequestsForTeam (team) {
    var requests = [];
    for(invite in invites['allInvites']) {
        console.log("invite tid's", invites['allInvites'][invite].tid);
        if(team == invites['allInvites'][invite].tid) {
            requests.push(invites['allInvites'][invite]);
        }
    }
    return requests;
}

function onRoster(tid, aid) {
    for (var athlete in teamathletes["teamathletes"]) {
        if (athlete.tid == tid && athlete.aid == aid) {
            return true;
        }
    }
    return false;
}

function parseDate(d) {
    var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + "";
    return newDate;
}

function getNameForTeamId(tid) {
    for(team in teamData['teams']) {
        if(teamData['teams'][team].tid == tid) return teamData['teams'][team].name;
    }
    return "TEAM NAME NOT FOUND";
}

function isAthlete(email) {
    for(athlete in athletes['athletes']) {
        if(athletes['athletes'][athlete].aid == email) return true;
    }
    return false;
}

exports.createTeam = function(req, res) {
    var cid = req.session._id;
    var sport = req.body.sport;
    var name = req.body.name;
    var tid="";
    var team = new models.Team({
        "sport": sport,
        "name": name
    }) 
    team.save(afterSaving);
    function afterSaving(err, team) {
        if(err) { console.log(err); res.send(500);};
        tid= team._id;
        console.log("tid: " + tid);

        var coach = new models.TeamCoach({
            "cid": cid,
            "tid": team._id
        })
        coach.save(afterSavingCoach);
        function afterSavingCoach(err, coach) {
            console.log("save coach: +" + coach.cid + coach.tid);
            res.redirect("/teamPage");
        }
    }
}

exports.getTeamsByUser =function(req, res) {
    var user = req.session.email;
    //TODO
}

exports.removeAthleteFromTeam = function(req, res) {
    var aid = req.query.aid;
    //TODO
}

exports.getPlayersCoaches = function(req, res) {
    var aid = req.session.email;
    //TODO
    //return JSON object of all of the player's coaches (ID's)
}

function getTeamByCoach(cid) {

}

exports.sendRequest = function(req, res) {
    if(req.session !== undefined && req.session.email !== undefined) {
        aid = req.session.email;        
    } else {
        res.redirect('login');
        return;
    }

    var coachEmail = req.body.email;
    console.log("coach email: "+ coachEmail);
    var cid = "";
    var tid = "";
    models.User.find({"email": coachEmail}).exec(afterQuery);

    //from messages is null -> problems when want length.
    function afterQuery(err, coach) {
        console.log("coach: " + coach);
        if(coach[0] == undefined) {
            console.log("can't find user.");
            return res.redirect('teamPage'); //redirect somewhere meaningful if email doesn't match the one entered by user
        } else if(coach[0].isCoach == false) { 
            console.log("user is not coach.", coach.isCoach);
            return res.redirect('teamPage'); // redirect somewhere id user searched for does exist, but user is not coach
        }
        cid = coach[0]._id;
        console.log("cid: "+ cid);

        models.TeamCoach.find({"cid": cid}).exec(afterTeamQuery);
        function afterTeamQuery(err, team) {
            if(team!=null) {
                console.log("team: " + team);
                tid = team[0].tid;


                models.TeamAthlete.find({"aid": req.session._id, "tid": tid}).exec(afterPlayerQuery); 
                function afterPlayerQuery(err, player) {
                   if(player[0]==null) {
                    models.Invite.find({"aid": req.session._id, "tid": tid}).exec(afterInviteQuery); 
                    function afterInviteQuery(err, invite) {
                        if(invite[0] == null) {
                           console.log("creating req with tid: "+ tid + "aid: " + req.session._id + "cid: " + cid);
                           var invite = new models.Invite({
                               "cid": cid,
                               "aid": req.session._id,
                               "tid": tid
                           });
                           invite.save(afterSaving);
                           function afterSaving(err, team) {
                            console.log("just saved an invite");
                            res.redirect("teamPage");


                        }
                    }
                    else {
                        res.redirect("teamPage");
                    }

                }


            }

            else {
                res.redirect("teamPage");
            }
        }
    } 
    else {
        console.log("this coach has no teams");
        res.redirect("teamPage");
    }
}
}
}

function removeRequest(aid, tid) {
    for(invite in invites["allInvites"]) {
        if(invites["allInvites"][invite].aid == aid && invites["allInvites"][invite].tid == tid) {
            invites["allInvites"].splice(invite, 1);
            return;
        }
    }
    return;

}

exports.respondRequest = function(req, res) {
    var form_data = req.body;
    var requestId = req.body.requestId;
    var response = req.body.response;
    console.log("requestID: "+ requestId + "response: " + response);
//    var response = form_data.response;
    // var requests = [];
    // requests = form_data.requestId;
    // console.log("requests: "+ requests);
    // console.log("req. len: "+ requests.length);
    // for(var i =0; i<requests.length; i++) {
//in DATABASE:
if(response == "accept") {
    models.Invite
    .find({"_id": requestId})
    .exec(afterFindingInvite);
    function afterFindingInvite(err, invite) {
        if(err) { console.log(err); res.send(500);};
// console.log("aid: " + invite.aid );
// console.log("aid 0: " + invite[0].aid);

var newPlayer = new models.TeamAthlete({
    "aid": invite[0].aid,
    "tid": invite[0].tid
}) 
newPlayer.save(afterAddingPlayer);
function afterAddingPlayer(err, coach) { 
   if(err) { console.log(err); res.send(500);};
   console.log("just added playter");
   models.Invite
   .find({"_id": requestId})
   .remove()
   .exec(afterRemovingInvite);
   function afterRemovingInvite(err) {
    if(err) { console.log(err); res.send(500);};
    "just removed invite";

    res.redirect('teamPage');

}


}

}

}
else {
    models.Invite
    .find({"_id": requestId})
    .remove()
    .exec(afterRemovingInvite);
    function afterRemovingInvite(err) {
     if(err) { console.log(err); res.send(500);};
     console.log("IN REMOVE STATEMENT");
     res.redirect('teamPage');
 }

}

  //  res.redirect('teamPage');
}







exports.respondRequestAll = function(req, res) {
   var cid = req.session._id;
   var teamRequests = [];


   console.log("cid: "+ cid);
    //get teamReq with database
    models.TeamCoach
    .find({"cid": cid})
    .exec(afterTeamQuery);
    function afterTeamQuery(err, team) {
        models.Invite
        .find({"tid": tid})
        .exec(afterFoundAllInvites);

        function afterFoundAllInvites(err, invites) {
            for(var i=0; i<invites.length; i++) {
                var newPlayer = new models.TeamAthlete({
                    "aid": invites[i].aid,
                    "tid": invites[i].tid
                }) 
                newPlayer.save(afterSaving);
                function afterSaving(err, player) {
                    if(err) { console.log(err); res.send(500);};
                    if(i+1==invites.length) {
                        models.Invite
                        .find({"tid": tid})
                        .remove()
                        .exec(removedInvites);
                        function removedInvites(err) {
                            res.redirect("team");
                        }
                    }

                }
            }
        }


    }




//TODO: add more here!
res.redirect('settings');
}

exports.get = function(req, res) {
//TODO: add more here!
res.redirect('team');
}

exports.removeAthlete = function(req, res) {
//TODO: add more here!
res.redirect('team');
}

exports.viewAll = function(req, res) {
    var invites = searchForInviteByCoachEmail(req.query.team); // Still need to write this fn
    res.render('viewInvites', {
        'invites': invites
    });
}
