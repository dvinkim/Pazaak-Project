/* AJAX SETUP
====================================================================
*/
var req = new XMLHttpRequest(),
url = 'http://localhost:3000/play/api/deck';
req.open('GET', url, true);

req.addEventListener('load', function() {
	if (req.status >= 200 && req.status < 400){
		var data = JSON.parse(req.responseText);
		loadDeck(data.deck);
	}
});
req.addEventListener('error', function(e) {
	console.log("ERROR!",e);
});
req.send();

var reqp= new XMLHttpRequest();
var addGame = function() {
	reqp.open('POST', 'http://localhost:3000/play/api/game', true);
	reqp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	reqp.send("gameStarted=true");
};
var wonGame = function() {
	reqp.open('POST', 'http://localhost:3000/play/api/game', true);
	reqp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	reqp.send("gameWon=true");
};
var lostGame = function() {
	reqp.open('POST', 'http://localhost:3000/play/api/game', true);
	reqp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	reqp.send("gameLost=true");
};

/* GAME SETUP
====================================================================
*/
//GAME VARS
var deck = [];
var handPC = ['empty','empty','empty','empty'];
var handAI = ['empty','empty','empty','empty'];
var tablePC = [];
var tableAI = [];
var slotPC = 0;
var slotAI = 0;
var winsPC = 0;
var winsAI = 0;
var totalPC = 0;
var totalAI = 0;
var turn = 0;
var PC = true;
var AI = true;
var round = false;
var pChoice = false;
var pChoiceHand = false;
var deckPC = [];
var loggedIn = false;

//GAME FUNCTIONS
var newDeck = function() {
	deck = [];
	var setupCount = [0,0,0,0,0,0,0,0,0,0];
	for(var z=0; z<20; z++) {
		var n = Math.floor(Math.random() * 10);
		while(setupCount[n]>3) {
			n = Math.floor(Math.random() * 10);
		}
		setupCount[n]++;
		deck.push('G'+n);
	}
};
var clearTables = function() {
	for(var z=0;z<9;z++) {
		tablePC[z] = 'empty';
		tableAI[z] = 'empty';
	}
};
var dealAI = function() {
	handAI = [];
	var colors = ['B','R'];
	for(var z=0;z<4;z++) {
		var card = colors[Math.floor(Math.random()*2)]+Math.floor(Math.random()*6+1);
		handAI.push(card);
	}	
};
var loadDeck = function(d) {
	deckPC = d;
	loggedIn = true;
	console.log("DECK LOADED!");
};
var dealPC = function() {
	handPC = [];
	if(loggedIn) {
		for(var z=0;z<4;z++) {
			var rchoice = Math.floor(Math.random()*deckPC.length);
			handPC.push(deckPC[rchoice]);
		}
	} else {
		var colors = ['B','R'];
		for(var z=0;z<4;z++) {
			var card = colors[Math.floor(Math.random()*2)]+Math.floor(Math.random()*6+1);
			handPC.push(card);
		}
	}
};
var newRound = function() {
	newDeck();
	clearTables();
	slotPC = 0;
	slotAI = 0;
	totalPC = 0;
	totalAI = 0;
	PC = true;
	AI = true;
	round = false;
	pChoice = false;
	pChoiceHand = false;
	drawScreen();
};
//CARD TO VALUE FUNCTION - returns Number
var cardToVal = function(crd) {
	var c = crd.charAt(0);
	if(c==='G') {
		return parseInt(crd.charAt(1))+1;
	} else if(c==='B') {
		return parseInt(crd.charAt(1));
	} else if(c==='R') {
		return parseInt(crd.charAt(1))*-1;
	} else {
		return null;
	}
};

/* GAME PLAY
====================================================================
*/
var newGame = function() {
	addGame();
	winsPC = 0;
	winsAI = 0;
	dealAI();
	dealPC();
	newRound();
	playGame();
};
var playGame = function() {
	nextRound();
};
var playRound = function() {
	round = true;
	turn = 0;
	nextTurn();
};
var nextRound = function() {
	if(winsPC>2 || winsAI >2 || round) {
		return;
	}
	newRound();
	playRound();
};
var nextTurn = function() {
	if(turn===0) {
		if(AI) {
			turn = 1;
		}
		if(PC) {
			playTurnPC();
		}
	} else if(turn===1) {
		if(PC) {
			turn = 0;
		}
		if(AI) {
			playTurnAI();
		}
	}
	if(!PC && !AI && round) {
		//see who wins
		if((totalPC>20 && totalAI>20) || (totalPC===totalAI)) {
		} else if((totalAI > 20) || ((totalPC < 21) && (totalPC > totalAI))) {
			winsPC++;
		} else if((totalPC > 20) || ((totalAI < 21) && (totalAI > totalPC))) {
			winsAI++;
		}
		drawScreen();
		round = false;
		if(winsPC===3) {
			wonGame();
		} else if(winsAI===3) {
			lostGame();
		}
	}
};
var playTurnAI = function() {
	//deal card
	var next = deck.pop();
	tableAI[slotAI] = next;
	slotAI++;
	totalAI += cardToVal(next);
	//check if 20 or full table
	if(slotAI===9 || totalAI===20) {
		AI = false;
		nextTurn();
		return;
	};
	drawScreen();
	//AI CHOICE
	var thinking = true;
	//1st priority - PC >20
	if(totalAI < 21 && totalPC > 20) {
		AI = false;
		nextTurn();
		return;
	}
	//2nd priority - getting 20
	handAI.forEach(function(crd,idx) {
		if(!thinking) { return; }
		var val = cardToVal(crd);
		if(totalAI + val === 20) {
			//use card
			thinking = false;
			totalAI += val;
			tableAI[slotAI] = crd;
			slotAI++;
			handAI[idx] = 'empty';
		}
	});
	//3rd priority - not getting over 20
	if(thinking && totalAI > 20) {
		handAI.forEach(function(crd,idx) {
			if(!thinking) { return; }
			var val = cardToVal(crd);
			if(totalAI + val <= 20) {
				//use card
				thinking = false;
				totalAI += val;
				tableAI[slotAI] = crd;
				slotAI++;
				handAI[idx] = 'empty';
				AI = false;
			}
		});
	}
	if(totalAI >= 20) {
		AI = false;
	};
	drawScreen();
	nextTurn();
};
var playTurnPC = function() {
	//deal card
	var next = deck.pop();
	tablePC[slotPC] = next;
	slotPC++;
	totalPC += cardToVal(next);
	drawScreen();
	//check if 20 or full table
	if(slotPC===9 || totalPC===20) {
		PC = false;
		drawScreen();
		nextTurn();
		return;
	};
	//player choice
	pChoice = true;
	pChoiceHand = true;
};
var playChoiceH0 = function() {
	if(!pChoiceHand || handPC[0]==='empty') { return; }
	pChoiceHand = false;
	playChoiceHand(0);
};
var playChoiceH1 = function() {
	if(!pChoiceHand || handPC[1]==='empty') { return; }
	pChoiceHand = false;
	playChoiceHand(1);
};
var playChoiceH2 = function() {
	if(!pChoiceHand || handPC[2]==='empty') { return; }
	pChoiceHand = false;
	playChoiceHand(2);
};
var playChoiceH3 = function() {
	if(!pChoiceHand || handPC[3]==='empty') { return; }
	pChoiceHand = false;
	playChoiceHand(3);
};
var playChoiceHand = function(z) {
	tablePC[slotPC] = handPC[z];
	totalPC += cardToVal(handPC[z]);
	slotPC++;
	handPC[z] = 'empty';
	drawScreen();
	//check if 20 or full table
	if(slotPC===9 || totalPC>=20) {
		PC = false;
		drawScreen();
		nextTurn();
	};
};
var playChoiceET = function() {
	if(!pChoice) { return; }
	pChoice = false;
	pChoiceHand = false;
	if(totalPC > 20) {
		PC = false;
	}
	drawScreen();
	nextTurn();
};
var playChoiceSD = function() {
	if(!pChoice) { return; }
	pChoice = false;
	pChoiceHand = false;
	PC = false;
	drawScreen();
	nextTurn();
};

/* BUTTON INPUTS
====================================================================
*/
var btnH0 = document.getElementById('H0');
var btnH1 = document.getElementById('H1');
var btnH2 = document.getElementById('H2');
var btnH3 = document.getElementById('H3');
var btnEndTurn = document.getElementById('endTurn');
var btnStand = document.getElementById('stand');
var btnNextRound = document.getElementById('nextRound');
var btnNewGame = document.getElementById('newGame');

btnH0.addEventListener('click', playChoiceH0);
btnH1.addEventListener('click', playChoiceH1);
btnH2.addEventListener('click', playChoiceH2);
btnH3.addEventListener('click', playChoiceH3);
btnEndTurn.addEventListener('click', playChoiceET);
btnStand.addEventListener('click', playChoiceSD);
btnNextRound.addEventListener('click', nextRound);
btnNewGame.addEventListener('click', newGame);


/* DRAW SETUP
====================================================================
*/
//DRAW VARS
var imgDir = ['empty','hidden','G0','G1','G2','G3','G4','G5','G6','G7','G8','G9','B1','B2','B3','B4','B5','B6','R1','R2','R3','R4','R5','R6'];
var imgBank = [];
for(var z=0;z<24;z++) {
	imgBank[z] = new Image();
	imgBank[z].src = "/images/"+imgDir[z]+".png";
}

//DRAW FUNCTIONS
var drawTablePC = function(ctx) {	
	for(var z=0;z<9;z++) {
		ctx.drawImage(imgBank[imgDir.indexOf(tablePC[z])],100+(z%3)*70,20+Math.floor(z/3)*90);
	}
};
var drawHandPC = function(ctx) {
	for(var z=0;z<4;z++) {
		ctx.drawImage(imgBank[imgDir.indexOf(handPC[z])],50+z*80,300);
	}
};
var drawTableAI = function(ctx) {
	for(var z=0;z<9;z++) {
		ctx.drawImage(imgBank[imgDir.indexOf(tableAI[z])],600+(z%3)*70,20+Math.floor(z/3)*90);
	}
};
var drawHandAI = function(ctx) {
	for(var z=0;z<4;z++) {
		if(handAI[z]==='empty') {	
			ctx.drawImage(imgBank[0],550+z*80,300);
		} else {
			//ctx.drawImage(imgBank[imgDir.indexOf(handAI[z])],550+z*80,300);
			ctx.drawImage(imgBank[1],550+z*80,300);
		}
	}
};
var drawWinsPC = function(ctx) {
	ctx.fillStyle = "#000";
	ctx.fillRect(320,20,120,40);
	for(var z=0;z<3;z++) {
		if(z<winsPC) {
			ctx.fillStyle = "#0c0";
		} else {
			ctx.fillStyle = "#666";
		}
		ctx.beginPath();
		ctx.arc(340+z*40,40,15,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
	}
};
var drawWinsAI = function(ctx) {
	ctx.fillStyle = "#000";
	ctx.fillRect(460,20,120,40);
	for(var z=0;z<3;z++) {
		if(z<winsAI) {
			ctx.fillStyle = "#0c0";
		} else {
			ctx.fillStyle = "#666";
		}
		ctx.beginPath();
		ctx.arc(560-z*40,40,15,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();
	}
};
var drawTotalPC = function(ctx) {
	var score = "";
	ctx.fillStyle = "#000";
	ctx.fillRect(400,130,40,40);
	ctx.font="30px monospace";
	if(PC) {
		ctx.fillStyle = "#fff";
	} else {
		ctx.fillStyle = "#666";
	}
	if(totalPC < 10) {
		score = '0'+totalPC;
	} else {
		score = ''+totalPC;
	}
	ctx.fillText(score,402,161);
};
var drawTotalAI = function(ctx) {
	var score = "";
	ctx.fillStyle = "#000";
	ctx.fillRect(460,130,40,40);
	ctx.font="30px monospace";
	if(AI) {
		ctx.fillStyle = "#fff";
	} else {
		ctx.fillStyle = "#666";
	}
	if(totalAI < 10) {
		score = '0'+totalAI;
	} else {
		score = ''+totalAI;
	}
	ctx.fillText(score,462,161);
};
var drawScreen = function() {
	var screen = document.getElementById('gameScreen');
	var ctx = screen.getContext("2d");
	ctx.fillStyle = "#202020";
	ctx.fillRect(0,0,900,430);
	drawTablePC(ctx);
	drawHandPC(ctx);
	drawTableAI(ctx);
	drawHandAI(ctx);
	drawWinsPC(ctx);
	drawWinsAI(ctx);
	drawTotalPC(ctx);
	drawTotalAI(ctx);
}

//DRAW FIRST SCREEN
document.addEventListener('DOMContentLoaded', newRound);

