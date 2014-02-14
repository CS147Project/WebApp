var exercises = require('../exercises.json');

exports.start = function(req, res) { 
    res.json(exercises);
}

