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
	console.log("go workout");
	console.log("id", req.params.id);
	var wid= req.params.id;
	if(req.params.id==0) {
		models.WorkoutTemplate
		.find()
		.exec(afterQuery);
		function afterQuery(err, templates) {
			if(templates!=null && templates.length>0) {
				wid= templates[0]._id;
			}

		models.WorkoutTemplate.find({ '_id': wid}).exec(afterWorkoutQuery);
		function afterWorkoutQuery(err, templateWorkouts) {
			if(err) {console.log(err); return res.send(500);}
			res.render('goWorkout', {
				'workout': templateWorkouts[0],
				'exercises': templateWorkouts[0].exercises
			});
}

		}
	}
	else {


		models.WorkoutTemplate.find({ '_id': req.params.id}).exec(afterWorkoutQuery);
		function afterWorkoutQuery(err, templateWorkouts) {
			if(err) {console.log(err); return res.send(500);}
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

exports.save = function(req, res){
	var form_data = req.body;
	console.log(form_data);

	res.redirect('goWorkout'+parseInt(req.session.curr));

}
