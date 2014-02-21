var exercises = require("../json/exercises.json");
var workouts = require("./workouts.js");
var currWorkout = require("../json/currentWorkout.json");

exports.start = function(req, res) { 
	currWorkout["exercises"] = exercises["exercises"];
	req.session.wid = req.query.id;
    res.render('startWorkout', exercises);
}

exports.goWorkout = function(req, res) {
	var exID = parseInt(req.params.id);
	var exercise = null;
	var nav = {
		'next': 'true',
		'prev': 'true'
	};
	if(exercises["exercises"][exID] != null){
		exercise = exercises["exercises"][exID];
		console.log(exercise);
	}else{
		res.render('home');
	}

	req.session.curr = exID;

	if(exercises["exercises"][exID+1] == null)
		nav['next'] = null;
	if(exercises["exercises"][exID-1] == null)
		nav['prev'] = null;

	console.log(nav);

	res.render('goWorkout', {
		'exercise': exercise,
		'nav': nav
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