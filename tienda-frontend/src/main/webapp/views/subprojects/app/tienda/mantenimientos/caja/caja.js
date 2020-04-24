var beanPaginationCaja;
var cajaSelected;
var metodo = false;
var beanRequestCaja = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestCaja.entity_api = 'api/cajas';
	beanRequestCaja.operation = 'paginate';
	beanRequestCaja.type_request = 'GET';
	//LISTAR
	processAjaxCaja();
	//
	$('#FrmCaja').submit(function(event) {
		beanRequestCaja.operation = 'paginate';
		beanRequestCaja.type_request = 'GET';
		processAjaxCaja();
		event.preventDefault();
		event.stopPropagation();
	});

	document.getElementById('FrmCajaModal').onsubmit = (event) => {
		if (metodo) {
			beanRequestCaja.operation = 'update';
			beanRequestCaja.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestCaja.operation = 'add';
			beanRequestCaja.type_request = 'POST';
		}

		if (validateFormCaja()) {
			processAjaxCaja();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	$('#sizePageCaja').change(function() {
		processAjaxCaja();
	});
});
function addCaja() {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombreCaja').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalCaja').innerHTML = 'REGISTRAR CAJA';
}

function processAjaxCaja() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Punto de Venta </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestCaja.operation == 'update' ||
		beanRequestCaja.operation == 'add'
	)
		json = {
			nombre: document.querySelector('#txtNombreCaja').value.toUpperCase(),
			establecimiento: null
		};

	switch (beanRequestCaja.operation) {
		case 'delete':
			parameters_pagination = '/' + cajaSelected.idcaja;
			break;

		case 'update':
			json.idcaja = cajaSelected.idcaja;
			break;
		case 'add':
			break;

		default:
			if (limpiar_campo(document.querySelector('#txtFilterCaja').value) != '')
				document.querySelector('#pageCaja').value = 1;
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterCaja').value)
					.toLowerCase()
					.concat('1');
			parameters_pagination +=
				'&page=' + document.querySelector('#pageCaja').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageCaja').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestCaja, json, parameters_pagination, 'Caja');

	xhr.onload = () => {
		hideProgress();
		beanCrudResponse = xhr.response;
		if (beanCrudResponse.messageServer !== undefined) {
			if (beanCrudResponse.messageServer.toLowerCase() == 'ok')
				showAlertTopEnd('success', 'Acción realizada exitosamente');
			else showAlertTopEnd('warning', beanCrudResponse.messageServer);

			addCaja();
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationCaja = beanCrudResponse.beanPagination;
			toListCaja(beanPaginationCaja);
		}
		addCaja();
		beanRequestCaja.operation = 'paginate';
		beanRequestCaja.type_request = 'GET';
	};
}

function toListCaja(beanPagination) {
	document.querySelector('#tbodyCaja').innerHTML = '';
	document.querySelector('#titleManagerCaja').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] CAJAS';
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
		document.querySelector('#tbodyCaja').innerHTML += row;
		beanPagination.list.forEach((caja) => {
			row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<label for="${caja.idcaja}" 
					class="dt-widget__subtitle text-truncate ">
					${caja.nombre}
					</label>
				  </div>
				  <!-- /widget info -->
		  
				  <!-- Widget Extra -->
				  <div class="dt-widget__extra">
				  <div class="dt-task">
				  <div class="dt-task__redirect">
					<!-- Action Button Group -->
					<div class="action-btn-group">
					  <button
					  id='${caja.idcaja}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-caja"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-task-manager icon-1x"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-caja" idcaja='${caja.idcaja}' 
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Eliminar</em>"
					  >
						<i class="icon icon-circle-remove-o icon-1x"></i>
					  </button>
					  </div>
					<!-- /action button group -->
				  </div>
				  </div>
				  <!-- /widget extra -->
				</div>
				<!-- /widgets caja -->
            `;
			document.querySelector('#tbodyCaja').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});

		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageCaja').value),
			document.querySelector('#pageCaja'),
			processAjaxCaja,
			$('#paginationCaja')
		);
		addEventsCajas();
	} else {
		destroyPagination($('#paginationCaja'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
	}
}

function addEventsCajas() {
	document.querySelectorAll('.editar-caja').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			cajaSelected = findByCaja(btn.getAttribute('id'));
			document.querySelectorAll('.dt-widget__subtitle').forEach((element) => {
				removeClass(element, 'text-strike');
			});
			if (cajaSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombreCaja').value = cajaSelected.nombre;
				document.querySelector('#TituloModalCaja').innerHTML = 'EDITAR CAJA';
				document.querySelector('#txtNombreCaja').focus();
				addClass(btn.labels[0], 'text-strike');
			} else {
				showAlertTopEnd('warning', 'No se encontró la caja para poder editar');
			}
		};
	});
	document.querySelectorAll('.eliminar-caja').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			cajaSelected = findByCaja(btn.getAttribute('idcaja'));
			beanRequestCaja.operation = 'delete';
			beanRequestCaja.type_request = 'DELETE';
			processAjaxCaja();
		};
	});
	document.querySelectorAll('.tooltip').forEach((btn) => {
		removeClass(btn, 'show');
		btn.innerHTML = '';
	});
}

function findByCaja(idcaja) {
	let caja_;
	beanPaginationCaja.list.forEach((caja) => {
		if (idcaja == caja.idcaja) {
			caja_ = caja;
			return;
		}
	});
	return caja_;
}

function validateFormCaja() {
	if (limpiar_campo(document.querySelector('#txtNombreCaja').value) == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenCaja').focus();
		return false;
	}
	return true;
}
