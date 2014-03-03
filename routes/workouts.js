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
    console.log("session id", req.session._id);
    console.log("session email", req.session.email);
    var newWorkout = new models.WorkoutTemplate({
        "creatorid": req.session._id,
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

exports.assign = function(req, res){
    models.User.find({'_id': req.session.email}).exec(afterIsCoachQuery);
    function afterIsCoachQuery(err, coach) {
        if(coach.isCoach) {
            console.log("Is a Coach.");
        } else {
            res.render('assign', {
                'msg': 'You need to be a coach to assign workouts. Go to the team page to add a team.'
            });
            return;
        }
    }

    models.WorkoutTemplate.find({ 'creatorid': req.session.email}).sort({'created': -1}).exec(afterWorkoutQuery);
    function afterWorkoutQuery(err, templateWorkouts) {
        if(err) console.log(err);
        models.TeamCoach.find({'cid': req.session.email}).exec(afterTeamQuery);
    
        function afterTeamQuery(err, teamsForCoach) {
            if(err) console.log(err);
            var athletes = [];
            for(team in teamsForCoach) {
                models.TeamAthlete.find({'tid': teamsForCoach[team]['tid']}).exec(afterAthleteQuery);
                function afterAthleteQuery(err, athletesForCoach) {
                    if(err) console.log(err);
                    athletes.push(athletesForCoach);
                }
            }
            res.render('assign', {
                'workouts': templateWorkouts,
                'players': athletes
            });
        }
    }



    res.render('assign', {
        'workouts': workouts['templateWorkouts'],
        'players': team['teamathletes']
    });
}

exports.view = function(req, res){
    console.log(req.session);
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
    res.redirect('workouts', {
        "msg" : "Workout Completed!"
    });
}
