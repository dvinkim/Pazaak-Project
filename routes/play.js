var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Deck = mongoose.model('Deck');

router.get('/', function(req, res) {
  res.render('play');
});

router.get('/api/deck', function(req, res) {
	if(req.user!==undefined) {
		Deck.findOne({username:req.user.username},'-_id -username -__v',function(err,userInfo) {
			res.json(userInfo);
		});
	} else {
		res.redirect('/play');
	}
});

router.post('/api/game/', function(req, res) {
	if(req.user!==undefined) {
		if(req.body.gameStarted) {
			var newPerson;
			User.findOne({username: req.user.username },function(err, userInfo) {
				newPerson = new User({
					username:userInfo.username,
					_id:userInfo._id,
					__v:userInfo.__v,
					salt:userInfo.salt,
					hash:userInfo.hash,
					credits:userInfo.credits,
					wins:userInfo.wins,
					games:userInfo.games+1
				});
				User.remove({username:newPerson.username},function(err,re){});
				newPerson.save(function(saveErr, saveUser) {
					if(saveErr) {
						console.log("ERROR!",saveErr);
					}
				});
			});
		} else if(req.body.gameWon) {
			var newPerson;
			User.findOne({username: req.user.username },function(err, userInfo) {
				newPerson = new User({
					username:userInfo.username,
					_id:userInfo._id,
					__v:userInfo.__v,
					salt:userInfo.salt,
					hash:userInfo.hash,
					credits:userInfo.credits+100,
					wins:userInfo.wins+1,
					games:userInfo.games
				});
				User.remove({username:newPerson.username},function(err,re){});
				newPerson.save(function(saveErr, saveUser) {
					if(saveErr) {
						console.log("ERROR!",saveErr);
					}
				});
			});
		} else if(req.body.gameLost) {
			var newPerson;
			User.findOne({username: req.user.username },function(err, userInfo) {
				newPerson = new User({
					username:userInfo.username,
					_id:userInfo._id,
					__v:userInfo.__v,
					salt:userInfo.salt,
					hash:userInfo.hash,
					credits:(userInfo.credits>100?userInfo.credits-100:0),
					wins:userInfo.wins,
					games:userInfo.games
				});
				User.remove({username:newPerson.username},function(err,re){});
				newPerson.save(function(saveErr, saveUser) {
					if(saveErr) {
						console.log("ERROR!",saveErr);
					}
				});
			});
		}
	}
});

module.exports = router;
