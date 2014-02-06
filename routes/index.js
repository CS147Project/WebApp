// Get all of our friend data
var data = require('../data.json');
console.log(data);
exports.view = function(req, res){
	res.render('index', {
        'friends': data['friends']
    });
};
