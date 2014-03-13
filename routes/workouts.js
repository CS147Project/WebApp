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
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
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
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
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
        if(form_data["excersiseName"+i] !== '' && form_data["excersiseName"+i] !== undefined) {
            if(form_data["excersiseRecordType"+i] == "weight") {
                weight = true;
            } else if(form_data["excersiseRecordType"+i] == "distance") {
                distance = true;
            } else if(form_data["excersiseRecordType"+i] == "speed") {
                speed = true;
            } else {
                time = true;
            }
            if(form_data["excersiseSets"+i] == '') {
                form_data["excersiseSets"+i] = 0;
            }
            if(form_data["excersiseReps"+i] == '') {
                form_data["excersiseReps"+i] = 0;
            }
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
    }

    newWorkout.save(afterSaving);

    function afterSaving(err) {
        if(err) {console.log(err); return res.send(500);}
        res.redirect('workouts');
    }
}

exports.assign = function(req, res) {
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    models.User.find({'_id': req.session._id}).exec(afterIsCoachQuery);
    function afterIsCoachQuery(err, coach) {
        if(err) {console.log(err); return res.send(500);}
        if(coach[0].isCoach) {
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
        } else {
            res.redirect('workouts');
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
        if(err) {console.log(err); return res.send(500);}
        models.CompletedWorkout.find({'finisherid': req.session._id}).sort({'finished': -1}).exec(afterFindPastWorkouts);
        function afterFindPastWorkouts(err, pastWorkouts) {
            if(err) {console.log(err); return res.send(500);}
            models.User.find({'_id': req.session._id}).exec(afterFindUser);
            function afterFindUser(err, user) {
                console.log("isCoach", user[0].isCoach);
                console.log("user", user[0]);
                res.render('workouts', {
                    "isCoach": user[0].isCoach,
                    "createdWorkouts": templateWorkouts,
                    "pastWorkouts": pastWorkouts
                });
            }
        }  
    }
}

exports.addCompletedWorkout = function(req, res) {  
    console.log("adding completedWorkouts");
    if(req.session == undefined || req.session.email == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    console.log("Body", req.body);
    var exercises_data = req.body;
    models.WorkoutTemplate.find({'_id': exercises_data['workout_id']}).exec(afterFindWorkoutTemp);
    function afterFindWorkoutTemp(err, templateWorkout) {
        if(err) {console.log(err); return res.send(500);}
        var CompletedWorkout = new models.CompletedWorkout({
            "finisherid": req.session._id,
            "title": templateWorkout[0].title,
            "description": templateWorkout[0].description,
            "exercises": []
        });
        for (var i = 0; i < templateWorkout[0].exercises.length; i++) {
            if(exercises_data[templateWorkout[0].exercises[i].name]) {
                var weight = 0;
                var distance = '';
                var speed = '';
                var time = '';
                if(templateWorkout[0].exercises[i].weight) {
                    weight = exercises_data[templateWorkout[0].exercises[i].name];
                } else if(templateWorkout[0].exercises[i].distance) {
                    distance = exercises_data[templateWorkout[0].exercises[i].name];    
                } else if(templateWorkout[0].exercises[i].speed) {
                    speed = exercises_data[templateWorkout[0].exercises[i].name];    
                } else {
                    time = exercises_data[templateWorkout[0].exercises[i].name];    
                }
                var newExercise = new models.CompletedExercise({
                    "name": templateWorkout[0].exercises[i].name,
                    "sets": templateWorkout[0].exercises[i].sets,
                    "reps": templateWorkout[0].exercises[i].reps,
                    "weight": weight,
                    "distance": distance,
                    "speed": speed,
                    "time": time
                });
                CompletedWorkout.exercises.push(newExercise);
            }
        }
        CompletedWorkout.save(afterSaving);
        function afterSaving(err, newWorkout) {
            if(err) {console.log(err); return res.send(500);}
            res.redirect('workoutsummary'+newWorkout._id);
        }
    }
}
