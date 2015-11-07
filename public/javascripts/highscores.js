var req = new XMLHttpRequest(),
url = 'http://localhost:3000/highscores/api';
req.open('GET', url, true);

//highscore functions - returns sorted array top 20 as [[names],[criteria]]
var rankByPercent = function(data) {
	var high = [];
	var res = [];
	for(var z=0;z<20;z++) {
		high.push(-1);
		res.push('Nobody');
	}
	data.forEach(function(ele) {
		var found = false;
		var percent = 0;
		var tmp = ['Nobody',-1];
		if(ele.games > 0) {
			percent = Math.floor(100*ele.wins/ele.games);
		}
		for(var z=0;z<20;z++) {
			if(found) {
				var tmper = [res[z],high[z]];
				res[z] = tmp[0];
				high[z] = tmp[1];
				tmp = tmper;
			} else if(percent > high[z]){
				found = true;
				tmp[0] = res[z];
				tmp[1] = high[z];
				res[z] = ele.username;
				high[z] = percent;
			}
		}
	});
	return [res,high];
};
var rankByWins = function(data) {
	var high = [];
	var res = [];
	for(var z=0;z<20;z++) {
		high.push(-1);
		res.push('Nobody');
	}
	data.forEach(function(ele) {
		var found = false;
		var wins = ele.wins;
		var tmp = ['Nobody',-1];
		for(var z=0;z<20;z++) {
			if(found) {
				var tmper = [res[z],high[z]];
				res[z] = tmp[0];
				high[z] = tmp[1];
				tmp = tmper;
			} else if(wins > high[z]){
				found = true;
				tmp[0] = res[z];
				tmp[1] = high[z];
				res[z] = ele.username;
				high[z] = wins;
			}
		}
	});
	return [res,high];
};
var rankByCredits = function(data) {
	var high = [];
	var res = [];
	for(var z=0;z<20;z++) {
		high.push(-1);
		res.push('Nobody');
	}
	data.forEach(function(ele) {
		var found = false;
		var credits = ele.credits;
		var tmp = ['Nobody',-1];
		for(var z=0;z<20;z++) {
			if(found) {
				var tmper = [res[z],high[z]];
				res[z] = tmp[0];
				high[z] = tmp[1];
				tmp = tmper;
			} else if(credits > high[z]){
				found = true;
				tmp[0] = res[z];
				tmp[1] = high[z];
				res[z] = ele.username;
				high[z] = credits;
			}
		}
	});
	return [res,high];
};

req.addEventListener('load', function() {
	if (req.status >= 200 && req.status < 400){
		var data = JSON.parse(req.responseText);
		document.getElementById('rankPercent').appendChild(document.createTextNode("By Win %"));
		document.getElementById('rankWins').appendChild(document.createTextNode("By Wins"));
		document.getElementById('rankCredits').appendChild(document.createTextNode("By Credits"));
		var highPercent = rankByPercent(data);
		var highWins = rankByWins(data);
		var highCredits = rankByCredits(data);
		for(var z=0;z<20;z++) {
			var ele = highPercent[1][z]>-1 ? highPercent[0][z] : '-';
			var crit = highPercent[1][z]>-1 ? highPercent[1][z]+'%' : '-';
			document.getElementById('rankPercent').appendChild(document.createElement('LI')).appendChild(document.createTextNode(ele));
			document.getElementById('rankPercentCrit').appendChild(document.createElement('LI')).appendChild(document.createTextNode(crit));
		}
		for(var z=0;z<20;z++) {
			var ele = highWins[1][z]>-1 ? highWins[0][z] : '-';
			var crit = highWins[1][z]>-1 ? highWins[1][z] : '-';
			document.getElementById('rankWins').appendChild(document.createElement('LI')).appendChild(document.createTextNode(ele));
			document.getElementById('rankWinsCrit').appendChild(document.createElement('LI')).appendChild(document.createTextNode(crit));
		}
		for(var z=0;z<20;z++) {
			var ele = highCredits[1][z]>-1 ? highCredits[0][z] : '-';
			var crit = highCredits[1][z]>-1 ? highCredits[1][z] : '-';
			document.getElementById('rankCredits').appendChild(document.createElement('LI')).appendChild(document.createTextNode(ele));
			document.getElementById('rankCreditsCrit').appendChild(document.createElement('LI')).appendChild(document.createTextNode(crit));
		}
	}
});
req.addEventListener('error', function(e) {
	console.log("ERROR!",e);
});
req.send();
