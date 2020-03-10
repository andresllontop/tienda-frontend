function closeSession() {
	let keys = keysCOOKIES();
	for (let i = 0; i < keys.length; i++) {
		//console.log('remove' + keys[i]);
		Cookies.remove(keys[i]);
	}
	//REDIRECCIONAMOS EL LOGIN
	console.log(getContextAPP() + 'auth/login');
	location.href = getContextAPP() + 'auth/login';
}

function keysCOOKIES() {
	var keys = ['tienda_user', 'tienda_token'];
	return keys;
}

function getContextAPP() {
	//return "/";
	return '/tienda-frontend/';
}

function getHostAPP() {
	//return "/";
	return 'http://localhost:8080/';
	//return "http://apps.unprg.edu.pe/";
}

function parseJwt(token) {
	try {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace('-', '+').replace('_', '/');
		JSON.parse(window.atob(base64));
		return true;
	} catch (error) {
		console.log('Error el token no es valido');
		return false;
	}
	//return JSON.parse(window.atob(base64));
}

function setCookieSession(token, user) {
	Cookies.set('tienda_user', user);
	Cookies.set('tienda_token', token);
}

function sendIndex() {
	let user = Cookies.getJSON('tienda_user');
	console.log(user);
	if (user != undefined) {
		switch (user.tipo_usuario) {
			case 1:
				//ATENDIDO
				location.href = getContextAPP() + 'app/ate/index';
				break;
			case 2:
				location.href = getContextAPP() + 'app/tienda/index';
				break;
		}
	} else {
		closeSession();
	}
}

function getIdAreaUserSession() {
	let url = window.location.href;
	if (url.includes('obstetricia')) {
		return 4;
	}
	if (url.includes('psicopedagogia')) {
		return 6;
	}
	if (url.includes('social')) {
		return 7;
	}
}

function setUrlFotoUserSession(url_foto) {
	document.querySelectorAll('.dt-avatar').forEach((img) => {
		img.setAttribute('src', url_foto);
	});
}

function include_file(file, targetId) {
	var ajax = new XMLHttpRequest();
	ajax.open('GET', file, true);
	ajax.addEventListener(
		'load',
		function() {
			if (this.status == 200) {
				document.querySelector('#' + targetId).innerHTML = this.responseText;
				console.log('hola 200');
			} else if (this.status == 404) {
				document.querySelector('#app_root').innerHTML = '';
				include_file('zinclude_error/app_404.html', 'app_root');
				console.log('hola 404');
			}
		},
		false
	);
	ajax.send();
}

function include_script(file) {
	var script = document.createElement('script');
	document.body.appendChild(script);
	script.setAttribute('src', file);
}
