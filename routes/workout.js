var exercises = require("../json/exercises.json");
var workouts = require("./workouts.js");
var currWorkout = require("../json/currentWorkout.json");
var models = require('../models');

exports.goWorkout = function(req, res) {
	console.log("go workout");
	console.log("id", req.params.id);
    models.WorkoutTemplate.find({ '_id': req.params.id}).exec(afterWorkoutQuery);
    function afterWorkoutQuery(err, templateWorkouts) {
        if(err) {console.log(err); return res.send(500);}
        res.render('goWorkout', {
			'exercises': templateWorkouts[0].exercises
		});
    }
}

exports.submit = function(req, res){
	var form_data = req.body;
		console.log(form_data);

	workouts.addCompletedWorkout();
	res.send();

}

exports.save = function(req, res){
	var form_data = req.body;
	console.log(form_data);

	res.redirect('goWorkout'+parseInt(req.session.curr));

}