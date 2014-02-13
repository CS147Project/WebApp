var data = require("../json/users.json");
var messages = require("../json/messages.json");

function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getYear() + "";
	return newDate;
}

exports.create = function(req, res) { 
	var d = new Date();
	d = parseDate(d);
	
	newMessage = {
		"mid": 3,
		"text": req.query.cid,
		"datetime": d,
		"fromid": req.session.email,
		"toid": req.query.toid
	}

	console.log("m leng: " + messages["messages"].length);

	console.log("messages: " + messages["messages"]);
	messages["messages"].push(newMessage);
	console.log("all messages: "+ messages["messages"]);
	
	console.log("m leng: " + messages["messages"].length);

	res.redirect('home');
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
	res.render('messages', {
		'messages': userMessages
	});
}
