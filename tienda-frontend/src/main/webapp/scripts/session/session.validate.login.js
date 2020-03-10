console.log('PathName: ' + window.location.pathname);
if (window.location.pathname == getContextAPP() + 'auth/login') {
	if (Cookies.get('tienda_token') != undefined) {
		if (parseJwt(Cookies.get('tienda_token'))) {
			sendIndex();
		}
	}
}
