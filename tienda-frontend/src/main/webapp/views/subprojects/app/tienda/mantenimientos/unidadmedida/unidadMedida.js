var beanPaginationUnidadMedida;
var unidadMedidaSelected;
var metodo = false;
var beanRequestUnidadMedida = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//invocar funcion agregar
	addUnidadMedida();

	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestUnidadMedida.entity_api = 'api/unidadmedidas';
	beanRequestUnidadMedida.operation = 'paginate';
	beanRequestUnidadMedida.type_request = 'GET';

	$('#FrmUnidadMedida').submit(function(event) {
		beanRequestUnidadMedida.operation = 'paginate';
		beanRequestUnidadMedida.type_request = 'GET';
		$('#modalCargandoUnidadMedida').modal('show');
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmUnidadMedidaModal').submit(function(event) {
		if (metodo) {
			beanRequestUnidadMedida.operation = 'update';
			beanRequestUnidadMedida.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestUnidadMedida.operation = 'add';
			beanRequestUnidadMedida.type_request = 'POST';
		}
		if (validateFormUnidadMedida()) {
			$('#modalCargandoUnidadMedida').modal('show');
		}
		event.preventDefault();
		event.stopPropagation();
	});

	$('#modalCargandoUnidadMedida').on('shown.bs.modal', function() {
		processAjaxUnidadMedida();
		addUnidadMedida();
	});

	$('#modalCargandoUnidadMedida').on('hidden.bs.modal', function() {
		beanRequestUnidadMedida.operation = 'paginate';
		beanRequestUnidadMedida.type_request = 'GET';
	});

	$('#modalCargandoUnidadMedida').modal('show');

	$('#sizePageUnidadMedida').change(function() {
		$('#modalCargandoUnidadMedida').modal('show');
	});
});
function addUnidadMedida() {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombreUnidadMedida').value = '';
	document.querySelector('#txtAbreviaturaUnidadMedida').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalUnidadMedida').innerHTML =
		'REGISTRAR UNIDAD DE MEDIDA';
}

function processAjaxUnidadMedida() {
	let parameters_pagination = '';
	let json = '';
	if (beanRequestUnidadMedida.operation == 'paginate') {
		if (document.querySelector('#txtFilterUnidadMedida').value != '') {
			document.querySelector('#pageUnidadMedida').value = 1;
		}
		parameters_pagination +=
			'?nombre=' +
			document
				.querySelector('#txtFilterUnidadMedida')
				.value.toUpperCase()
				.trim();
		parameters_pagination +=
			'&page=' + document.querySelector('#pageUnidadMedida').value;
		parameters_pagination +=
			'&size=' + document.querySelector('#sizePageUnidadMedida').value;
	} else {
		parameters_pagination = '';
		if (beanRequestUnidadMedida.operation == 'delete') {
			parameters_pagination = '/' + unidadMedidaSelected.idunidad_medida;
		} else {
			json = {
				nombre: document.querySelector('#txtNombreUnidadMedida').value.trim(),
				abreviatura: document
					.querySelector('#txtAbreviaturaUnidadMedida')
					.value.trim()
			};
			if (beanRequestUnidadMedida.operation == 'update') {
				json.idunidad_medida = unidadMedidaSelected.idunidad_medida;
			}
		}
	}
	$.ajax({
		url:
			getHostAPI() +
			beanRequestUnidadMedida.entity_api +
			'/' +
			beanRequestUnidadMedida.operation +
			parameters_pagination,
		type: beanRequestUnidadMedida.type_request,
		headers: {
			Authorization: 'Bearer ' + Cookies.get('tienda_token')
		},
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			$('#modalCargandoUnidadMedida').modal('hide');
			if (beanCrudResponse.messageServer !== undefined) {
				if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
					showAlertTopEnd('success', 'Acción realizada exitosamente');
				} else {
					showAlertTopEnd('warning', beanCrudResponse.messageServer);
				}
			}
			if (beanCrudResponse.beanPagination !== undefined) {
				beanPaginationUnidadMedida = beanCrudResponse.beanPagination;
				toListUnidadMedida(beanPaginationUnidadMedida);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoUnidadMedida').modal('hide');
			showAlertErrorRequest();
		});
}

function toListUnidadMedida(beanPagination) {
	document.querySelector('#tbodyUnidadMedida').innerHTML = '';
	document.querySelector('#titleManagerUnidadMedida').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] UNIDADES DE MEDIDA';
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
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate text-center">
               ABREVIATURA
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate text-right">
               ACCIÓN
            </p>
        </div>
        <!-- /widget info -->
        
    </div>
            `;
		document.querySelector('#tbodyUnidadMedida').innerHTML += row;
		beanPagination.list.forEach((unidadMedida) => {
			row = `
            <!-- Widget Item -->
            <div class="dt-widget__item">
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${unidadMedida.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${unidadMedida.abreviatura}
                </p>
              </div>
              <!-- /widget info -->
      
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
                <!-- Action Button Group -->
                <div class="action-btn-group">
                  <button
                  idunidadMedida='${unidadMedida.idunidad_medida}'
                    type="button"
                    class="btn btn-default text-success dt-fab-btn editar-unidadMedida"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-task-manager icon-1x"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-unidadMedida" idunidadMedida='${unidadMedida.idunidad_medida}' 
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
              <!-- /widget extra -->
            </div>
            <!-- /widgets item -->
            `;
			document.querySelector('#tbodyUnidadMedida').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});
		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageUnidadMedida').value),
			document.querySelector('#pageUnidadMedida'),
			$('#modalCargandoUnidadMedida'),
			$('#paginationUnidadMedida')
		);
		addEventsUnidadMedidas();
		if (beanRequestUnidadMedida.operation == 'paginate') {
			document.querySelector('#txtFilterUnidadMedida').focus();
		}
	} else {
		destroyPagination($('#paginationUnidadMedida'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterUnidadMedida').focus();
	}
}

function addEventsUnidadMedidas() {
	document.querySelectorAll('.editar-unidadMedida').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			unidadMedidaSelected = findByUnidadMedida(
				btn.getAttribute('idunidadMedida')
			);
			if (unidadMedidaSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombreUnidadMedida').value =
					unidadMedidaSelected.nombre;
				document.querySelector('#txtAbreviaturaUnidadMedida').value =
					unidadMedidaSelected.abreviatura;
				document.querySelector('#TituloModalUnidadMedida').innerHTML =
					'EDITAR UNIDAD DE MEDIDA';
				document.querySelector('#txtNombreUnidadMedida').focus();
			} else {
				showAlertTopEnd(
					'warning',
					'No se encontró la Unidad de Medida para poder editar'
				);
			}
		};
	});
	document.querySelectorAll('.eliminar-unidadMedida').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			unidadMedidaSelected = findByUnidadMedida(
				btn.getAttribute('idunidadMedida')
			);
			beanRequestUnidadMedida.operation = 'delete';
			beanRequestUnidadMedida.type_request = 'DELETE';
			processAjaxUnidadMedida();
		};
	});
}

function findByUnidadMedida(idunidadMedida) {
	let unidadMedida_;
	beanPaginationUnidadMedida.list.forEach((unidadMedida) => {
		if (idunidadMedida == unidadMedida.idunidad_medida) {
			unidadMedida_ = unidadMedida;
			return;
		}
	});
	return unidadMedida_;
}

function validateFormUnidadMedida() {
	if (document.querySelector('#txtNombreUnidadMedida').value == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombreUnidadMedida').focus();
		return false;
	} else if (
		document.querySelector('#txtAbreviaturaUnidadMedida').value == ''
	) {
		showAlertTopEnd('warning', 'Por favor ingrese abreviatura');
		document.querySelector('#txtAbreviaturaUnidadMedida').focus();
		return false;
	}
	return true;
}
