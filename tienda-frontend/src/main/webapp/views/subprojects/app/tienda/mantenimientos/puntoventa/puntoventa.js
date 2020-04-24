var beanPaginationPuntoVenta;
var puntoVentaSelected;
var metodo = false;
var beanRequestPuntoVenta = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestPuntoVenta.entity_api = 'api/puntoventas';
	beanRequestPuntoVenta.operation = 'paginate';
	beanRequestPuntoVenta.type_request = 'GET';
	//LISTAR
	processAjaxPuntoVenta();
	//
	$('#FrmPuntoVenta').submit(function(event) {
		beanRequestPuntoVenta.operation = 'paginate';
		beanRequestPuntoVenta.type_request = 'GET';
		processAjaxPuntoVenta();
		event.preventDefault();
		event.stopPropagation();
	});

	document.getElementById('FrmPuntoVentaModal').onsubmit = (event) => {
		if (metodo) {
			beanRequestPuntoVenta.operation = 'update';
			beanRequestPuntoVenta.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestPuntoVenta.operation = 'add';
			beanRequestPuntoVenta.type_request = 'POST';
		}

		if (validateFormPuntoVenta()) {
			processAjaxPuntoVenta();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	$('#sizePagePuntoVenta').change(function() {
		processAjaxPuntoVenta();
	});
});
function addPuntoVenta() {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombrePuntoVenta').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalPuntoVenta').innerHTML =
		'REGISTRAR PUNTO DE VENTA';
}

function processAjaxPuntoVenta() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Punto de Venta </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestPuntoVenta.operation == 'update' ||
		beanRequestPuntoVenta.operation == 'add'
	) {
		json = {
			nombre: document
				.querySelector('#txtNombrePuntoVenta')
				.value.toUpperCase(),
			establecimiento: null,
			almacen: null
		};
	}
	switch (beanRequestPuntoVenta.operation) {
		case 'delete':
			parameters_pagination = '/' + puntoVentaSelected.idpunto_venta;
			break;

		case 'update':
			json.idpunto_venta = puntoVentaSelected.idpunto_venta;
			break;
		case 'add':
			break;

		default:
			if (
				limpiar_campo(document.querySelector('#txtFilterPuntoVenta').value) !=
				''
			) {
				document.querySelector('#pagePuntoVenta').value = 1;
			}
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterPuntoVenta').value)
					.toLowerCase()
					.concat('1');
			parameters_pagination +=
				'&page=' + document.querySelector('#pagePuntoVenta').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePagePuntoVenta').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestPuntoVenta,
		json,
		parameters_pagination,
		'PuntoVenta'
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
			addPuntoVenta();
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationPuntoVenta = beanCrudResponse.beanPagination;
			toListPuntoVenta(beanPaginationPuntoVenta);
		}
		addPuntoVenta();
		beanRequestPuntoVenta.operation = 'paginate';
		beanRequestPuntoVenta.type_request = 'GET';
	};
}

function toListPuntoVenta(beanPagination) {
	document.querySelector('#tbodyPuntoVenta').innerHTML = '';
	document.querySelector('#titleManagerPuntoVenta').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PUNTO DE VENTAS';
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
		document.querySelector('#tbodyPuntoVenta').innerHTML += row;
		beanPagination.list.forEach((puntoVenta) => {
			row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<label for="${puntoVenta.idpunto_venta}" 
					class="dt-widget__subtitle text-truncate ">
					${puntoVenta.nombre}
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
					  id='${puntoVenta.idpunto_venta}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-puntoVenta"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-task-manager icon-1x"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-puntoVenta" idpuntoVenta='${puntoVenta.idpunto_venta}' 
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
				<!-- /widgets punto_venta -->
            `;
			document.querySelector('#tbodyPuntoVenta').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});

		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePagePuntoVenta').value),
			document.querySelector('#pagePuntoVenta'),
			processAjaxPuntoVenta,
			$('#paginationPuntoVenta')
		);
		addEventsPuntoVentas();
	} else {
		destroyPagination($('#paginationPuntoVenta'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
	}
}

function addEventsPuntoVentas() {
	document.querySelectorAll('.editar-puntoVenta').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			puntoVentaSelected = findByPuntoVenta(btn.getAttribute('id'));
			document.querySelectorAll('.dt-widget__subtitle').forEach((element) => {
				removeClass(element, 'text-strike');
			});
			if (puntoVentaSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombrePuntoVenta').value =
					puntoVentaSelected.nombre;
				document.querySelector('#TituloModalPuntoVenta').innerHTML =
					'EDITAR PUNTO DE VENTA';
				document.querySelector('#txtNombrePuntoVenta').focus();
				addClass(btn.labels[0], 'text-strike');
			} else {
				showAlertTopEnd(
					'warning',
					'No se encontró la puntoVenta para poder editar'
				);
			}
		};
	});
	document.querySelectorAll('.eliminar-puntoVenta').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			puntoVentaSelected = findByPuntoVenta(btn.getAttribute('idpuntoVenta'));
			beanRequestPuntoVenta.operation = 'delete';
			beanRequestPuntoVenta.type_request = 'DELETE';
			processAjaxPuntoVenta();
		};
	});
	document.querySelectorAll('.tooltip').forEach((btn) => {
		removeClass(btn, 'show');
		btn.innerHTML = '';
	});
}

function findByPuntoVenta(idpuntoVenta) {
	let puntoVenta_;
	beanPaginationPuntoVenta.list.forEach((puntoVenta) => {
		if (idpuntoVenta == puntoVenta.idpunto_venta) {
			puntoVenta_ = puntoVenta;
			return;
		}
	});
	return puntoVenta_;
}

function validateFormPuntoVenta() {
	if (
		limpiar_campo(document.querySelector('#txtNombrePuntoVenta').value) == ''
	) {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenPuntoVenta').focus();
		return false;
	}
	return true;
}
