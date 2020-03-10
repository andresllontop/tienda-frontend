var beanPaginationPersonal;
var personalSelected;
var beanRequestPersonal = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//invocar funcion agregar

	console.log(contextPah + 'auth/login');
	addPersonal();

	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestPersonal.entity_api = 'api/personales';
	beanRequestPersonal.operation = 'paginate';
	beanRequestPersonal.type_request = 'GET';

	$('#FrmPersonal').submit(function(event) {
		beanRequestPersonal.operation = 'paginate';
		beanRequestPersonal.type_request = 'GET';
		$('#modalCargandoPersonal').modal('show');
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmPersonalModal').submit(function(event) {
		if (validateFormPersonal()) {
			$('#modalCargandoPersonal').modal('show');
		}
		event.preventDefault();
		event.stopPropagation();
	});

	$('#modalCargandoPersonal').on('shown.bs.modal', function() {
		processAjaxPersonal();
	});

	$('#ventanaModalPersonal').on('hidden.bs.modal', function() {
		beanRequestPersonal.operation = 'paginate';
		beanRequestPersonal.type_request = 'GET';
	});

	$('#modalCargandoPersonal').on('hide.bs.modal', function() {
		beanRequestPersonal.operation = 'paginate';
		beanRequestPersonal.type_request = 'GET';
	});

	$('#modalCargandoPersonal').modal('show');

	$('#sizePagePersonal').change(function() {
		$('#modalCargandoPersonal').modal('show');
	});
});
function addPersonal() {
	//CONFIGURAMOS LA SOLICITUD
	beanRequestPersonal.operation = 'add';
	beanRequestPersonal.type_request = 'POST';
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombrePersonal').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalPersonal').innerHTML =
		'REGISTRAR PERSONAL';
}

function processAjaxPersonal() {
	let parameters_pagination = '';
	let json = '';
	if (beanRequestPersonal.operation == 'paginate') {
		if (document.querySelector('#txtFilterPersonal').value != '') {
			document.querySelector('#pagePersonal').value = 1;
		}
		parameters_pagination +=
			'?nombre=' +
			document.querySelector('#txtFilterPersonal').value.toUpperCase();
		parameters_pagination +=
			'&page=' + document.querySelector('#pagePersonal').value;
		parameters_pagination +=
			'&size=' + document.querySelector('#sizePagePersonal').value;
	} else {
		parameters_pagination = '';
		if (beanRequestPersonal.operation == 'delete') {
			parameters_pagination = '/' + personalSelected.idpersonal;
		} else {
			json = {
				nombre: document.querySelector('#txtNombrePersonal').value
			};
			if (beanRequestPersonal.operation == 'update') {
				json.idpersonal = personalSelected.idpersonal;
			}
		}
	}
	$.ajax({
		url:
			getHostAPI() +
			beanRequestPersonal.entity_api +
			'/' +
			beanRequestPersonal.operation +
			parameters_pagination,
		type: beanRequestPersonal.type_request,
		/*headers: {
			Authorization: 'Bearer ' + Cookies.get('tienda_token')
		},*/
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			$('#modalCargandoPersonal').modal('hide');
			if (beanCrudResponse.messageServer !== undefined) {
				if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
					showAlertTopEnd('success', 'Acción realizada exitosamente');
					$('#ventanaModalPersonal').modal('hide');
				} else {
					showAlertTopEnd('warning', beanCrudResponse.messageServer);
				}
			}
			if (beanCrudResponse.beanPagination !== undefined) {
				beanPaginationPersonal = beanCrudResponse.beanPagination;
				toListPersonal(beanPaginationPersonal);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoPersonal').modal('hide');
			showAlertErrorRequest();
		});
}

function toListPersonal(beanPagination) {
	document.querySelector('#tbodyPersonal').innerHTML = '';
	document.querySelector('#titleManagerPersonal').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PERSONALES';
	if (beanPagination.count_filter > 0) {
		let row;
		row = `
               <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2"">
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-truncate " >
                        <p class="mb-0 text-truncate ">
                           NOMBRE
                        </p>
                    </div>
                    <!-- /widget info -->
                    
                </div>
            `;
		document.querySelector('#tbodyPersonal').innerHTML += row;
		beanPagination.list.forEach((personal) => {
			row = `
                 <div class="dt-widget__item border-success  ">
                    <!-- Widget Extra -->
                    <div class="dt-widget__extra text-right">
                      
                        <!-- Hide Content -->
                        <div class="hide-content pr-2"">
                            <!-- Action Button Group -->
                            <div class="action-btn-group">
                                <button class="btn btn-default text-primary dt-fab-btn editar-personal" idpersonal='${personal.idpersonal}' title="Editar" data-toggle="tooltip">
                                    <i class="icon icon-editors"></i>
                                </button>
                                <button class="btn btn-default text-danger dt-fab-btn eliminar-personal" idpersonal='${personal.idpersonal}' title="Eliminar" data-toggle="tooltip">
                                    <i class="icon icon-trash-filled"></i>
                                </button>
                              
                            </div>
                            <!-- /action button group -->
                        </div>
                        <!-- /hide content -->
                    </div>
                    <!-- /widget extra -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-truncate " >
                        <p class="mb-0 text-truncate ">
                           ${personal.nombre}
                        </p>
                    </div>
                    <!-- /widget info -->
                 
                    
                </div>
            `;
			document.querySelector('#tbodyPersonal').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});
		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePagePersonal').value),
			document.querySelector('#pagePersonal'),
			$('#modalCargandoPersonal'),
			$('#paginationPersonal')
		);
		addEventsPersonals();
		if (beanRequestPersonal.operation == 'paginate') {
			document.querySelector('#txtFilterPersonal').focus();
		}
	} else {
		destroyPagination($('#paginationPersonal'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterPersonal').focus();
	}
}

function addEventsPersonals() {
	document.querySelectorAll('.editar-personal').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			personalSelected = findByPersonal(btn.getAttribute('idpersonal'));
			if (personalSelected != undefined) {
				beanRequestPersonal.operation = 'update';
				beanRequestPersonal.type_request = 'PUT';
				//SET VALUES MODAL
				document.querySelector('#txtNombrePersonal').value =
					personalSelected.nombre;
				document.querySelector('#TituloModalPersonal').innerHTML =
					'EDITAR PERSONAL';
				$('#ventanaModalPersonal').modal('show');
				document.querySelector('#txtNombrePersonal').focus();
			} else {
				showAlertTopEnd(
					'warning',
					'No se encontró la personal para poder editar'
				);
			}
		};
	});
	document.querySelectorAll('.eliminar-personal').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			personalSelected = findByPersonal(btn.getAttribute('idpersonal'));
			beanRequestPersonal.operation = 'delete';
			beanRequestPersonal.type_request = 'DELETE';
			processAjaxPersonal();
		};
	});
}

function findByPersonal(idpersonal) {
	let personal_;
	beanPaginationPersonal.list.forEach((personal) => {
		if (idpersonal == personal.idpersonal) {
			personal_ = personal;
			return;
		}
	});
	return personal_;
}

function validateFormPersonal() {
	if (document.querySelector('#txtNombrePersonal').value == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenPersonal').focus();
		return false;
	}
	return true;
}
