Description
====================
 My final project will be a web app where the user can play a clone of the card game Pazaak against an AI. Pazaak is a card game that was in the computer game SW:KOTOR, and I think it would be fun to make my web app based off of it. Pazaak is a betting game, so there will be a user database that stores the user's virtual credits as well as automatically saving any game in progress. Users will be able to purchase new cards with their credits to bolster their decks (but they will not be able to sell their cards because the shop owner has terrible customer service).

Requirements
====================
var userSchema = new mongoose.Schema({
  username:  String,
  password: String,
  credits:   Number,
  wins: Number,
  games: Number
});
Ex: {username: "Einstein", password: "iamthebest", credits: 20000}

userSchema is a collection that will store a user's credentials, their credits, and their win count/ratio.

var deckSchema = new mongoose.Schema({
  username:  String,
  deck: [{mag: 1, color: 'purple'},{mag: 3, color: 'red}]
});

deckSchema is a collection that will store the cards in a user's deck.

var shopSchema = new mongoose.Schema({
  mag: Number,
  color: String,
  price: Number,
  stock: Number
});

shopSchema is a collection that stores the inventory of the card shop. This shop will refresh its inventory every 24 hours.

var gameSchema = new mongoose.Schema({});

gameSchema is a collection that will be linked to userSchema. gameSchema will store the information of the current game for each user (once I figure out how to do that).


Wireframes
====================
Index Screen:
![Index Before Login](/documentation/index1.png?raw=true "Index before Login")

Index Screen after Login:
![Index After Login](/documentation/index2.png?raw=true "Index after Login")

Play Screen:
![Play](/documentation/play.png?raw=true "Play")

Shop Screen:
![Shop](/documentation/shop.png?raw=true "Shop")

How to Play Screen:
![How To Play](/documentation/how2play.png?raw=true "How to Play")

High Score Screen:
![High Scores](/documentation/highscores.png?raw=true "High Scores")


Site Map
====================
![Site Map](/documentation/sitemap.png?raw=true "Site Map")

User Stories
====================
As a first-time user, I want to be able to create a profile so that I can save my credits and game progress for later.

As a returning user, I want to be able to log in so that I can retrieve my credits and load my last game.

As a user, I want to be able to play a game of Pazaak so that I can increase the number of my credits.

As a user, I want to be able to see a high score list of the users with the highest number of credits so that I can see my ranking.

As a user, I want to be able to see a high score list of the users with the highest number of wins so that I can see my ranking.

As a user, I want to be able to see a high score list of the users with the highest ratio of wins so that I can see my ranking.

As a user, I want to be able to purchase additional cards with my credits so that I can increase my likelihood of winning.

As a user, I want to be at the top of the high score list so that I can receive rewards.

Research Topics
====================
Integrate user authentication.
Model View Controller.
Unit Testing.

User aunthentication is self-explanatory. I would use user authentication as it would be central to saving user information of credits, cards, wins, etc. 

Model View Controller is a way of organizing a project into three parts: the model, which contains the core logic, the view, which is what is displayed to the user, and the controller, which accepts user input and relays that to the model. I would use the MVC paradigm as the model would handle all of the game logic to present a nice and simple view, and the controller could be relatively simple.

Unit Testing is a way of testing individual units or small sections of the code. This would work nicely with the MVC model as I could use unit testing to test the three different parts. Additionaly, using unit testing would help me to get the game logic part up and running without worrying about the other parts.

