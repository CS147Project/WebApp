var data = require("../json/users.json");
var messages = require("../json/messages.json");
var exercises = require("../json/exercises.json")
var workouts = require("../json/workouts.json")


function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getYear() + "";
	return newDate;
}

exports.create = function(req, res) { 

	var d = new Date();
	d = parseDate(d);
	var wid = workouts["templateWorkouts"].length + 1;

	workout = {
		"wid": wid,
		"creatorid": req.query.creatorid,
		"created": d
	}
	workouts["templateWorkouts"].push(workout);

}


res.redirect('home');
}