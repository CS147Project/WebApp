var data = require("../json/users.json");
var messages = require("../json/messages.json");

function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getYear() + "";
	return newDate;
}

exports.create = function(req, res) { 
	var mid = 1;
	var d = new Date();
	d = parseDate(d);
	//HOW DO WE CALC IID?
	
	newMessage = {
		"mid": 1,
		"text": req.query.cid,
		"datetime": d,
		"fromid": req.query.fromid,
		"toid": req.query.toid

	}

	console.log("m leng: " + messages["messages"].length);

	console.log("messages: " + messages["messages"]);
	messages["messages"].push(newMessage);
	console.log("all messages: "+ messages["messages"]);
	
	console.log("m leng: " + messages["messages"].length);

	res.redirect('home');
}

//not sure how to return array. Does one need to be passed in?
exports.get = function(req, res) {
	uid = req.query.uid;
	var array = [];
	for(message in messages["messages"]) {
		if(message.fromid== uid || message.toid==uid) {
			array.append(message);
		}
	}
	return array;


res.redirect('home');
}
