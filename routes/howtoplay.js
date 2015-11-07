var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('howtoplay', { title: 'How To Play' });
});

module.exports = router;
