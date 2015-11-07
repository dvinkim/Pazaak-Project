var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Game = mongoose.model('Game');
var Deck = mongoose.model('Deck');

/* GET register page. */
router.get('/', function(req, res) {
        res.render('register');
});

/* POST register page */
router.post('/', function(req, res) {
        User.register(new User({username:req.body.username}),
        req.body.password, function(err, user){
	        if (err) {
		        res.render('register',{message:'Invalid username or password!'});
	        } else {
		        passport.authenticate('local')(req, res, function() {
				var newDeck = new Deck({
					username: req.body.username,
					deck: ['B1','B2','B3','B4','B5','B6']
				});
				newDeck.save(function(err, deck, count) {});
				var newGame = new Game({
					username: req.body.username,
					current: false
				});
				newGame.save(function(err, game, count) {});
			        res.redirect('/');
		        });
	        }
        });
});   

module.exports = router;
