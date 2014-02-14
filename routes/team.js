var data = require("../data.json");
var teamathletes = require("../json/teamathletes.json");
var invites = require("../json/invites.json");


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

exports.sendRequest = function(req, res) { 
	tid = req.query.tid;
    if(req.session !== undefined && req.session.email !== undefined) {
        aid = req.session.email;        
    } else {
        res.redirect('login');
        return;
    }
	var d = new Date();
	d = parseDate(d);

	if(!onRoster(tid, aid)) {
		newInvite = {
			"iid": 1,
            "aid": aid,
            "tid": tid,
            "datetime": d
        }

        //console.log("size invites: " + invites["allInvites"].size);
        // for(var invite in invites["allInvites"]) {
        // 	console.log("one: " + invite.aid);
        // }
        // console.log("invites: " + invites);
    	
        invites['allInvites'].push(newInvite);
        console.log(newInvite);
        res.redirect('home'); // Can also redirect to 'settings'

        //  console.log("size2 invites: " + invites['allInvites'].length);
        // 	console.log("all invites: "+ invites);
    } else {
        res.render('settings', {
            'msg': 'There was a problem sending your invite. Please try again.'
        });
    }
}

exports.respondRequest = function(req, res) {
	var invite = req.query.invite;
	var response = req.query.response;
	if(response==true) {
		var teamathlete = {
			"tid": invite.tid,
            "aid": invite.aid
		}
		teamathletes["teamathletes"].push(teamathlete);
	}
	//remove request from array 
	var index = invites["allInvites"].indexof(invite);
	if(index > -1) {
		invites["allInvites"].splice(index, 1);
	}
	res.redirect('home');
}

exports.viewAll = function(req, res) {
    var invites = searchForInviteByCoachEmail(req.query.team); // Still need to write this fn
    res.render('viewInvites', {
        'invites': invites
    });
}

