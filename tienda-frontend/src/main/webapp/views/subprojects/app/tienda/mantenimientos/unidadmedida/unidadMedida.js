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
		event.preventDefault();
		event.stopPropagation();
		document.querySelector('#txtFilterUnidadMedida').value = limpiar_campo(
			document.querySelector('#txtFilterUnidadMedida').value
		);
		processAjaxUnidadMedida();
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
			processAjaxUnidadMedida();
		}
		event.preventDefault();
		event.stopPropagation();
	});

	processAjaxUnidadMedida();

	$('#sizePageUnidadMedida').change(function() {
		processAjaxUnidadMedida();
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
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Unidad de Medida </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestUnidadMedida.operation == 'update' ||
		beanRequestUnidadMedida.operation == 'add'
	) {
		json = {
			nombre: document.querySelector('#txtNombreUnidadMedida').value.trim(),
			abreviatura: document
				.querySelector('#txtAbreviaturaUnidadMedida')
				.value.trim()
		};
	}
	switch (beanRequestUnidadMedida.operation) {
		case 'delete':
			parameters_pagination = '/' + unidadMedidaSelected.idunidad_medida;
			break;

		case 'update':
			json.idunidad_medida = unidadMedidaSelected.idunidad_medida;
			break;
		case 'add':
			break;

		default:
			if (document.querySelector('#txtFilterUnidadMedida').value != '') {
				document.querySelector('#pageUnidadMedida').value = 1;
			}
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(
					document.querySelector('#txtFilterUnidadMedida').value
				).toLowerCase();
			parameters_pagination +=
				'&page=' + document.querySelector('#pageUnidadMedida').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageUnidadMedida').value;
			break;
	}

	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestUnidadMedida,
		json,
		parameters_pagination,
		'Unidad'
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
			beanPaginationUnidadMedida = beanCrudResponse.beanPagination;
			toListUnidadMedida(beanPaginationUnidadMedida);
		}
	};
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
            <p class="mb-0 text-truncate " style="border-right:0.1em solid">
               NOMBRE
            </p>
        </div>
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               ABREVIATURA
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
			<div class="dt-widget__extra text-left">
                        <!-- Hide Content -->
                        <div class="hide-content">
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
                        <!-- /hide content -->
                      </div>
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" style="border-right:0.1em solid">
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
			processAjaxUnidadMedida,
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
	let letra = letra_campo(
		document.querySelector('#txtNombreUnidadMedida'),
		document.querySelector('#txtAbreviaturaUnidadMedida')
	);

	if (letra != undefined) {
		letra.focus();
		letra.labels[0].style.fontWeight = '600';
		addClass(letra.labels[0], 'text-danger');
		if (letra.value == '') {
			showAlertTopEnd('info', 'Por favor ingrese ' + letra.labels[0].innerText);
		} else {
			showAlertTopEnd(
				'info',
				'Por favor ingrese solo Letras al campo ' + letra.labels[0].innerText
			);
		}

		return false;
	}
	return true;
}
