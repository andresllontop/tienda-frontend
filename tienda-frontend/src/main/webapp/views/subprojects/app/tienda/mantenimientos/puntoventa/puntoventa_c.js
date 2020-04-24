/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationPuntoVentaC;
var puntoVentaCSelected;
var beanRequestPuntoVentaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestPuntoVentaC.entity_api = 'api/puntoventas';
	beanRequestPuntoVentaC.operation = 'paginate';
	beanRequestPuntoVentaC.type_request = 'GET';
	/*PUNTO DE VENTA ADD*/

	addClass(document.getElementById('addPuntoVentaHtml'), 'modal fade');
	document.getElementById('addPuntoVentaHtml').style.zIndex = '1070';
	document.getElementById('addPuntoVentaHtml').style.backgroundColor =
		'#1312129e';

	addClass(
		document.getElementById('addPuntoVentaHtml').firstChild.nextElementSibling,
		'modal-dialog modal-sm modal-dialog-centered'
	);

	addClass(
		document.getElementById('addPuntoVentaHtml').firstChild.nextElementSibling
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
		.getElementById('addPuntoVentaHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewPuntoVentac').onclick = function() {
		let arrayDiv = document.getElementById('addPuntoVentaHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-xl-4 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addPuntoVentaHtml').modal('show');
	};

	document.getElementById('FrmPuntoVentaModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestPuntoVentaC.operation = 'add';
		beanRequestPuntoVentaC.type_request = 'POST';

		if (validateFormPuntoVenta()) {
			processAjaxPuntoVentaC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmPuntoVentaC').submit(function(event) {
		beanRequestPuntoVentaC.operation = 'paginate';
		beanRequestPuntoVentaC.type_request = 'GET';
		processAjaxPuntoVentaC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedPuntoVentaC').on('hidden.bs.modal', function() {
		beanRequestPuntoVentaC.operation = 'paginate';
		beanRequestPuntoVentaC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarPuntoVenta').onclick = function() {
		if (puntoVentaSelected != undefined) {
			$('#ventanaModalSelectedPuntoVentaC').modal('show');
		} else {
			processAjaxPuntoVentaC();
			$('#ventanaModalSelectedPuntoVentaC').modal('show');
		}
	};
});

function processAjaxPuntoVentaC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Categoría </i>'
	);
	let parameters_pagination = '';
	let json = '';

	switch (beanRequestPuntoVentaC.operation) {
		case 'add':
			json = {
				nombre: document
					.querySelector('#txtNombrePuntoVenta')
					.value.toUpperCase(),
				indice: parseInt(1)
			};
			break;

		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterPuntoVentaC').value)
					.toLowerCase()
					.concat(1);
			parameters_pagination += '&page=1&size=5';

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestPuntoVentaC,
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
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationPuntoVentaC = beanCrudResponse.beanPagination;
			toListPuntoVentaC(beanPaginationPuntoVentaC);
		}
	};
}

function toListPuntoVentaC(beanPagination) {
	document.querySelector('#tbodyPuntoVentaC').innerHTML = '';
	document.querySelector('#titleManagerPuntoVentaC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PUNTO DE VENTAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((puntoVenta) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-puntoVenta form-control form-control-sm " type="checkbox" idpuntoVenta="${
																	puntoVenta.idpunto_venta
																}">
                                <label class="dt-checkbox-content" for="${
																	puntoVenta.idpunto_venta
																}"">${getStringCapitalize(
				puntoVenta.nombre
			)}</label>
                            </div>
                            <!-- /tasks -->
			`;
			document.querySelector('#tbodyPuntoVentaC').innerHTML += row;
		});

		addEventsPuntoVentaCes();
		if (beanRequestPuntoVentaC.operation == 'paginate') {
			document.querySelector('#txtFilterPuntoVentaC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterPuntoVentaC').focus();
	}
}

function addEventsPuntoVentaCes() {
	document
		.querySelectorAll('.click-selection-puntoVenta')
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
					puntoVentaCSelected = findByPuntoVentaC(
						this.getAttribute('idpuntoVenta')
					);
				} else {
					puntoVentaCSelected = undefined;
				}

				if (puntoVentaCSelected != undefined) {
					puntoVentaSelected = puntoVentaCSelected;
					document.querySelector(
						'#txtPuntoVentaProducto'
					).value = puntoVentaCSelected.nombre.toUpperCase();
					$('#ventanaModalSelectedPuntoVentaC').modal('hide');
				}
			};
		});
}

function findByPuntoVentaC(idpuntoVenta) {
	let puntoVenta_;
	beanPaginationPuntoVentaC.list.forEach((puntoVenta) => {
		if (parseInt(idpuntoVenta) == parseInt(puntoVenta.idpunto_venta)) {
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
