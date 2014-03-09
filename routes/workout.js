
var exercises = require("../json/exercises.json");
var workouts = require("./workouts.js");
var currWorkout = require("../json/currentWorkout.json");
var models = require('../models');

exports.start = function(req, res) {  // Doesn't seem to be used anywhere
currWorkout["exercises"] = exercises["exercises"];
req.session.wid = req.query.id;
res.render('startWorkout', exercises);
}

exports.goWorkout = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	console.log("go workout");
	console.log("id", req.params.id);
	var wid= req.params.id;
	if(req.params.id == 0) { // No workout designated
		res.redirect('workouts');
	} else {
		models.WorkoutTemplate.find({ '_id': req.params.id}).exec(afterWorkoutQuery);
		function afterWorkoutQuery(err, templateWorkouts) {
			if(err) {console.log(err); return res.send(500);}
			for(exercise in templateWorkouts[0].exercises) {
				if(templateWorkouts[0].exercises[exercise].sets == 0) {
					templateWorkouts[0].exercises[exercise].sets = undefined;
				}
				if(templateWorkouts[0].exercises[exercise].reps == 0) {
					templateWorkouts[0].exercises[exercise].reps = undefined;
				}
			}
			console.log("workout", templateWorkouts[0]);
			console.log("exercises", templateWorkouts[0].exercises);
			res.render('goWorkout', {
				'workout': templateWorkouts[0],
				'exercises': templateWorkouts[0].exercises
			});
		}
	}
}

exports.submit = function(req, res){
	var form_data = req.body;
	console.log(form_data);

	workouts.addCompletedWorkout();
//	res.redirect('workoutdone');
res.send();

}

exports.done = function(req, res) {
	res.render('workoutdone');
}

exports.save = function(req, res){
	var form_data = req.body;
	console.log(form_data);

	res.redirect('goWorkout'+parseInt(req.session.curr));

}
