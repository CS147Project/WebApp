var data = require("../json/users.json");
var messages = require("../json/messages.json");
var invites = require("../json/invites.json");
var teamathletes = require("../json/teamathletes.json");
var teamcoaches = require("../json/teamcoaches.json");
var users = require("../json/users.json");
var coaches = require("../json/coaches.json");
var models = require('../models');


function getFullNameById(id) {
	models.User.find({"_id": id}).exec(haveUserNeedName);
	
	function haveUserNeedName(err, user) {
		console.log("user results", user);
		if(err) {console.log(err); return "";}
		var fullName = user[0].firstName + " " + user[0].lastName;
		console.log("full name: "+ fullName);
		return fullName;
	}
}

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
	if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	var id = req.session._id;

	var d = new Date();
	d = parseDate(d);
	console.log("from2: "+ req.query.fromid + " to: " + req.query.to + " text: " + req.query.text);

	
	try {
		var json = req.query.to, 
		obj = JSON.parse(json);
		console.log("Parsed: obj " + obj.toName);

	// var parsedData = JSON.parse(req.query.to);
	// console.log("Parsed Data: " + parsedData);
	// 	console.log("2: "+ parsedData);
	// console.log("3: "+ parsedData["toName"]);
	// console.log("4: " + parsedData.toName);

	models.User
	.find({"_id": id})
	.exec(foundUser);

	//from messages is null -> problems when want length.
	function foundUser(err, user) {
		 if(err) {console.log(err); return res.send(500);}
		var userName = user[0].firstName;
		console.log("sender Name: "+ userName);


		var message = new models.Message( {
//note: fromid and toid need to be )id, not e-mails!!!!
		"text": req.query.text,
		"fromid": req.query.fromid,
		"toid": obj.toid,
		"toName": obj.toName,
		"fromName": userName
	})
		message.save(afterSaving);
		function afterSaving(err) {
			if(err) { console.log(err); res.send(500);};
			res.redirect('messages');
		}

	}


} catch(e)  {
	console.error("parsing error: ", e);
	res.redirect('messages');
}



	// var mid = messages["messages"].length + 1;

	// newMessage = {
	// 	"mid": mid,
	// 	"text": req.query.text,
	// 	"datetime": d,
	// 	"fromid": req.session.email,
	// 	"toid": req.query.toid
	// }

	// console.log("m leng: " + messages["messages"].length);
	// console.log("messages: " + messages["messages"]);

	// messages["messages"].push(newMessage);
	// console.log("all messages: "+ messages["messages"]);
	// console.log("m leng: " + messages["messages"].length);

	//connecting to db: 

	



	//res.redirect('messages');
}

exports.create2 = function(req, res) {
	if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	var id = req.session._id;

	var d = new Date();
	d = parseDate(d);
	console.log("from2: "+ req.query.fromid + " text: " + req.query.text);

	
	try {

	models.User
	.find({"_id": id})
	.exec(foundUser);

	//from messages is null -> problems when want length.
	function foundUser(err, user) {
		 if(err) {console.log(err); return res.send(500);}
		var message = new models.Message( {
//note: fromid and toid need to be )id, not e-mails!!!!
		"text": req.query.text,
		"fromid": req.query.fromid,
		"toid": req.query.toid,
		"toName": req.query.toName,
		"fromName": req.query.fromName
	})
		message.save(afterSaving);
		function afterSaving(err) {
			if(err) { console.log(err); res.send(500);};
			res.redirect('messages');
		}

	}


} catch(e)  {
	console.error("parsing error: ", e);
	res.redirect('messages');
}

}

exports.get = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	console.log("in messages!");
	console.log("still in messages");
	var id = req.session._id;
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
	// if(!isCoach(uid)) {
		
	// 	teams=getTeamsByUser(uid);
	// 	if(teams.length>0) {
	// 		console.log(" teams length: " + teams.length + " team 1 id: "+ teams[0]);
	// 	}
	// 	else {
	// 		console.log(" no teams!!!");
	// 	}
	// 	friends = getCoachesByTeams(teams);
	// }
	// else {
	// 	console.log("is coache!!!!");
	// 	teams = findTeamsForCoach(uid);
	// 	friends = getPlayersByTeams(teams);

	// }

	//Using DB:
	var allMessages = [];
	models.Message
	.find({"fromid": id})
	.sort('date')
	.exec(fromMessages);

	//from messages is null -> problems when want length.
	function fromMessages(err, fromMessages) {
		 if(err) {console.log(err); return res.send(500);}
		console.log("fromMessages", fromMessages);
		for(var i = 0; i < fromMessages.length; i++) {
			console.log("fromMessages", fromMessages[i].toid);
			var fullName;
			var messageToSend = {
				"toid": fromMessages[i]['toid'],
				"fromid": fromMessages[i]['fromid'],
				"text": fromMessages[i]['text'],
				"created": parseDate(fromMessages[i]['created']),
				"toName": fromMessages[i]['toName'],
				"fromName": fromMessages[i]['fromName']
				}
				allMessages.push(messageToSend);
	}
}


	models.Message
	.find({"toid": id})
	.sort('date')
	.exec(toMessages);

	//from messages is null -> problems when want length.
	function toMessages(err, fromMessages) {
		if(err) {console.log(err); return res.send(500);}
		for(var i = 0; i < fromMessages.length; i++) {
			console.log("to", fromMessages[i].toid);
			var fullName;
			var messageToSend = {
				"toid": fromMessages[i]['toid'],
				"fromid": fromMessages[i]['fromid'],
				"text": fromMessages[i]['text'],
				"created": parseDate(fromMessages[i]['created']),
				"toName": fromMessages[i]['toName'],
				"fromName": fromMessages[i]['fromName']
			}
			allMessages.push(messageToSend);
		}
	}
	var allFriends = [];
	var allTeams = [];
	models.User.find().exec(foundAllUsers);
	function foundAllUsers(err, allUsers) {
		 if(err) {console.log(err); return res.send(500);}
		console.log("found all users.");
		console.log("all users: "+ allUsers.length);
		for(var i=0; i<allUsers.length; i++) {
			allFriends.push(allUsers[i]);
		}
		console.log("all Friends num: "+ allFriends.length);
	console.log("all Messages for this user: " + allMessages.length);
	res.render('messages', {
		'messages': allMessages, 'friends': allFriends, 'userId': id
	});
	}


	// models.User.find({"_id": id}).exec(haveUser);
	// function haveUser(err, thisUser) {
	// 	if(thisUser.isCoach) {
	// 		models.TeamCoach.find({"tid": id}).exec(teamCoachList);
	// 	}
	// 	if(thisUser.isAthlete) {
	// 		models.TeamAthlete.find({"aid": id}).exec(teamPlayerList);
	// 	}
	// }


	// function teamCoachList(err, teamsForCoach) {
	// 	for(team in teamsForCoach) {
	// 		models.TeamAthlete.find({'tid': teamsForCoach[team]['tid']}).exec(afterAthleteQuery);
	// 		function afterAthleteQuery(err, athletesForCoach) {
	// 			if(err) console.log(err);
	// 			allFriends.push(athletesForCoach);
	// 		}
	// 	}
	// }

	// function teamPlayerList(err, teamsForPlayer) {
	// 	for(team in teamsForPlayer) {
	// 		models.TeamCoach.find({"tid": teamsForPlayer[team]["tid"]}).exec(afterCoachQuery);

	// 		function afterCoachQuery(err, coachesForAthlete) {
	// 			if(err) console.log(err);
	// 			allFriends.push(coachesForAthlete);
	// 		}
	// 	}
	// }

	// with database
	// console.log("all Friends num: "+ allFriends.length);
	// console.log("all Messages for this user: " + allMessages.length);
	// res.render('messages', {
	// 	'messages': allMessages, 'friends': allFriends, 'userId': id
	// });



		// res.render('messages', {
		// 	'messages': userMessages, 'friends': friends
		// });
}
