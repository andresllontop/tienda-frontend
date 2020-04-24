/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationPersonalC;
var personalCSelected;
var beanRequestPersonalC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestPersonalC.entity_api = 'api/personal';
	beanRequestPersonalC.operation = 'paginate';
	beanRequestPersonalC.type_request = 'GET';
	/*CATEGORIA ADD*/

	addClass(document.getElementById('addPersonalHtml'), 'modal fade');
	document.getElementById('addPersonalHtml').style.zIndex = '1070';
	document.getElementById('addPersonalHtml').style.backgroundColor =
		'#1312129e';

	addClass(
		document.getElementById('addPersonalHtml').firstChild.nextElementSibling,
		'modal-dialog modal-sm modal-dialog-centered'
	);

	addClass(
		document.getElementById('addPersonalHtml').firstChild.nextElementSibling
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
		.getElementById('addPersonalHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewPersonalc').onclick = function() {
		let arrayDiv = document.getElementById('addPersonalHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-xl-4 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addPersonalHtml').modal('show');
	};

	document.getElementById('FrmPersonalModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestPersonalC.operation = 'add';
		beanRequestPersonalC.type_request = 'POST';

		if (validateFormPersonal()) {
			processAjaxPersonalC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmPersonalC').submit(function(event) {
		beanRequestPersonalC.operation = 'paginate';
		beanRequestPersonalC.type_request = 'GET';
		processAjaxPersonalC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedPersonalC').on('hidden.bs.modal', function() {
		beanRequestPersonalC.operation = 'paginate';
		beanRequestPersonalC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarPersonal').onclick = function() {
		if (personalSelected != undefined) {
			$('#ventanaModalSelectedPersonalC').modal('show');
		} else {
			processAjaxPersonalC();
			$('#ventanaModalSelectedPersonalC').modal('show');
		}
	};
});

function processAjaxPersonalC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Personal </i>'
	);
	let parameters_pagination = '';
	let json = '';

	switch (beanRequestPersonalC.operation) {
		case 'add':
			json = {
				nombre: document
					.querySelector('#txtNombrePersonal')
					.value.toUpperCase(),
				indice: parseInt(1)
			};
			break;

		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterPersonalC').value)
					.toLowerCase()
					.concat(1);
			parameters_pagination += '&page=1&size=5';

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestPersonalC,
		json,
		parameters_pagination,
		'Personal'
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
			beanPaginationPersonalC = beanCrudResponse.beanPagination;
			toListPersonalC(beanPaginationPersonalC);
		}
	};
}

function toListPersonalC(beanPagination) {
	document.querySelector('#tbodyPersonalC').innerHTML = '';
	document.querySelector('#titleManagerPersonalC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] CATEGORIAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((personal) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-personal form-control form-control-sm " type="checkbox" idpersonal="${
																	personal.idpersona
																}">
                                <label class="dt-checkbox-content" for="${
																	personal.idpersona
																}"">${getStringCapitalize(
				personal.nombre
			)}</label>
                            </div>
                            <!-- /tasks -->
			`;
			document.querySelector('#tbodyPersonalC').innerHTML += row;
		});

		addEventsPersonalCes();
		if (beanRequestPersonalC.operation == 'paginate') {
			document.querySelector('#txtFilterPersonalC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterPersonalC').focus();
	}
}

function addEventsPersonalCes() {
	document
		.querySelectorAll('.click-selection-personal')
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
					personalCSelected = findByPersonalC(this.getAttribute('idpersonal'));
				} else {
					personalCSelected = undefined;
				}

				if (personalCSelected != undefined) {
					personalSelected = personalCSelected;
					document.querySelector(
						'#txtPersonalProducto'
					).value = personalCSelected.nombre.toUpperCase();
					$('#ventanaModalSelectedPersonalC').modal('hide');
				}
			};
		});
}

function findByPersonalC(idpersonal) {
	let personal_;
	beanPaginationPersonalC.list.forEach((personal) => {
		if (parseInt(idpersonal) == parseInt(personal.idpersona)) {
			personal_ = personal;
			return;
		}
	});
	return personal_;
}
function validateFormPersonal() {
	if (limpiar_campo(document.querySelector('#txtNombrePersonal').value) == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenPersonal').focus();
		return false;
	}
	return true;
}
