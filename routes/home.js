exports.view = function(req, res){
    if(req.session.email !== undefined) {
        res.render('home')
    } else {
	   res.redirect('login');
    }
};
