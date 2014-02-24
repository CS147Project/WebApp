var data = require("../json/users.json");
var messages = require("../json/messages.json");
var invites = require("../json/invites.json");
var teamathletes = require("../json/teamathletes.json");
var teamcoaches = require("../json/teamcoaches.json");
var users = require("../json/users.json");
var coaches = require("../json/coaches.json");


function isCoach(email) {
	for(coach in coaches["coaches"]) {
		if(coaches["coaches"][coach].cid == email) {
			return true;
		}
	}
	return false;
}


function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + "";
	return newDate;
}

function getFullNameByEmail(email) {
	for(user in users["users"]) {
		if(users["users"][user].email == email) {
			return users["users"][user].firstName + " " + users["users"][user].lastName;
		}
	}

}

exports.findTeamsForCoach = function(email) {
	var teams = [];
	for(element in teamcoaches['teamCoaches']) {
		var teamCoachElement = teamcoaches['teamCoaches'][element];
		if(teamCoachElement['cid'] == email) {
			teams.push(teamcoaches['teamCoaches'][element].tid);
		}
	}
	console.log(teams);
	return teams;
}

function findTeamsForCoach(email) {
	var teams = [];
	for(element in teamcoaches['teamCoaches']) {
		var teamCoachElement = teamcoaches['teamCoaches'][element];
		if(teamCoachElement['cid'] == email) {
			teams.push(teamcoaches['teamCoaches'][element].tid);
		}
	}
	console.log(teams);
	return teams;
}

function getPlayersByTeams(teams) {
	var players = [];
	for(athlete in teamathletes["teamathletes"]) {
		for(var i=0; i<teams.length; i++)
		if(teamathletes["teamathletes"][athlete].tid== teams[i]) {
			var onePlayer = {
					name: getFullNameByEmail(teamathletes["teamathletes"][athlete].aid),
					uid: teamathletes["teamathletes"][athlete].aid
				};
				players.push(onePlayer);
		} 
	}
	return players;
}

//should delete later and access from team.js
function getTeamsByUser(email) {
	var teams = [];
	for(athlete in teamathletes["teamathletes"]) {
		if(teamathletes["teamathletes"][athlete].aid==email) {
			teams.push(teamathletes["teamathletes"][athlete].tid);
			console.log("add team id: "+ teamathletes["teamathletes"][athlete].tid);
		}
	}
	console.log("teams at 0: "+ teams[0]);
	return teams;
}
function getCoachesByTeams(teams) {
	var coaches = [];
	for(teamCoach in teamcoaches["teamCoaches"]) {
		for(var i =0; i< teams.length; i++) {
			if(teams[i] == teamcoaches["teamCoaches"][teamCoach].tid) {

				var oneCoach = {
					name: getFullNameByEmail(teamcoaches["teamCoaches"][teamCoach].cid),
					aid: teamcoaches["teamCoaches"][teamCoach].cid
				};
				coaches.push(oneCoach);
			}
		}


		
	}
	return coaches;
}

exports.create = function(req, res) {

	var d = new Date();
	d = parseDate(d);
	console.log("from: "+ req.query.fromid + " to: " + req.query.toid + " text: " + req.query.text);
	//HOW DO WE CALC IID?
	var mid = messages["messages"].length + 1;

	newMessage = {
		"mid": mid,
		"text": req.query.text,
		"datetime": d,
		"fromid": req.session.email,
		"toid": req.query.toid
	}

	console.log("m leng: " + messages["messages"].length);
	console.log("messages: " + messages["messages"]);

	messages["messages"].push(newMessage);
	console.log("all messages: "+ messages["messages"]);
	console.log("m leng: " + messages["messages"].length);

	res.redirect('messages');
}

exports.get = function(req, res) {
	uid = req.session.email;
	var userMessages = [];
	for(message in messages["messages"]) {
		var curMessage = messages["messages"][message]
		console.log(curMessage);
		if(curMessage.fromid == uid || curMessage.toid == uid) {
			userMessages.push(curMessage);
		}
	}	
	var teams = [];
	var friends = [];
	if(!isCoach(uid)) {
		
		teams=getTeamsByUser(uid);
		if(teams.length>0) {
			console.log(" teams length: " + teams.length + " team 1 id: "+ teams[0]);
		}
		else {
			console.log(" no teams!!!");
		}
		 friends = getCoachesByTeams(teams);
	}
	else {
		console.log("is coache!!!!");
		teams = findTeamsForCoach(uid);
		 friends = getPlayersByTeams(teams);

	}


	res.render('messages', {
		'messages': userMessages, 'friends': friends
	});
}

 
