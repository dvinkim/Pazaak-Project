var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

//schemas
var userSchema = new mongoose.Schema({
	credits: {type:Number, default:2000, min:[0, '{PATH} must be greater than {MIN}']},
	wins: {type: Number, default:0},
	games: {type: Number, default:0}
});

var deckSchema = new mongoose.Schema({
	username: String,
	deck: [String]
});

var shopSchema = new mongoose.Schema({
	card: String,
	stock: Number,
	price: Number
});

var gameSchema = new mongoose.Schema({
	username: String,
	current: {type: Boolean, default:false},
	gameBet: Number
});

//passport for userSchema
//inserts username, password, salt
userSchema.plugin(passportLocalMongoose);

//models
mongoose.model('User',userSchema);
mongoose.model('Deck',deckSchema);
mongoose.model('Shop',shopSchema);
mongoose.model('Game',gameSchema);

mongoose.connect('mongodb://localhost/pazaakdb');
