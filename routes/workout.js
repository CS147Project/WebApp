var exercises = require("../json/exercises.json");
var workouts = require("./workouts.js");
var currWorkout = require("../json/currentWorkout.json");
var models = require('../models');

exports.start = function(req, res) {  // Doesn't seem to be used anywhere
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }

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

exports.goWorkout_alt = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	console.log("go workout alt");
	console.log("id", req.params.id);
    models.WorkoutTemplate.find({ '_id': req.params.id}).exec(afterWorkoutQuery);
    function afterWorkoutQuery(err, templateWorkouts) {
        if(err) {console.log(err); return res.send(500);}
        res.render('goWorkout_alt', {
        	'workout': templateWorkouts[0],
			'exercises': templateWorkouts[0].exercises
		});
    }
}

exports.submit = function(req, res){
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    console.log("Body", req.body);
    var form_data = req.body;
    var numExercises = form_data.numExercises;
    var newWorkout = new models.WorkoutTemplate({
        "creatorid": req.session._id,
        "title": form_data.title,
        "description": form_data.description,
        "exercises": []
    });
    for (var i = 1; i <= numExercises; i++) {
        var weight = false;
        var distance = false;
        var speed = false;
        var time = false;
        if(form_data["excersiseRecordType"+i] == "weight") {
            weight = true;
        } else if(form_data["excersiseRecordType"+i] == "distance") {
            distance = true;
        } else if(form_data["excersiseRecordType"+i] == "speed") {
            speed = true;
        } else {
            time = true;
        }
        console.log("name", form_data["excersiseName"+i]);
        var newExercise = new models.ExerciseTemplate({
            "name": form_data["excersiseName"+i],
            "sets": parseInt(form_data["excersiseSets"+i]),
            "reps": parseInt(form_data["excersiseReps"+i]),
            "weight": weight,
            "distance": distance,
            "speed": speed,
            "time": time
        });
        newWorkout.exercises.push(newExercise);
    }
    console.log("session id", req.session._id);
    console.log("session email", req.session.email);
    console.log("exercises", newWorkout.exercises);

    newWorkout.save(afterSaving);

    function afterSaving(err) {
        if(err) {console.log(err); return res.send(500);}
        res.redirect('workouts');
    }
}

exports.summary = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    models.CompletedWorkout.find({'_id': req.session.lastWorkout}).exec(afterFindWorkout);
    function afterFindWorkout(err, workout) {
        if(err) {console.log(err); return res.send(500);}
        for(exercise in workout[0].exercises) {
            if(workout[0].exercises[exercise].sets == 0) {
                workout[0].exercises[exercise].sets = undefined;
            }
            if(workout[0].exercises[exercise].reps == 0) {
                workout[0].exercises[exercise].reps = undefined;
            }
        }
        console.log("workout", workout[0]);
        console.log("exercises", workout[0].exercises);
        res.render('workoutsummary', {
            'workout': workout[0],
            'exercises': workout[0].exercises
        });
    }
}

exports.save = function(req, res){
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
	var form_data = req.body;
	console.log(form_data);

	res.redirect('goWorkout'+parseInt(req.session.curr));

}
