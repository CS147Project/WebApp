exports.view = function(req, res){
    if(res.session.email !== undefined) {
        res.render('home')
    } else {
	   res.redirect('/');
    }
};
