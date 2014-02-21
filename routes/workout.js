var exercises = require("../json/exercises.json");

exports.start = function(req, res) { 
    res.render('startWorkout', exercises);
}

exports.goWorkout = function(req, res) {
	var exID = parseInt(req.params.id);
	var exercise = null;
	if(exercises["exercises"][exID] != null){
		exercise = exercises["exercises"][exID];
		console.log(exercise);
	}else{
		res.render('home');
	}
	req.session.curr = exID;

	res.render('goWorkout', exercise);
}

exports.save = function(req, res){
	
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