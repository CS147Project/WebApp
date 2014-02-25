var data = require("../json/users.json");
var messages = require("../json/messages.json");
var exercises = require("../json/exercises.json");
var workouts = require("../json/workouts.json");
var assignedworkout = require("../json/assignedworkout.json");
var completedworkouts = require("../json/completedworkouts.json")

var models = require('../models');


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

exports.start = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	res.render('createWorkout');
}



exports.create = function(req, res) { 
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    console.log("Body", req.body);
    var form_data = req.body;
    var numExercises = form_data.numExercises;
    var exercises = [];

    for (var i = 0; i < numExercises; i++) {
        var weight = 0;
        var distance = 0;
        var speed = 0;
        var time = 0;
        if(form_data["excersiseRecordType"+i] == "weight") {
            weight = 1;
        } else if(form_data["excersiseRecordType"+i] == "distance") {
            distance = 1;
        } else if(form_data["excersiseRecordType"+i] == "speed") {
            speed = 1;
        } else {
            time = 1;
        }

        var newExercise = new models.WorkoutTemplate({
            "name": form_data["excersiseName"+i],
            "set": form_data["excersiseSets"+i],
            "rep": form_data["excersiseReps"+i],
            "weight": weight,
            "distance": distance,
            "speed": speed,
            "time": time
        });
        exercises.push(newExercise);
    }

    var newWorkout = new models.WorkoutTemplate({
        "creatorid": req.session.email,
        "title": form_data.title,
        "description": form_data.description,
        "exercises": exercises
    });

    newWorkout.save(afterSaving);

    function afterSaving(err) {
        if(err) {console.log(err); res.send(500);}
        res.redirect('workouts');
    }
}

exports.view = function(req, res){
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    console.log(req.session.email);
    var templateWorkouts = models.WorkoutTemplate.find().exec(afterQuery);
	console.log(templateWorkouts);
	function afterQuery(err, projects) {
        if(err) console.log(err);
        res.render('workouts', {
            "templateWorkouts": templateWorkouts
        });    
    }
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

