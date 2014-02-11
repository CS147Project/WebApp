var data = require("../data.json");


exports.create = function(req, res) { 

	sender = req.query.sender;
	receiver = req.query.receiver;
	text = req.query.text;
//SQL add to database

//where do we want to redirect?
	res.redirect('messages');
}

exports.get = function(req, res) {
	user = req.query.user;
//query database to get messages for the user
//return messages
	

	res.redirect('messages');
}