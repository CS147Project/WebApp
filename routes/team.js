var data = require("../json/users.json");
var teamathletes = require("../json/teamathletes.json");
var invites = require("../json/invites.json");
var teamData = require("../json/teams.json");
var athletes = require("../json/athletes.json");

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

exports.getPlayersByTeams = function(teams) {
    var myAthletes=[];
    for(var i=0; i<teams.length; i++) {
        for(athlete in teamathletes["teamathletes"]) {
            if(teamathletes["teamathletes"][athlete].tid==teams[i]) {
                myAthletes.push(teamathletes["teamathletes"][athlete].aid);
            }
        }
    }
return myAthletes;;

}

exports.getRequestsForTeams = function(teams) {
    var requests = [];
    //for(var team in teams) {
        for(var i=0; i<teams.length; i++) {
            console.log("team id: " + teams[i]);
        for(invite in invites['allInvites']) {
            if(teams[i] == invites['allInvites'][invite].tid) {
                requests.push(invites['allInvites'][invite]);
            }
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
    var tid = req.query.tid;
//FILL THIS OUT



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

exports.sendRequest = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
        aid = req.session.email;        
    } else {
        res.redirect('login');
        return;
    }
	var d = new Date();
	d = parseDate(d);
    tid = req.body.tid;
	if(!onRoster(tid, aid)) {
		newInvite = {
			"iid": 1,
            "aid": aid,
            "tid": tid,
            "datetime": d
        }

        invites['allInvites'].push(newInvite);
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
    var aid = form_data.aid;
    var tid = form_data.tid;

	if(response=="true") {
		var teamathlete = {
			"tid": invite.tid,
            "aid": invite.aid
		}
		teamathletes["teamathletes"].push(teamathlete);
        removeRequest(aid, tid);

	}
	//remove request from array 
	// var index = invites["allInvites"].indexof(invite);
	// if(index > -1) {
	// 	invites["allInvites"].splice(index, 1);
	// }
	res.redirect('settings');
}

exports.viewAll = function(req, res) {
    var invites = searchForInviteByCoachEmail(req.query.team); // Still need to write this fn
    res.render('viewInvites', {
        'invites': invites
    });
}

