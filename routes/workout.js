var exercises = require("../json/exercises.json");

exports.start = function(req, res) { 
    res.render('startWorkout', exercises);
}

exports.goWorkout = function(req, res) {
	var exID = parseInt(req.params.id);
	var exercise = null;
	console.log(exID);
	console.log(exercises)
	if(exercises["exercises"][exID] != null){
		exercise = exercises["exercises"][exID];
		console.log(exercise);
	}else{
		console.log("overgrown error");
	}
		
	res.render('goWorkout', exercise);
}