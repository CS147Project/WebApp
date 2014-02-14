var data = require("../json/users.json");
var messages = require("../json/messages.json");

function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + "";
	return newDate;
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
