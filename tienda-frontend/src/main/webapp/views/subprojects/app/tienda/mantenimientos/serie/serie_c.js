/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationSerieC;
var serieCSelected;
var beanRequestSerieC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestSerieC.entity_api = 'api/series';
	beanRequestSerieC.operation = 'paginate';
	beanRequestSerieC.type_request = 'GET';
	/*SERIE ADD*/

	addClass(document.getElementById('addSerieHtml'), 'modal fade');
	document.getElementById('addSerieHtml').style.zIndex = '1070';
	document.getElementById('addSerieHtml').style.backgroundColor = '#1312129e';

	addClass(
		document.getElementById('addSerieHtml').firstChild.nextElementSibling,
		'modal-dialog modal-sm modal-dialog-centered'
	);

	addClass(
		document.getElementById('addSerieHtml').firstChild.nextElementSibling
			.firstChild.nextElementSibling,
		'modal-content'
	);
	/* AGREGAR BOTON X PARA CERRAR */
	let parrafo = document.createElement('div');
	let row = ` 
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">×</span>
		</button>
		`;

	parrafo.innerHTML = row;
	document
		.getElementById('addSerieHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewSeriec').onclick = function() {
		let arrayDiv = document.getElementById('addSerieHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-xl-4 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addSerieHtml').modal('show');
	};

	document.getElementById('FrmSerieModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestSerieC.operation = 'add';
		beanRequestSerieC.type_request = 'POST';

		if (validateFormSerie()) {
			processAjaxSerieC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmSerieC').submit(function(event) {
		beanRequestSerieC.operation = 'paginate';
		beanRequestSerieC.type_request = 'GET';
		processAjaxSerieC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedSerieC').on('hidden.bs.modal', function() {
		beanRequestSerieC.operation = 'paginate';
		beanRequestSerieC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarSerie').onclick = function() {
		if (serieSelected != undefined) {
			$('#ventanaModalSelectedSerieC').modal('show');
		} else {
			processAjaxSerieC();
			$('#ventanaModalSelectedSerieC').modal('show');
		}
	};
});

function processAjaxSerieC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Categoría </i>'
	);
	let parameters_pagination = '';
	let json = '';

	switch (beanRequestSerieC.operation) {
		case 'add':
			json = {
				nombre: document.querySelector('#txtNombreSerie').value.toUpperCase(),
				indice: parseInt(1)
			};
			break;

		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterSerieC').value)
					.toLowerCase()
					.concat(1);
			parameters_pagination += '&page=1&size=5';

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestSerieC, json, parameters_pagination, 'Serie');
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
			beanPaginationSerieC = beanCrudResponse.beanPagination;
			toListSerieC(beanPaginationSerieC);
		}
	};
}

function toListSerieC(beanPagination) {
	document.querySelector('#tbodySerieC').innerHTML = '';
	document.querySelector('#titleManagerSerieC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] SERIES';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((serie) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-serie form-control form-control-sm " type="checkbox" idserie="${
																	serie.idserie
																}">
                                <label class="dt-checkbox-content" for="${
																	serie.idserie
																}"">${getStringCapitalize(serie.nombre)}</label>
                            </div>
                            <!-- /tasks -->
			`;
			document.querySelector('#tbodySerieC').innerHTML += row;
		});

		addEventsSerieCes();
		if (beanRequestSerieC.operation == 'paginate') {
			document.querySelector('#txtFilterSerieC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterSerieC').focus();
	}
}

function addEventsSerieCes() {
	document
		.querySelectorAll('.click-selection-serie')
		.forEach(function(element) {
			element.onclick = function() {
				if (this.checked) {
					for (
						let index = 0;
						index < this.parentElement.parentElement.children.length;
						index++
					) {
						this.parentElement.parentElement.children[
							index
						].children[0].checked = false;
					}
					this.checked = true;
					serieCSelected = findBySerieC(this.getAttribute('idserie'));
				} else {
					serieCSelected = undefined;
				}

				if (serieCSelected != undefined) {
					serieSelected = serieCSelected;
					document.querySelector(
						'#txtSerieProducto'
					).value = serieCSelected.nombre.toUpperCase();
					$('#ventanaModalSelectedSerieC').modal('hide');
				}
			};
		});
}

function findBySerieC(idserie) {
	let serie_;
	beanPaginationSerieC.list.forEach((serie) => {
		if (parseInt(idserie) == parseInt(serie.idserie)) {
			serie_ = serie;
			return;
		}
	});
	return serie_;
}
function validateFormSerie() {
	if (limpiar_campo(document.querySelector('#txtNombreSerie').value) == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenSerie').focus();
		return false;
	}
	return true;
}
