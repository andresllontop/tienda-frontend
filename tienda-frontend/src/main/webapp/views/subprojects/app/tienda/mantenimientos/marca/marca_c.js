/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationMarcaC;
var marcaCSelected;
var beanRequestMarcaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestMarcaC.entity_api = 'api/items';
	beanRequestMarcaC.operation = 'paginate';
	beanRequestMarcaC.type_request = 'GET';
	/*MARCA ADD*/

	addClass(document.getElementById('addMarcaHtml'), 'modal fade');
	document.getElementById('addMarcaHtml').style.zIndex = '1051';
	document.getElementById('addMarcaHtml').style.backgroundColor = '#1312129e';

	addClass(
		document.getElementById('addMarcaHtml').firstChild.nextElementSibling,
		'modal-dialog modal-sm modal-dialog-centered'
	);

	addClass(
		document.getElementById('addMarcaHtml').firstChild.nextElementSibling
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
		.getElementById('addMarcaHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewMarcac').onclick = function() {
		let arrayDiv = document.getElementById('addMarcaHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-xl-4 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addMarcaHtml').modal('show');
	};

	document.getElementById('FrmMarcaModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestMarcaC.operation = 'add';
		beanRequestMarcaC.type_request = 'POST';

		if (validateFormMarca()) {
			processAjaxMarcaC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmMarcaC').submit(function(event) {
		beanRequestMarcaC.operation = 'paginate';
		beanRequestMarcaC.type_request = 'GET';
		processAjaxMarcaC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedMarcaC').on('hidden.bs.modal', function() {
		beanRequestMarcaC.operation = 'paginate';
		beanRequestMarcaC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarMarca').onclick = function() {
		if (marcaSelected != undefined) {
			$('#ventanaModalSelectedMarcaC').modal('show');
		} else {
			processAjaxMarcaC();
			$('#ventanaModalSelectedMarcaC').modal('show');
		}
	};
});

function processAjaxMarcaC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Marca </i>'
	);
	let parameters_pagination = '';
	let json = '';
	switch (beanRequestMarcaC.operation) {
		case 'add':
			json = {
				nombre: document.querySelector('#txtNombreMarca').value.toUpperCase(),
				indice: parseInt(2)
			};
			break;

		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterMarcaC').value)
					.toLowerCase()
					.concat(2);
			parameters_pagination += '&page=1&size=5';

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestMarcaC, json, parameters_pagination, 'Marca');

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
			beanPaginationMarcaC = beanCrudResponse.beanPagination;
			toListMarcaC(beanPaginationMarcaC);
		}
	};
}

function toListMarcaC(beanPagination) {
	document.querySelector('#tbodyMarcaC').innerHTML = '';
	document.querySelector('#titleManagerMarcaC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] MARCAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((marca) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-marca form-control form-control-sm " type="checkbox" idmarca="${
																	marca.iditem
																}">
                                <label class="dt-checkbox-content" for="${
																	marca.iditem
																}"">${getStringCapitalize(marca.nombre)}</label>
                            </div>
                            <!-- /tasks -->
			`;
			document.querySelector('#tbodyMarcaC').innerHTML += row;
		});

		addEventsMarcaCes();
		if (beanRequestMarcaC.operation == 'paginate') {
			document.querySelector('#txtFilterMarcaC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterMarcaC').focus();
	}
}

function addEventsMarcaCes() {
	document
		.querySelectorAll('.click-selection-marca')
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
					marcaCSelected = findByMarcaC(this.getAttribute('idmarca'));
				} else {
					marcaCSelected = undefined;
				}

				if (marcaCSelected != undefined) {
					marcaSelected = marcaCSelected;
					document.querySelector(
						'#txtMarcaProducto'
					).value = marcaCSelected.nombre.toUpperCase();
					$('#ventanaModalSelectedMarcaC').modal('hide');
				}
			};
		});
}

function findByMarcaC(idmarca) {
	let marca_;
	beanPaginationMarcaC.list.forEach((marca) => {
		if (parseInt(idmarca) == parseInt(marca.iditem)) {
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
