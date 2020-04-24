function getHostAPI() {
	return 'http://localhost:8080/tienda-backend/';
	//return "http://apps.unprg.edu.pe/sisbu-backend/";
}

function getHostAndContextAPI() {
	return 'http://localhost:8080/tienda-backend/api/';
	//return "http://apps.unprg.edu.pe/sisbu-backend/api/";
}

function getHostFrontEnd() {
	return 'http://localhost' + getContextAPP();
	//return "http://apps.unprg.edu.pe/sisbu-backend/";
}
// ENVIO Y RESPUESTA DEL SERVIDOR
const RequestServer = (
	beanRequest,
	json,
	parameters_pagination,
	modal = ''
) => {
	// SwalProgress();
	var xhr = new XMLHttpRequest();
	xhr.open(
		beanRequest.type_request,
		getHostAPI() +
			beanRequest.entity_api +
			'/' +
			beanRequest.operation +
			parameters_pagination,
		true
	);
	xhr.responseType = 'json';
	xhr.setRequestHeader(
		'Authorization',
		'Bearer ' + Cookies.get('tienda_token')
	);
	// xhr.onprogress = () => {
	// 	showProgress(
	// 		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando ' +
	// 			modal +
	// 			' </i>  <strong class="f-12 font-weight-100 p-1 ">Recepcionando. . .</strong>'
	// 	);
	// };
	// xhr.upload.onprogress = () => {
	// 	showProgress(
	// 		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando ' +
	// 			modal +
	// 			' </i>  <strong class="f-12 font-weight-100 p-1 ">Enviando. . .</strong>'
	// 	);
	// };
	xhr.onerror = (error) => {
		showAlertErrorRequest();
	};
	if (beanRequest.type_request === 'GET') {
		xhr.send();
	} else {
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(json));
	}
	return xhr;
};
