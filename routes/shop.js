var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Deck = mongoose.model('Deck');
var Shop = mongoose.model('Shop');

// setup shop
var cardList = ['B1','B2','B3','B4','B5','B6','R1','R2','R3','R4','R5','R6'];
cardList.forEach(function(cardName) {
	Shop.findOne({card:cardName},'card',function(err,meep) {
		if(meep===null) {
			var newCard = new Shop({
				card:cardName,
				stock:100,
				price:(cardName.charAt(0)==='B'?20:40)*cardName.charAt(1)+80
			});
			newCard.save(function(err,moop) { 
				console.log(moop.card,'created');
			});
		}
	});
});

/* GET home page. */
router.get('/', function(req, res) {
	res.render('shop');
	if(!!req.user) {
		console.log(req.user.username);
		console.log(req.user.credits);
	}
});
router.post('/',function(req,res) {
	res.render('shop');
});

router.get('/api', function(req, res) {
	Shop.find({},'-_id card stock price',function(err,inventory) {
		res.json(inventory);
	});
});
router.post('/api/buy', function(req, res) {
	if(req.user!==undefined) {
		var enoughMoney = false;
		var moneyPool = req.user.credits;
		var price = req.body.price;
		var cart = [];
		if(price > 0 && moneyPool - price >= 0) {
			console.log("I CAN BUY!");
			cart = req.body.cart.split(",");
			cart.forEach(function(ele) {
				console.log(ele);
			});
			enoughMoney = true;
		}
		if(enoughMoney) {
			var newPerson;
			User.findOne({username: req.user.username },function(err, userInfo) {
				newPerson = new User({
					username:userInfo.username,
					_id:userInfo._id,
					__v:userInfo.__v,
					salt:userInfo.salt,
					hash:userInfo.hash,
					credits:userInfo.credits-price,
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
			Deck.findOne({username: req.user.username },function(err, userInfo) {
				var newDeck = userInfo.deck;
				cart.forEach(function(ele) {
					newDeck.push(ele);
				});
				newPerson = new Deck({
					username:userInfo.username,
					_id:userInfo._id,
					__v:userInfo.__v,
					deck:newDeck
				});
				Deck.remove({username:newPerson.username},function(err,re){});
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
