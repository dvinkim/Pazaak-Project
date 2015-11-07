var req = new XMLHttpRequest(),
url = 'http://localhost:3000/shop/api';
req.open('GET', url, true);

req.addEventListener('load', function() {
	if (req.status >= 200 && req.status < 400){
		var data = JSON.parse(req.responseText);
		data.forEach(function(product) {
			if(!!document.getElementById(product.card)) {
				document.getElementById(product.card+'P').textContent = 'Price: '+product.price;
				document.getElementById(product.card).max = product.stock;
			}
		});
	}
});
req.addEventListener('error', function(e) {
	console.log("ERROR!",e);
});
req.send();

var reqp= new XMLHttpRequest();
var purchase = function() {
	var cart = [];
	var price = 0;
	for(var z=1;z<7;z++) {
		var card = 'B'+z;
		var count = document.getElementById(card).value;
		price += count*(80+20*z);
		for(var i=0;i<count;i++) {
			cart.push(card);
		}
		card = 'R'+z;
		count = document.getElementById(card).value;
		price += count*(80+40*z);
		for(var i=0;i<count;i++) {
			cart.push(card);
		}
	}

	reqp.open('POST', 'http://localhost:3000/shop/api/buy', true);
	reqp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	reqp.send("price="+price+"&cart="+cart);
};

var btnPurchase = document.getElementById('purchase');
btnPurchase.addEventListener('click', purchase);
