var checkCookie = (function() {
	var lastCookies = document.cookie
		.split(';')
		.map(function(x) {
			return x.trim().split(/(=)/);
		})
		.reduce(function(a, b) {
			a[b[0]] = a[b[0]]
				? a[b[0]] + ', ' + b.slice(2).join('')
				: b.slice(2).join('');
			return a;
		}, {});
	return function() {
		var currentCookies = document.cookie
			.split(';')
			.map(function(x) {
				return x.trim().split(/(=)/);
			})
			.reduce(function(a, b) {
				a[b[0]] = a[b[0]]
					? a[b[0]] + ', ' + b.slice(2).join('')
					: b.slice(2).join('');
				return a;
			}, {});
		for (cookie in currentCookies) {
			if (currentCookies[cookie] != lastCookies[cookie]) {
				/* ELIMINAMOS TODAS LAS COOCKIES Y CADUCAMOS LA SESSIÓN*/
				if (lastCookies[cookie] != undefined) {
					//SERA UN CAMBIO DESPUÉS DEL INICIO DE SESSIÓN
					closeSession();
				} else {
					//SERA UN CAMBIO DE INICIO DE SESSIÓN, NO HACEMOS NADA
				}
				//console.log("--------")
				//console.log(cookie + "=" + lastCookies[cookie])
				//console.log(cookie + "=" + currentCookies[cookie])
			}
		}
		lastCookies = currentCookies;
	};
})();
window.setInterval(checkCookie, 100);
