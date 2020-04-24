var beanPaginationPersonal;
var personalSelected;
var beanRequestPersonal = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestPersonal.entity_api = 'api/personal';
	beanRequestPersonal.operation = 'paginate';
	beanRequestPersonal.type_request = 'GET';
	processAjaxPersonal();

	document.getElementById('btnAgregarNewPersonal').onclick = () => {
		removeClass(document.getElementById('addPersonalHtml'), 'd-none');
		removeClass(document.getElementById('listPersonalHtml'), 'd-block');

		addClass(document.getElementById('addPersonalHtml'), 'd-block');
		addClass(document.getElementById('listPersonalHtml'), 'd-none');
		addPersonal();
		//SET TITLE MODAL
		document.querySelector('#TituloModalPersonal').innerHTML =
			'REGISTRAR PERSONAL';
		beanRequestPersonal.operation = 'add';
		beanRequestPersonal.type_request = 'POST';
	};

	document.getElementById('btnCancelAddPersonalHtml').onclick = () => {
		removeClass(document.getElementById('addPersonalHtml'), 'd-block');
		removeClass(document.getElementById('listPersonalHtml'), 'd-none');
		addClass(document.getElementById('addPersonalHtml'), 'd-none');
		addClass(document.getElementById('listPersonalHtml'), 'd-block');
		beanRequestPersonal.operation = 'paginate';
		beanRequestPersonal.type_request = 'GET';
		processAjaxPersonal();
	};

	$('#FrmPersonal').submit(function(event) {
		beanRequestPersonal.operation = 'paginate';
		beanRequestPersonal.type_request = 'GET';
		processAjaxPersonal();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmPersonalModal').submit(function(event) {
		if (validateFormPersonal()) {
			processAjaxPersonal();
		}
		event.preventDefault();
		event.stopPropagation();
	});

	$('#sizePagePersonal').change(function() {
		processAjaxPersonal();
	});
});
function addPersonal(personalselected = undefined) {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtTipoDocumentoPersonal').value =
		personalselected == undefined ? '0' : personalselected.tipo_documento;
	document.querySelector('#txtDocumentoPersonal').value =
		personalselected == undefined ? '' : personalselected.documento;
	document.querySelector('#txtSexoPersonal').value =
		personalselected == undefined ? '0' : personalselected.sexo;
	document.querySelector('#txtNombrePersonal').value =
		personalselected == undefined ? '' : personalselected.nombre;
	document.querySelector('#txtApellidoPatPersonal').value =
		personalselected == undefined ? '' : personalselected.apellido_pat;
	document.querySelector('#txtApellidoMatPersonal').value =
		personalselected == undefined ? '' : personalselected.apellido_mat;
	document.querySelector('#txtEmailPersonal').value =
		personalselected == undefined ? '' : personalselected.email;
	document.querySelector('#txtTelefonoPersonal').value =
		personalselected == undefined ? '' : personalselected.telefono;
	document.querySelector('#txtDireccionPersonal').value =
		personalselected == undefined ? '' : personalselected.direccion;
	document.querySelector('#txtEstadoPersonal').value =
		personalselected == undefined ? '1' : personalselected.estado;
}

function processAjaxPersonal() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Personal </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestPersonal.operation == 'update' ||
		beanRequestPersonal.operation == 'add'
	) {
		json = {
			nombre: document.querySelector('#txtNombrePersonal').value,
			apellido_pat: document.querySelector('#txtApellidoPatPersonal').value,
			apellido_mat: document.querySelector('#txtApellidoMatPersonal').value,
			tipo_documento: document.querySelector('#txtTipoDocumentoPersonal').value,
			documento: document.querySelector('#txtDocumentoPersonal').value,
			sexo: document.querySelector('#txtSexoPersonal').value,
			telefono: document.querySelector('#txtTelefonoPersonal').value,
			email: document.querySelector('#txtEmailPersonal').value,
			direccion: document.querySelector('#txtDireccionPersonal').value,
			estado: document.querySelector('#txtEstadoPersonal').value,
			usuario: { idusuario: 1 }
		};
	}
	switch (beanRequestPersonal.operation) {
		case 'delete':
			parameters_pagination = '/' + personalSelected.idpersona;
			break;

		case 'update':
			json.idpersona = personalSelected.idpersona;
			break;
		case 'add':
			break;
		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(
					document.querySelector('#txtFilterPersonal').value
				).toLowerCase();
			parameters_pagination +=
				'&page=' + document.querySelector('#pagePersonal').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePagePersonal').value;

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestPersonal,
		json,
		parameters_pagination,
		'Personal'
	);
	xhr.onload = () => {
		hideProgress();
		beanCrudResponse = xhr.response;
		if (beanCrudResponse.messageServer !== undefined) {
			if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
				showAlertTopEnd('success', 'Acción realizada exitosamente');
			} else {
				showAlertTopEnd('warning', beanCrudResponse.messageServer);
			}
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationPersonal = beanCrudResponse.beanPagination;
			toListPersonal(beanPaginationPersonal);
		}
	};
}

function toListPersonal(beanPagination) {
	document.querySelector('#tbodyPersonal').innerHTML = '';
	document.querySelector('#titleManagerPersonal').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PERSONALES';
	if (beanPagination.count_filter == 0) {
		destroyPagination($('#paginationPersonal'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterPersonal').focus();
		return;
	}
	let row;
	row = `
		<div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2 text-center">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " style="border-right:0.1em solid">
               DOCUMENTO
            </p>
        </div>
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " style="border-right:0.1em solid">
               NOMBRE
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " style="border-right:0.1em solid">
               APELLIDOS
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate  " >
		<p class="mb-0 text-truncate " style="border-right:0.1em solid">
               TELÉFONO
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate  " >
		<p class="mb-0 text-truncate " style="border-right:0.1em solid">
               EMAIL
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate  " >
		<p class="mb-0 text-truncate ">
               DIRECCIÓN
            </p>
        </div>
        <!-- /widget info -->
        
    </div>
            `;
	document.querySelector('#tbodyPersonal').innerHTML += row;
	beanPagination.list.forEach((personal) => {
		row = `
			<!-- Widget Item -->
			<div class="dt-widget__item text-center">
				<!-- Widget Info -->
					  <div class="dt-widget__info text-truncate">
						<p class="dt-widget__subtitle text-truncate"style="border-right:0.1em solid">
						${personal.documento}
						</p>
					  </div>
					  <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" style="border-right:0.1em solid">
                ${personal.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" style="border-right:0.1em solid">
                ${personal.apellido_pat + ' ' + personal.apellido_mat}
                </p>
              </div>
              <!-- /widget info -->
            
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" style="border-right:0.1em solid">
                ${personal.telefono}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate"style="border-right:0.1em solid">
                ${personal.email}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${personal.direccion}
                </p>
              </div>
              <!-- /widget info -->
			  <div class="dt-widget__extra text-left">
			  <!-- Hide Content -->
			  	<div class="hide-content">
				<!-- Action Button Group -->
					<div class="action-btn-group">
						<button idpersonal='${personal.idpersona}' type="button"
						class="btn btn-default text-success dt-fab-btn editar-personal" data-toggle="tooltip" data-html="true" title="" data-original-title="<em>Editar</em>">
							<i class="icon icon-editors icon-sm pulse-success"></i>
		  				</button>
		  				<button type="button" class="btn btn-default text-danger dt-fab-btn eliminar-personal"
						idpersonal='${
							personal.idpersona
						}' data-toggle="tooltip" data-html="true" title=""
						data-original-title="<em>Eliminar</em>">
							<i class="icon icon-trash-filled icon-sm pulse-danger"></i>
		  				</button>
					</div>
				<!-- /action button group -->
			 	</div>
			  <!-- /hide content -->
			  </div>
              
            </div>
            <!-- /widgets item -->
            `;
		document.querySelector('#tbodyPersonal').innerHTML += row;
		$('[data-toggle="tooltip"]').tooltip();
	});
	buildPagination(
		beanPagination.count_filter,
		parseInt(document.querySelector('#sizePagePersonal').value),
		document.querySelector('#pagePersonal'),
		processAjaxPersonal,
		$('#paginationPersonal')
	);
	addEventsPersonals();
	if (beanRequestPersonal.operation == 'paginate')
		document.querySelector('#txtFilterPersonal').focus();
}

function addEventsPersonals() {
	document.querySelectorAll('.editar-personal').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			personalSelected = findByPersonal(btn.getAttribute('idpersonal'));
			if (personalSelected == undefined) {
				showAlertTopEnd(
					'warning',
					'No se encontró la personal para poder editar'
				);
				return;
			}
			beanRequestPersonal.operation = 'update';
			beanRequestPersonal.type_request = 'PUT';
			//SET VALUES MODAL
			addPersonal(personalSelected);
			removeClass(document.getElementById('listPersonalHtml'), 'd-block');
			removeClass(document.getElementById('addPersonalHtml'), 'd-none');
			addClass(document.getElementById('listPersonalHtml'), 'd-none');
			addClass(document.getElementById('addPersonalHtml'), 'd-block');
			document.querySelector('#TituloModalPersonal').innerHTML =
				'EDITAR PERSONAL';
			document.querySelector('#txtDocumentoPersonal').focus();
		};
	});
	document.querySelectorAll('.eliminar-personal').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			personalSelected = findByPersonal(btn.getAttribute('idpersonal'));
			if (personalSelected == undefined) {
				showAlertTopEnd(
					'warning',
					'No se encontró la personal para poder eliminar'
				);
				return;
			}
			beanRequestPersonal.operation = 'delete';
			beanRequestPersonal.type_request = 'DELETE';
			processAjaxPersonal();
		};
	});
}

function findByPersonal(idpersonal) {
	let personal_;
	beanPaginationPersonal.list.forEach((personal) => {
		if (idpersonal == personal.idpersona) {
			personal_ = personal;
			return;
		}
	});
	return personal_;
}

function validateFormPersonal() {
	let numero = numero_campo(
		document.querySelector('#txtTipoDocumentoPersonal'),
		document.querySelector('#txtDocumentoPersonal'),
		document.querySelector('#txtSexoPersonal'),
		document.querySelector('#txtTelefonoPersonal'),
		document.querySelector('#txtEstadoPersonal')
	);
	if (numero != undefined) {
		numero.focus();
		addClass(numero.labels[0], 'text-danger font-weight-400');
		if (numero.value == '')
			showAlertTopEnd(
				'info',
				'Por favor ingrese ' + numero.labels[0].innerText
			);
		else
			showAlertTopEnd(
				'info',
				'Por favor ingrese solo NÚmeros al campo ' + numero.labels[0].innerText
			);

		return false;
	}
	let letra = letra_campo(
		document.querySelector('#txtNombrePersonal'),
		document.querySelector('#txtApellidoPatPersonal'),
		document.querySelector('#txtApellidoMatPersonal')
	);
	if (letra != undefined) {
		letra.focus();
		addClass(letra.labels[0], 'text-danger font-weight-400');
		if (letra.value == '')
			showAlertTopEnd('info', 'Por favor ingrese ' + letra.labels[0].innerText);
		else
			showAlertTopEnd(
				'info',
				'Por favor ingrese solo Letras al campo ' + letra.labels[0].innerText
			);

		return false;
	}
	if (
		limpiar_campo(document.querySelector('#txtDireccionPersonal').value) == ''
	) {
		showAlertTopEnd('info', 'Por favor ingrese Dirección');
		document.querySelector('#txtDireccionPersonal').value.focus();
		return false;
	}
}
