var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.get('/', function(req, res) {
  res.render('highscores');
});

router.get('/api', function(req, res) {
	User.find({},'-_id username games wins credits',function(err,userList) {
		res.json(userList);
	});
});

module.exports = router;
