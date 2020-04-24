var beanPaginationSerie;
var serieSelected;
var metodo = false;
var beanRequestSerie = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestSerie.entity_api = 'api/series';
	beanRequestSerie.operation = 'paginate';
	beanRequestSerie.type_request = 'GET';
	//LISTAR
	processAjaxSerie();
	//
	$('#FrmSerie').submit(function(event) {
		beanRequestSerie.operation = 'paginate';
		beanRequestSerie.type_request = 'GET';
		processAjaxSerie();
		event.preventDefault();
		event.stopPropagation();
	});

	document.getElementById('FrmSerieModal').onsubmit = (event) => {
		if (metodo) {
			beanRequestSerie.operation = 'update';
			beanRequestSerie.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestSerie.operation = 'add';
			beanRequestSerie.type_request = 'POST';
		}

		if (validateFormSerie()) {
			processAjaxSerie();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	$('#sizePageSerie').change(function() {
		processAjaxSerie();
	});
});
function addSerie(serie = undefined) {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtTipoDocumentoSerie').value =
		serie == undefined ? 1 : serie.tipo_documento;
	document.querySelector('#txtNumeroSerie').value =
		serie == undefined ? '' : serie.numero_serie;
	document.querySelector('#txtNumeroIncialSerie').value =
		serie == undefined ? '' : serie.numero_inicial;
	document.querySelector('#txtNumeroFinalSerie').value =
		serie == undefined ? '' : serie.numero_final;
	document.querySelector('#txtNumeroActualSerie').value =
		serie == undefined ? '' : serie.numero_actual;
}

function processAjaxSerie() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Punto de Venta </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestSerie.operation == 'update' ||
		beanRequestSerie.operation == 'add'
	)
		json = {
			tipo_documento: document.querySelector('#txtTipoDocumentoSerie').value,
			numero_serie: document.querySelector('#txtNumeroSerie').value,
			numero_inicial: document.querySelector('#txtNumeroIncialSerie').value,
			numero_final: document.querySelector('#txtNumeroFinalSerie').value,
			numero_actual: document.querySelector('#txtNumeroActualSerie').value
		};

	switch (beanRequestSerie.operation) {
		case 'delete':
			parameters_pagination = '/' + serieSelected.idserie;
			break;

		case 'update':
			json.idserie = serieSelected.idserie;
			break;
		case 'add':
			break;

		default:
			if (limpiar_campo(document.querySelector('#txtFilterSerie').value) != '')
				document.querySelector('#pageSerie').value = 1;
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(
					document.querySelector('#txtFilterSerie').value
				).toLowerCase();
			parameters_pagination +=
				'&page=' + document.querySelector('#pageSerie').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageSerie').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestSerie, json, parameters_pagination, 'Serie');

	xhr.onload = () => {
		hideProgress();
		beanCrudResponse = xhr.response;

		if (beanCrudResponse.messageServer !== undefined) {
			if (beanCrudResponse.messageServer.toLowerCase() == 'ok')
				showAlertTopEnd('success', 'Acción realizada exitosamente');
			else showAlertTopEnd('warning', beanCrudResponse.messageServer);
			document.querySelector('#TituloModalSerie').innerHTML = 'REGISTRAR SERIE';
			addSerie();
		}

		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationSerie = beanCrudResponse.beanPagination;
			toListSerie(beanPaginationSerie);
		}
		document.querySelector('#TituloModalSerie').innerHTML = 'REGISTRAR SERIE';
		addSerie();
		beanRequestSerie.operation = 'paginate';
		beanRequestSerie.type_request = 'GET';
	};
}

function toListSerie(beanPagination) {
	document.querySelector('#tbodySerie').innerHTML = '';
	document.querySelector('#titleManagerSerie').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] SERIES';
	if (beanPagination.count_filter > 0) {
		let row;
		row = `
               <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2"">
                    <!-- Widget Info -->
                    <div class="dt-widget__info" >
                        <p class="mb-0 text-truncate ">
                           TIPO DE DOCUMENTO
                        </p>
                    </div>
					<!-- /widget info -->
					<!-- Widget Info -->
                    <div class="dt-widget__info" >
                        <p class="mb-0 text-truncate ">
                           NÚMERO SERIE
                        </p>
                    </div>
					<!-- /widget info -->
					<!-- Widget Info -->
                    <div class="dt-widget__info" >
                        <p class="mb-0 text-truncate ">
                           NÚMERO INICIAL
                        </p>
                    </div>
					<!-- /widget info -->
					<!-- Widget Info -->
                    <div class="dt-widget__info" >
                        <p class="mb-0 text-truncate ">
                           NÚMERO FINAL
                        </p>
                    </div>
					<!-- /widget info -->
					<!-- Widget Info -->
                    <div class="dt-widget__info" >
                        <p class="mb-0 text-truncate ">
                           NÚMERO ACTUAL
                        </p>
                    </div>
					<!-- /widget info -->
					
                </div>
            `;
		document.querySelector('#tbodySerie').innerHTML += row;
		beanPagination.list.forEach((serie) => {
			row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<p	class="dt-widget__subtitle text-truncate">
					${TipoDocumentoSerie(serie.tipo_documento)}
					</p >
				  </div>
				  <!-- /widget info -->
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<p
					class="dt-widget__subtitle text-truncate">
					${serie.numero_serie}
					</p >
				  </div>
				  <!-- /widget info -->
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<p
					class="dt-widget__subtitle text-truncate">
					${serie.numero_inicial}
					</p >
				  </div>
				  <!-- /widget info -->
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<p
					class="dt-widget__subtitle text-truncate">
					${serie.numero_final}
					</p >
				  </div>
				  <!-- /widget info -->
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<p 
					class="dt-widget__subtitle text-truncate">
					${serie.numero_actual}
					</p >
				  </div>
				  <!-- /widget info -->
		  
				  <!-- Widget Extra -->
				  <div class="dt-widget__extra animate-slide align-self-center">
				   <div class="hide-content">

					<!-- Action Button Group -->
					<div class="action-btn-group">
					  <button
					  id='${serie.idserie}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-serie"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-editors icon-sm pulse-success"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-serie" idserie='${
							serie.idserie
						}' 
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Eliminar</em>"
					  >
						<i class="icon icon-trash-filled icon-sm pulse-danger"></i>
					  </button>

					  </div>
					<!-- /action button group -->
				 
				  </div>
				  <!-- /widget extra -->

				</div>
				<!-- /widgets serie -->
            `;
			document.querySelector('#tbodySerie').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});

		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageSerie').value),
			document.querySelector('#pageSerie'),
			processAjaxSerie,
			$('#paginationSerie')
		);
		addEventsSeries();
	} else {
		destroyPagination($('#paginationSerie'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
	}
}

function addEventsSeries() {
	document.querySelectorAll('.editar-serie').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			console.log(
				btn.parentElement.parentElement.parentElement.parentElement
					.parentElement
			);
			let lista = btn.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName(
				'dt-widget__subtitle'
			);
			serieSelected = findBySerie(btn.getAttribute('id'));
			document.querySelectorAll('.dt-widget__subtitle').forEach((element) => {
				removeClass(element, 'text-strike');
			});
			if (serieSelected != undefined) {
				metodo = true;
				addSerie(serieSelected);
				document.querySelector('#TituloModalSerie').innerHTML = 'EDITAR SERIE';
				document.querySelector('#txtNumeroSerie').focus();
				for (let index = 0; index < lista.length; index++) {
					addClass(lista[index], 'text-strike');
				}
			} else {
				showAlertTopEnd('warning', 'No se encontró la serie para poder editar');
			}
		};
	});
	document.querySelectorAll('.eliminar-serie').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			serieSelected = findBySerie(btn.getAttribute('idserie'));
			beanRequestSerie.operation = 'delete';
			beanRequestSerie.type_request = 'DELETE';
			processAjaxSerie();
		};
	});
	document.querySelectorAll('.tooltip').forEach((btn) => {
		removeClass(btn, 'show');
		btn.innerHTML = '';
	});
}

function findBySerie(idserie) {
	let serie_;
	beanPaginationSerie.list.forEach((serie) => {
		if (idserie == serie.idserie) {
			serie_ = serie;
			return;
		}
	});
	return serie_;
}

function validateFormSerie() {
	let numero = numero_campo(
		document.querySelector('#txtTipoDocumentoSerie'),
		document.querySelector('#txtNumeroActualSerie'),
		document.querySelector('#txtNumeroIncialSerie'),
		document.querySelector('#txtNumeroFinalSerie')
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
				'Por favor ingrese sólo números al campo ' + numero.labels[0].innerText
			);

		return false;
	}
	return true;
}

function TipoDocumentoSerie(valor) {
	if (1 > parseInt(valor) || parseInt(valor) > 5) {
		showAlertTopEnd('warning', 'No se encuentra el tipo de documento');
		return;
	}
	switch (parseInt(valor)) {
		case 1:
			return 'BOLETA';

		case 2:
			return 'FACTURA';
		case 3:
			return 'TICKET';

		default:
			return 'OTRO';
	}
}
