class BeanURL {
	constructor() {
		this.url = '';
		//this.type_perfil = "";
	}
}

document.addEventListener('DOMContentLoaded', function() {
	let user_session = Cookies.getJSON('tienda_user');
	console.log(user_session);
});

// NO UTILIZANDO
function loaderUrlAte() {
	let url;

	url = new BeanURL();
	url.url = 'ate/index';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/perfil';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/datos';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/evaluaciones';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/reservas';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/menu-semanal';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/noticias-eventos';
	list_url_ate.push(url);

	url = new BeanURL();
	url.url = 'ate/constancias';
	list_url_ate.push(url);
}
