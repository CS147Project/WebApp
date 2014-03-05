var data = require("../json/users.json");
var messages = require("../json/messages.json");
var exercises = require("../json/exercises.json");
var workouts = require("../json/workouts.json");
var assignedworkout = require("../json/assignedworkout.json");
var completedworkouts = require("../json/completedworkouts.json")
var team = require("../json/teamathletes.json");
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
    			console.log("pushing workout");
    			myWorkouts.push(completedworkouts["completedWorkouts"][cw]);
    		}
    	}
        res.render('analytics', {
            'completedworkouts': myWorkouts
        });
    }
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
    // console.log("session id", req.session._id);
    // console.log("session email", req.session.email);
    // console.log("exercises", newWorkout.exercises);

    newWorkout.save(afterSaving);

    function afterSaving(err) {
        if(err) {console.log(err); return res.send(500);}
        res.redirect('workouts');
    }
}

exports.assign = function(req, res){
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    models.User.find({'_id': req.session._id}).exec(afterIsCoachQuery);
    function afterIsCoachQuery(err, coach) {
        if(err) {console.log(err); return res.send(500);}
        if(coach[0].isCoach) {
            console.log("Is a Coach.");
        } else {
            res.render('assign', {
                'msg': 'You need to be a coach to assign workouts. Go to the team page to add a team.'
            });
            return;
        }
    }

    models.WorkoutTemplate.find({ 'creatorid': req.session._id}).sort({'created': -1}).exec(afterWorkoutQuery);
    function afterWorkoutQuery(err, templateWorkouts) {
        if(err) {console.log(err); return res.send(500);}
        models.TeamCoach.find({'cid': req.session._id}).exec(afterTeamQuery);
    
        function afterTeamQuery(err, teamsForCoach) {
            if(err) {console.log(err); return res.send(500);}
            var athletes = [];
            for(team in teamsForCoach) {
                models.TeamAthlete.find({'tid': teamsForCoach[team]['tid']}).exec(afterAthleteQuery);
                function afterAthleteQuery(err, athletesForCoach) {
                    if(err) {console.log(err); return res.send(500);}
                    athletes.push(athletesForCoach);
                }
            }
            res.render('assign', {
                'workouts': templateWorkouts,
                'players': athletes
            });
            return;
        }
    }
}

exports.view = function(req, res){
    console.log(req.session.email);
    if(req.session._id == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    models.WorkoutTemplate.find({'creatorid': req.session._id}).sort({'created': -1}).exec(afterQuery);
	function afterQuery(err, templateWorkouts) {
        if(err) console.log(err);
        res.render('workouts', {
            "userWorkouts": templateWorkouts
        });    
    }
}


exports.addCompletedWorkout = function(req, res) {  
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    console.log("Body", req.body);
    var form_data = req.body;
    var numExercises = form_data.numExercises;
    var newWorkout = new models.WorkoutTemplate({
        "finisherid": req.session._id,
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
    // console.log("session id", req.session._id);
    // console.log("session email", req.session.email);
    // console.log("exercises", newWorkout.exercises);

    newWorkout.save(afterSaving);

    function afterSaving(err) {
        if(err) {console.log(err); return res.send(500);}
        // res.render('workouts', {
        //     "msg" : "Workout Completed!"
        // });

        res.redirect('workoutdone');
    }

}
