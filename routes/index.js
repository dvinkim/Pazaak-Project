var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { user: req.user });
});

router.get('/index', function(req, res) {
	res.redirect('/');
});

router.get('/main', function(req, res) {
	res.redirect('/');
});

module.exports = router;
