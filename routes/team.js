var data = require("../data.json");
var teamathletes = require("../json/teamathletes.json");
var invites = require("../json/invites.json");


function onRoster(tid, aid) {
    for (var athlete in teamathletes[teamathletes]) {
        if (athlete.tid == tid && athlete.aid==aid) {
            return true;
        }
    }
    return false;
}

function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getYear() + "";
	return newDate;
}

exports.sendRequest = function(req, res) { 

	cid = req.query.cid;
	tid = req.query.tid;
	aid = req.query.aid;
	var d = new Date();
	d = parseDate(d);
	//HOW DO WE CALC IID?
	if(!onRoster(tid, aid)) {
		newInvite = {
			"iid": 1,
            "aid": aid,
            "tid": tid,
            "datetime": d
        
    }

//console.log("size invites: " + invites["allInvites"].size);

    for(var invite in invites["allInvites"]) {
    	console.log("one: " + invite.aid);
    }



    	console.log("invites: " + invites);
		invites['allInvites'].push(newInvite);

console.log("size2 invites: " + invites['allInvites'].length);
		console.log("all invites: "+ invites);
}
//where do we want to redirect?
	res.redirect('home');
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
	var index = invites[invites].indexof(invite);
	if(index > -1) {
		invites[invites].splice(index, 1);
	}
	res.redirect('home');
}
