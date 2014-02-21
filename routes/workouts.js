var data = require("../json/users.json");
var messages = require("../json/messages.json");
var exercises = require("../json/exercises.json");
var workouts = require("../json/workouts.json");
var assignedworkout = require("../json/assignedworkout.json");
var completedworkouts = require("../json/completedworkouts.json")


function parseDate(d) {
	var newDate = "" + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + "";
	return newDate;
}
exports.analytics = function(req, res) { 
    if(req.session !== undefined && req.session.email !== undefined) {
    	var completedWorkouts = completedworkouts["completedWorkouts"];
    	var myWorkouts = [];
    	for(cw in completedworkouts["completedWorkouts"]) {
    		if(completedworkouts["completedWorkouts"][cw].aid == req.session.email) {
    			console.log("pushign workout");
    			myWorkouts.push(completedworkouts["completedWorkouts"][cw]);
    		}
    	}


        res.render('analytics', {'completedworkouts': myWorkouts});
    }
    // else {
    // 	res.render('home', {layout: false});
    // }
 }

//returns a collection of exercises, given a workout id
exports.getExercises = function(req, res) {
	var wid = req.query.wid;
	var theseExercises = [];
	for(exc in exercises["exercises"]) {
		if(exercises["exercises"][exc].wid == wid) {
			theseExercises.push(exercises["exercises"][exc]);
		}
	}
	res.json(theseExercises);
}

//returns id's of all workouts
exports.getAll = function(req, res) {
	res.json(workouts["templateWorkouts"]);
}

 exports.getUserWorkouts = function(req, res) {
	var aid = req.query.aid;
	var userWorkouts = [];

	for(aw in assignedworkout["assignedWorkout"]) {
		if(assignedworkout["assignedWorkout"][aw].assignedId==aid) {
			userWorkouts.push(assignedworkout["assignedWorkout"][aw].wid);
		}
	}
	res.json(userWorkouts);
}

exports.assignWorkout = function(req, res) {
	console.log("in assigned oworksout");
	var wid = req.query.wid;
	var assignedId = req.query.assignedId;
	var d = new Date();
	d = parseDate(d);

	var aw = {
		"wid": wid,
		"assignedId": assignedId,
		"datetime": d
	};

	assignedworkout["assignedWorkout"].push(aw);

	res.redirect('home');

}

//expects exercises w/o a workout id.
exports.create = function(req, res) { 

	var d = new Date();
	d = parseDate(d);

	// var theseExercises= [
	// {
	// 	"wid": 1,
	// 	"eid": 1,
	// 	"name": "Bench Press2",
	// 	"weight": -1,
	// 	"set": -1,
	// 	"rep": -1,
	// 	"distance": -1,
	// 	"time": -1


	// },  {
	// 	"wid": 1,
	// 	"eid": 2,
	// 	"name": "Mile Run2",
	// 	"weight": -1,
	// 	"set": -1,
	// 	"rep": -1,
	// 	"distance": -1,
	// 	"time": 1
	// }

	// ];





	var wid = workouts["templateWorkouts"].length + 1;
	var theseExercises = req.query.exercises;

	//not sure about this loop.
	for(exc in theseExercises) {
		theseExercises[exc].wid=wid;
		exercises["exercises"].push(theseExercises[exc]);
	}

	console.log("all exercises siae: " + exercises["exercises"].length);
	console.log("all exercises: " + exercises["exercises"]);
	console.log("num workouts: " + workouts["templateWorkouts"].length);

	workout = {
		"wid": wid,
		"creatorid": req.session.email,
		"created": d
	}

	workouts["templateWorkouts"].push(workout);
	console.log("num workouts: " + workouts["templateWorkouts"].length);

	res.redirect('home');
}

exports.addCompletedWorkout = function(req, res) {  
	var d = new Date();
	d = parseDate(d);

	for(w in completedworkouts["completedWorkouts"]) {
		console.log(completedworkouts["completedWorkouts"][w].aid + ": did workouts # " + completedworkouts["completedWorkouts"][w].wid);

	}

	var completedW = {
		"wid": req.query.wid,
		"aid": req.session.email,
		"datetime": d
	};
	completedworkouts["completedWorkouts"].push(completedW);

	for(w in completedworkouts["completedWorkouts"]) {
		console.log(completedworkouts["completedWorkouts"][w].aid + ": did workouts # " + completedworkouts["completedWorkouts"][w].wid);

	 }
	res.redirect('home');
}

exports.view = function(req, res){
	res.render('workouts', workouts);
}