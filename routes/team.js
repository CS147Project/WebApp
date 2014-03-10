var data = require("../json/users.json");
var teamathletes = require("../json/teamathletes.json");
var invites = require("../json/invites.json");
var teamData = require("../json/teams.json");
var athletes = require("../json/athletes.json");
var models = require('../models');
var messages = require("./messages");



exports.view = function(req, res) {
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
                if(invites!=null) {
                    for(var i=0; i<invites.length; i++) {
                        console.log("pushing an invite");
                        teamRequests.push(invites[i]);
                    }
                }
                console.log("num requests: "+ teamRequests.length);
                res.render('team', {
                    'teamRequests': teamRequests
                }); 
            }





        }
        else {
            console.log("this coach has no teams");
            res.render('team');
        }

        // console.log("num requests: "+ teamRequests.length);
        // res.render('team', {
        //     'teamRequests': teamRequests
        // }); 

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
    models.User
    .find({"email": coachEmail})
    .exec(afterQuery);

//from messages is null -> problems when want length.
function afterQuery(err, coach) {
    console.log("coach: " + coach);
    cid = coach[0]._id;
    console.log("cid: "+ cid);

    models.TeamCoach
    .find({"cid": cid})
    .exec(afterTeamQuery);
    function afterTeamQuery(err, team) {
        if(team!=null) {

            console.log("team: " + team);
            tid = team.tid;
            console.log("tid: "+ tid);
        }
        else {
            console.log("this coach has no teams");
        }
    }



   // tid = req.body.tid;
   if(!onRoster(tid, aid)) {
    var newInvite = {

    }

        // newInvite = {
        //     "iid": 1,
        //     "aid": aid,
        //     "tid": tid,
        //     "datetime": d
        // }

        // invites['allInvites'].push(newInvite);
        console.log(newInvite);
        res.render('home', {
            'msg': 'Your request to join '+getNameForTeamId(tid)+' has been sent!',
            'athlete': isAthlete(req.session.email)
        }); // Can also redirect to 'settings'

    } else {
        res.render('settings', {
            'msg': 'There was a problem sending your invite. Please try again.'
        });
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
    var response = form_data.response;
    var aid = form_data.aid; //this is now an array
    var tid = form_data.tid;

for(var i =0; i<aid.length; i++) {
    if(response=="true") {
        // var teamathlete = {
        //     "tid": invite.tid,
        //     "aid": invite.aid
        // }
        // teamathletes["teamathletes"].push(teamathlete);
        // removeRequest(aid, tid);

//in DATABASE:
models.Invite
.find({"aid": aid[i]}, {"tid": tid[i]})
.remove()
.exec(afterRemoving);
function afterRemoving(err) {
    if(err) { console.log(err); res.send(500);};
}
 var newPlayer = new models.TeamAthlete({
            "aid": aid[i],
            "tid": tid[i]
        }) 
        newPlayer.save(afterSavingCoach);
        function afterSavingCoach(err, coach) {
            if(err) { console.log(err); res.send(500);};
        }
    }
}
    //remove request from array 
    // var index = invites["allInvites"].indexof(invite);
    // if(index > -1) {
    //  invites["allInvites"].splice(index, 1);
    // }
    res.redirect('settings');
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
