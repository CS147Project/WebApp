

var data = require("../json/users.json");
var teamCoachData = require("../json/teamcoaches.json");
var teamData = require("../json/teams.json");
var athletes = require("../json/athletes.json");
var completedWorkouts = require("../json/completedworkouts.json");
var models = require('../models');

function searchTeams(tid) {
    for(team in teamData['teams']) {
        if(teamData['teams'][team].tid == tid) return teamData['teams'][team];
    }
    return undefined;
}

function findTeamsForCoach(email) {
    var teams = [];
    for(element in teamCoachData['teamCoaches']) {
        var teamCoachElement = teamCoachData['teamCoaches'][element];
        if(teamCoachElement['cid'] == email) {
            teams.push(searchTeams(teamCoachElement['tid']));
        }
    }
    console.log(teams);
    return teams;
}

function isAthlete(email) {
    for(athlete in athletes['athletes']) {
        if(athletes['athletes'][athlete].aid == email) return true;
    }
    return false;
}




exports.view = function(req, res){
    if(req.session == undefined || req.session._id == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    models.WorkoutTemplate.find({'creatorid': req.session._id}).sort({'created': -1}).exec(afterQuery);
    
    function afterQuery(err, templateWorkouts) {
        if(err) console.log(err);
        res.render('home', {
            'athlete': isAthlete(req.session.email),
            'teams': findTeamsForCoach(req.session.email),
            'userWorkouts': templateWorkouts,
            'test': false
        });
    };
}

exports.viewGrid = function(req, res){
    if(req.session == undefined || req.session._id == undefined) {
        console.log("Please login for this page");
        return res.redirect('/');
    }
    models.WorkoutTemplate.find({'creatorid': req.session._id}).sort({'created': -1}).exec(afterQuery);
    
    function afterQuery(err, templateWorkouts) {
        if(err) console.log(err);
        if(teamWorkouts.length>0) {

        res.render('home', {
            'athlete': isAthlete(req.session.email),
            'teams': findTeamsForCoach(req.session.email),
            'userWorkouts': templateWorkouts,
            'test': true
        });
    } else {
        models.WorkoutTemplate.find().sort({'created': -1}).exec(afterQueryGeneral);
    
    function afterQueryGeneral(err, templateWorkouts2) {
        if(err) console.log(err);
        res.render('home', {
            'athlete': isAthlete(req.session.email),
            'teams': findTeamsForCoach(req.session.email),
            'userWorkouts': templateWorkouts2,
            'test': true
        });
    };
    }
    };
}
