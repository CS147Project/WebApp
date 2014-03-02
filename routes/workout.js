var exercises = require("../json/exercises.json");
var workouts = require("./workouts.js");
var currWorkout = require("../json/currentWorkout.json");
var models = require('../models');

exports.start = function(req, res) { 
	currWorkout["exercises"] = exercises["exercises"];
	req.session.wid = req.query.id;
    res.render('startWorkout', exercises);
}

exports.goWorkout = function(req, res) {
	var wid = req.params.id;
	models.WorkoutTemplate.find({ "_id" : wid});
	console.log("go workout");
	res.render('goWorkout', {
		'exercises': exercises['exercises']
	});
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

exports.next = function(req, res){
	var nextIndex = parseInt(req.session.curr)+1;
	var nextURL = 'goWorkout' + nextIndex;
	res.redirect(nextURL);

}
exports.previous = function(req, res){
	var prevIndex = parseInt(req.session.curr)-1;
	var prevURL = 'goWorkout' + prevIndex;
	res.redirect(prevURL);
}