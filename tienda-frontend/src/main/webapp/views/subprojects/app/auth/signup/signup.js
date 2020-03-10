document.addEventListener('DOMContentLoaded', function() {
	$('#FrmRegistroProfesional').submit(function(event) {
		try {
			if (valditeFrmProfesional()) {
				$('#modalCargandoProfesional').modal('show');
			}
		} catch (e) {
			console.log(e);
		}
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmRegistroAtendido').submit(function(event) {
		try {
			if (valditeFrmAtendido()) {
				$('#modalCargandoAtendido').modal('show');
			}
		} catch (e) {
			console.log(e);
		}
		event.preventDefault();
		event.stopPropagation();
	});

	document.querySelector('#btnOpenRegistroAtendido').onclick = function() {
		document.querySelector('#divContentTypeSelectedRegistro').style.paddingTop =
			'0px';
		document.querySelector('#divSelectedTypeRegistro').style.display = 'none';
		document.querySelector('#divProfesional').style.display = 'none';
		document.querySelector('#divAtendido').style.display = 'block';
	};

	document.querySelector('#btnOpenRegistroProfesional').onclick = function() {
		document.querySelector('#divContentTypeSelectedRegistro').style.paddingTop =
			'0px';
		document.querySelector('#divSelectedTypeRegistro').style.display = 'none';
		document.querySelector('#divAtendido').style.display = 'none';
		document.querySelector('#divProfesional').style.display = 'block';
	};

	document
		.querySelectorAll('.btn-volver-selecciona-type-registro')
		.forEach((btn) => {
			btn.onclick = function() {
				hideTypesRegistros();
				document.querySelector(
					'#divContentTypeSelectedRegistro'
				).style.paddingTop = '150px';
				document.querySelector('#divSelectedTypeRegistro').style.display =
					'block';
			};
		});

	$('#modalCargandoProfesional').on('shown.bs.modal', function() {
		processAjaxRegistroProfesional();
	});

	$('#modalCargandoAtendido').on('shown.bs.modal', function() {
		processAjaxRegistroAtendido();
	});
});

/**
 * FUNCIONES DE PROCESAMIENTO DE SOLICITUD
 * @returns {undefined}
 */

function processAjaxRegistroProfesional() {
	let beanCrudRequest = {
		t: {
			nro_documento: '',
			colegiatura: document.querySelector('#txtColegiaturaProfesional').value,
			nombre: document.querySelector('#txtNombresProfesional').value,
			apellido_pat: document.querySelector('#txtApellidoPatProfesional').value,
			apellido_mat: document.querySelector('#txtApellidoMatProfesional').value,
			tipo_usuario: 'PRO',
			username: document.querySelector('#txtUsernameProfesional').value,
			email: '',
			pass: document.querySelector('#txtPassProfesional').value,
			alias: '',
			estado: 'ACT',
			path_foto: '',
			institucion: {
				idinstitucion: 1
			}
		}
	};
	$.ajax({
		url: getHostAPI() + 'auth/signup',
		type: 'POST',
		data: JSON.stringify(beanCrudRequest),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			$('#modalCargandoProfesional').modal('hide');
			if (beanCrudResponse.messageServer != undefined) {
				if (beanCrudResponse.messageServer.toLowerCase() === 'ok') {
					//MANDAMOS A INICIAR SESIÓN
					showAlertTopEnd('success', 'Registro completado exitosamente');
					setTimeout(() => {
						location.href = getContextAPP() + 'auth/login';
					}, 2500);
				} else {
					showAlertTopEnd('warning', beanCrudResponse.messageServer);
				}
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoProfesional').modal('hide');
			showAlertErrorRequest();
		});
}

function processAjaxRegistroAtendido() {
	let beanCrudRequest = {
		t: {
			nro_documento: '',
			colegiatura: '',
			nombre: '',
			apellido_pat: '',
			apellido_mat: '',
			tipo_usuario: 'ATE',
			username: document.querySelector('#txtUsernameAtendido').value,
			email: '',
			pass: document.querySelector('#txtPassAtendido').value,
			alias: document.querySelector('#txtAliasAtendido').value,
			estado: 'ACT',
			path_foto: '',
			institucion: {
				idinstitucion: 1
			}
		}
	};
	$.ajax({
		url: getHostAPI() + 'auth/signup',
		type: 'POST',
		data: JSON.stringify(beanCrudRequest),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			$('#modalCargandoAtendido').modal('hide');
			if (beanCrudResponse.messageServer != undefined) {
				if (beanCrudResponse.messageServer.toLowerCase() === 'ok') {
					//MANDAMOS A INICIAR SESIÓN
					showAlertTopEnd('success', 'Registro completado exitosamente');
					setTimeout(() => {
						location.href = getContextAPP() + 'auth/login';
					}, 2500);
				} else {
					showAlertTopEnd('warning', beanCrudResponse.messageServer);
				}
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoAtendido').modal('hide');
			showAlertErrorRequest();
		});
}

/*
 * UTILITARIOS DEL REGISTRO
 * @returns {undefined}
 */
function hideTypesRegistros() {
	document.querySelector('#divProfesional').style.display = 'none';
	document.querySelector('#divAtendido').style.display = 'none';
}

function valditeFrmProfesional() {
	if (document.querySelector('#txtNombresProfesional').value === '') {
		showAlertTopEnd('warning', 'Ingrese nombres');
		return false;
	}
	if (document.querySelector('#txtApellidoPatProfesional').value === '') {
		showAlertTopEnd('warning', 'Ingrese apellido paterno');
		return false;
	}
	if (document.querySelector('#txtApellidoMatProfesional').value === '') {
		showAlertTopEnd('warning', 'Ingrese apellido paterno');
		return false;
	}
	if (document.querySelector('#txtColegiaturaProfesional').value === '') {
		showAlertTopEnd('warning', 'Ingrese colegiatura');
		return false;
	}
	if (document.querySelector('#txtUsernameProfesional').value === '') {
		showAlertTopEnd('warning', 'Ingrese nombre de usuario');
		return false;
	}
	if (document.querySelector('#txtPassProfesional').value === '') {
		showAlertTopEnd('warning', 'Ingrese contraseña');
		return false;
	}
	return true;
}

function valditeFrmAtendido() {
	if (document.querySelector('#txtAliasAtendido').value === '') {
		showAlertTopEnd('warning', 'Ingrese alias');
		return false;
	}
	if (document.querySelector('#txtUsernameAtendido').value === '') {
		showAlertTopEnd('warning', 'Ingrese nombre de usuario');
		return false;
	}
	if (document.querySelector('#txtPassAtendido').value === '') {
		showAlertTopEnd('warning', 'Ingrese contraseña');
		return false;
	}
	return true;
}
