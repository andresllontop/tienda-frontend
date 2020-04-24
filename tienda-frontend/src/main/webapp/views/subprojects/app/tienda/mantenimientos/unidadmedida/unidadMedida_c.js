/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationUnidadMedidaC;
var unidadMedidaCSelected;

var beanRequestUnidadMedidaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	/*UNIDAD MEDIDA ADD*/

	addClass(document.getElementById('addUnidadMedidaHtml'), 'modal fade');
	document.getElementById('addUnidadMedidaHtml').style.zIndex = '1051';
	document.getElementById('addUnidadMedidaHtml').style.backgroundColor =
		'#1312129e';

	addClass(
		document.getElementById('addUnidadMedidaHtml').firstChild
			.nextElementSibling,
		'modal-dialog modal-sm'
	);

	addClass(
		document.getElementById('addUnidadMedidaHtml').firstChild.nextElementSibling
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
		.getElementById('addUnidadMedidaHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector(
		'#btnSelecionarNewUnidadMedidac'
	).onclick = function() {
		let arrayDiv = document.getElementById('addUnidadMedidaHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-md-3 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addUnidadMedidaHtml').modal('show');
	};

	document.getElementById('FrmUnidadMedidaModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestUnidadMedidaC.operation = 'add';
		beanRequestUnidadMedidaC.type_request = 'POST';

		if (validateFormUnidadMedida()) {
			processAjaxUnidadMedidaC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestUnidadMedidaC.entity_api = 'api/unidadmedidas';
	beanRequestUnidadMedidaC.operation = 'paginate';
	beanRequestUnidadMedidaC.type_request = 'GET';

	$('#FrmUnidadMedidaC').submit(function(event) {
		beanRequestUnidadMedidaC.operation = 'paginate';
		beanRequestUnidadMedidaC.type_request = 'GET';
		processAjaxUnidadMedidaC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedUnidadMedidaC').on('hidden.bs.modal', function() {
		beanRequestUnidadMedidaC.operation = 'paginate';
		beanRequestUnidadMedidaC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarUnidadMedida').onclick = function() {
		if (unidadMedidaSelected != undefined) {
			$('#ventanaModalSelectedUnidadMedidaC').modal('show');
		} else {
			processAjaxUnidadMedidaC();
			$('#ventanaModalSelectedUnidadMedidaC').modal('show');
		}
	};
});

function processAjaxUnidadMedidaC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Unidad de Medida </i>'
	);
	let parameters_pagination = '';
	let json = '';
	switch (beanRequestUnidadMedidaC.operation) {
		case 'add':
			json = {
				nombre: document.querySelector('#txtNombreUnidadMedida').value.trim(),
				abreviatura: document
					.querySelector('#txtAbreviaturaUnidadMedida')
					.value.trim()
			};
			break;
		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(
					document.querySelector('#txtFilterUnidadMedidaC').value
				).toLowerCase();
			parameters_pagination += '&page=1&size=5';
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestUnidadMedidaC,
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
			beanPaginationUnidadMedidaC = beanCrudResponse.beanPagination;
			toListUnidadMedidaC(beanPaginationUnidadMedidaC);
		}
	};
}

function toListUnidadMedidaC(beanPagination) {
	document.querySelector('#tbodyUnidadMedidaC').innerHTML = '';
	document.querySelector('#titleManagerUnidadMedidaC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] UNIDAD DE MEDIDAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((unidadMedida) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-unidadMedida form-control form-control-sm" type="checkbox" idunidad_medida="${
																	unidadMedida.idunidad_medida
																}">
								<label class="dt-checkbox-content" for="${unidadMedida.idunidad_medida}">
								<span class="user-name">${getStringCapitalize(unidadMedida.nombre)}</span>
								<span class="dt-separator-v">&nbsp;</span>
								<span class="designation">${unidadMedida.abreviatura}</span>
								</label>
                            </div>
                            <!-- /tasks -->
			`;

			document.querySelector('#tbodyUnidadMedidaC').innerHTML += row;
		});

		addEventsUnidadMedidaCes();
		if (beanRequestUnidadMedidaC.operation == 'paginate') {
			document.querySelector('#txtFilterUnidadMedidaC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterUnidadMedidaC').focus();
	}
}

function addEventsUnidadMedidaCes() {
	document
		.querySelectorAll('.click-selection-unidadMedida')
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
					unidadMedidaCSelected = findByUnidadMedidaC(
						this.getAttribute('idunidad_medida')
					);
				} else {
					unidadMedidaCSelected = undefined;
				}

				if (unidadMedidaCSelected != undefined) {
					unidadMedidaSelected = unidadMedidaCSelected;
					document.querySelector(
						'#txtUnidadMedidaProducto'
					).value = unidadMedidaCSelected.nombre.toUpperCase();
					$('#ventanaModalSelectedUnidadMedidaC').modal('hide');
				}
			};
		});
}

function findByUnidadMedidaC(idunidad_medida) {
	let unidadMedida_;
	beanPaginationUnidadMedidaC.list.forEach((unidadMedida) => {
		if (parseInt(idunidad_medida) == parseInt(unidadMedida.idunidad_medida)) {
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
