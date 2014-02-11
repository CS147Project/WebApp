var data = require("../data.json");


exports.sendRequest = function(req, res) { 

	coachEmail = req.query.coachEmail;
	team = req.query.team;
	playerEmail = req.query.playerEmail;
	//SQL add request to database (if not 
		//current player and no outstanding request for this team)

//where do we want to redirect?
	res.redirect('home');
}

exports.respondRequest = function(req, res) {
	coachEmail = req.query.coachEmail;
	team = req.query.team;
	playerEmail = req.query.playerEmail;
	response = req.query.response;
	if(response==true) {
		//add to team
	}
	else if (response == false) {
		//delete request
	}

	res.redirect('home');
}