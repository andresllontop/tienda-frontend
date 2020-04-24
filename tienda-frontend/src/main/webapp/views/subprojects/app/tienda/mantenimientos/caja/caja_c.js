/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationCajaC;
var cajaCSelected;
var beanRequestCajaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestCajaC.entity_api = 'api/cajas';
	beanRequestCajaC.operation = 'paginate';
	beanRequestCajaC.type_request = 'GET';
	/*CAJA ADD*/

	addClass(document.getElementById('addCajaHtml'), 'modal fade');
	document.getElementById('addCajaHtml').style.zIndex = '1070';
	document.getElementById('addCajaHtml').style.backgroundColor = '#1312129e';

	addClass(
		document.getElementById('addCajaHtml').firstChild.nextElementSibling,
		'modal-dialog modal-sm modal-dialog-centered'
	);

	addClass(
		document.getElementById('addCajaHtml').firstChild.nextElementSibling
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
		.getElementById('addCajaHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewCajac').onclick = function() {
		let arrayDiv = document.getElementById('addCajaHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-xl-4 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addCajaHtml').modal('show');
	};

	document.getElementById('FrmCajaModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestCajaC.operation = 'add';
		beanRequestCajaC.type_request = 'POST';

		if (validateFormCaja()) {
			processAjaxCajaC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmCajaC').submit(function(event) {
		beanRequestCajaC.operation = 'paginate';
		beanRequestCajaC.type_request = 'GET';
		processAjaxCajaC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedCajaC').on('hidden.bs.modal', function() {
		beanRequestCajaC.operation = 'paginate';
		beanRequestCajaC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarCaja').onclick = function() {
		if (cajaSelected != undefined) {
			$('#ventanaModalSelectedCajaC').modal('show');
		} else {
			processAjaxCajaC();
			$('#ventanaModalSelectedCajaC').modal('show');
		}
	};
});

function processAjaxCajaC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Categoría </i>'
	);
	let parameters_pagination = '';
	let json = '';

	switch (beanRequestCajaC.operation) {
		case 'add':
			json = {
				nombre: document.querySelector('#txtNombreCaja').value.toUpperCase(),
				indice: parseInt(1)
			};
			break;

		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterCajaC').value)
					.toLowerCase()
					.concat(1);
			parameters_pagination += '&page=1&size=5';

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestCajaC, json, parameters_pagination, 'Caja');
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
			beanPaginationCajaC = beanCrudResponse.beanPagination;
			toListCajaC(beanPaginationCajaC);
		}
	};
}

function toListCajaC(beanPagination) {
	document.querySelector('#tbodyCajaC').innerHTML = '';
	document.querySelector('#titleManagerCajaC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] CAJAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((caja) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-caja form-control form-control-sm " type="checkbox" idcaja="${
																	caja.idcaja
																}">
                                <label class="dt-checkbox-content" for="${
																	caja.idcaja
																}"">${getStringCapitalize(caja.nombre)}</label>
                            </div>
                            <!-- /tasks -->
			`;
			document.querySelector('#tbodyCajaC').innerHTML += row;
		});

		addEventsCajaCes();
		if (beanRequestCajaC.operation == 'paginate') {
			document.querySelector('#txtFilterCajaC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterCajaC').focus();
	}
}

function addEventsCajaCes() {
	document.querySelectorAll('.click-selection-caja').forEach(function(element) {
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
				cajaCSelected = findByCajaC(this.getAttribute('idcaja'));
			} else {
				cajaCSelected = undefined;
			}

			if (cajaCSelected != undefined) {
				cajaSelected = cajaCSelected;
				document.querySelector(
					'#txtCajaProducto'
				).value = cajaCSelected.nombre.toUpperCase();
				$('#ventanaModalSelectedCajaC').modal('hide');
			}
		};
	});
}

function findByCajaC(idcaja) {
	let caja_;
	beanPaginationCajaC.list.forEach((caja) => {
		if (parseInt(idcaja) == parseInt(caja.idcaja)) {
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
