var data = require("../json/users.json");
var teamCoachData = require("../json/teamCoaches.json");
var athletes = require("../json/athletes.json");

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
    if(req.session.email !== undefined) {
        res.render('home', {
            'athlete': isAthlete(req.session.email),
            'teams': findTeamsForCoach(req.session.email)
        });
    } else {
	   res.redirect('login');
    }
};
