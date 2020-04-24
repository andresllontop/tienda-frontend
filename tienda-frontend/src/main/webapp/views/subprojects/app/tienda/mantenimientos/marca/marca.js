var beanPaginationMarca;
var marcaSelected;
var metodo = false;
var beanRequestMarca = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//invocar funcion agregar

	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestMarca.entity_api = 'api/items';
	beanRequestMarca.operation = 'paginate';
	beanRequestMarca.type_request = 'GET';

	$('#FrmMarca').submit(function(event) {
		beanRequestMarca.operation = 'paginate';
		beanRequestMarca.type_request = 'GET';
		processAjaxMarca();
		event.preventDefault();
		event.stopPropagation();
	});

	document.getElementById('FrmMarcaModal').onsubmit = (event) => {
		if (metodo) {
			beanRequestMarca.operation = 'update';
			beanRequestMarca.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestMarca.operation = 'add';
			beanRequestMarca.type_request = 'POST';
		}

		if (validateFormMarca()) {
			processAjaxMarca();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	processAjaxMarca();

	$('#sizePageMarca').change(function() {
		processAjaxMarca();
	});
});
function addMarca() {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombreMarca').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalMarca').innerHTML = 'REGISTRAR MARCA';
}

function processAjaxMarca() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Marca </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestMarca.operation == 'update' ||
		beanRequestMarca.operation == 'add'
	) {
		json = {
			nombre: document.querySelector('#txtNombreMarca').value.toUpperCase(),
			indice: parseInt(2)
		};
	}
	switch (beanRequestMarca.operation) {
		case 'delete':
			parameters_pagination = '/' + marcaSelected.iditem;
			break;

		case 'update':
			json.iditem = marcaSelected.iditem;
			break;
		case 'add':
			break;

		default:
			if (
				limpiar_campo(document.querySelector('#txtFilterMarca').value) != ''
			) {
				document.querySelector('#pageMarca').value = 1;
			}
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterMarca').value)
					.toLowerCase()
					.concat(2);
			parameters_pagination +=
				'&page=' + document.querySelector('#pageMarca').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageMarca').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestMarca, json, parameters_pagination, 'Marca');

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
			beanPaginationMarca = beanCrudResponse.beanPagination;
			toListMarca(beanPaginationMarca);
		}
		addMarca();
		beanRequestMarca.operation = 'paginate';
		beanRequestMarca.type_request = 'GET';
	};
}

function toListMarca(beanPagination) {
	document.querySelector('#tbodyMarca').innerHTML = '';
	document.querySelector('#titleManagerMarca').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] MARCAS';
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
		document.querySelector('#tbodyMarca').innerHTML += row;
		beanPagination.list.forEach((marca) => {
			row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<label for="${marca.iditem}" 
					class="dt-widget__subtitle text-truncate ">
					${marca.nombre}
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
					  id='${marca.iditem}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-marca"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-task-manager icon-1x"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-marca" idmarca='${marca.iditem}' 
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
				<!-- /widgets item -->
            `;
			document.querySelector('#tbodyMarca').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});

		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageMarca').value),
			document.querySelector('#pageMarca'),
			processAjaxMarca,
			$('#paginationMarca')
		);
		addEventsMarcas();
	} else {
		destroyPagination($('#paginationMarca'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
	}
}

function addEventsMarcas() {
	document.querySelectorAll('.editar-marca').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			marcaSelected = findByMarca(btn.getAttribute('id'));
			document.querySelectorAll('.dt-widget__subtitle').forEach((element) => {
				removeClass(element, 'text-strike');
			});
			if (marcaSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombreMarca').value = marcaSelected.nombre;
				document.querySelector('#TituloModalMarca').innerHTML = 'EDITAR MARCA';
				document.querySelector('#txtNombreMarca').focus();
				addClass(btn.labels[0], 'text-strike');
			} else {
				showAlertTopEnd('warning', 'No se encontró la marca para poder editar');
			}
		};
	});
	document.querySelectorAll('.eliminar-marca').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			marcaSelected = findByMarca(btn.getAttribute('idmarca'));
			beanRequestMarca.operation = 'delete';
			beanRequestMarca.type_request = 'DELETE';
			processAjaxMarca();
		};
	});
	document.querySelectorAll('.tooltip').forEach((btn) => {
		removeClass(btn, 'show');
		btn.innerHTML = '';
	});
}

function findByMarca(idmarca) {
	let marca_;
	beanPaginationMarca.list.forEach((marca) => {
		if (idmarca == marca.iditem) {
			marca_ = marca;
			return;
		}
	});
	return marca_;
}

function validateFormMarca() {
	if (limpiar_campo(document.querySelector('#txtNombreMarca').value) == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenMarca').focus();
		return false;
	}
	return true;
}
