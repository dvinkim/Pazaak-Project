var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');


router.get('/', function(req, res) {
	res.render('login', { title: 'Pazaak', user: req.user });
});

router.post('/', function(req,res,next) {
	passport.authenticate('local', function(err,user) {
		if(user) {
			req.logIn(user, function(err) {
				res.redirect('/');
			});
		} else {
			res.render('login', {title: 'Pazaak', message:'Sorry, username or password was incorrect.'});
		}
	})(req, res, next);
});

module.exports = router;
