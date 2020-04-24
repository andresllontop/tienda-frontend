/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationCategoriaC;
var categoriaCSelected;
var beanRequestCategoriaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestCategoriaC.entity_api = 'api/items';
	beanRequestCategoriaC.operation = 'paginate';
	beanRequestCategoriaC.type_request = 'GET';
	/*CATEGORIA ADD*/

	addClass(document.getElementById('addCategoriaHtml'), 'modal fade');
	document.getElementById('addCategoriaHtml').style.zIndex = '1070';
	document.getElementById('addCategoriaHtml').style.backgroundColor =
		'#1312129e';

	addClass(
		document.getElementById('addCategoriaHtml').firstChild.nextElementSibling,
		'modal-dialog modal-sm modal-dialog-centered'
	);

	addClass(
		document.getElementById('addCategoriaHtml').firstChild.nextElementSibling
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
		.getElementById('addCategoriaHtml')
		.firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
			parrafo
		);
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewCategoriac').onclick = function() {
		let arrayDiv = document.getElementById('addCategoriaHtml').firstChild
			.nextElementSibling.firstChild.nextElementSibling.lastChild
			.previousElementSibling.children;

		for (let index = 0; index < arrayDiv.length; index++) {
			removeClass(arrayDiv[index], 'col-xl-4 col-sm-6');
			addClass(arrayDiv[index], 'col-xl-12 text-center');
		}

		$('#addCategoriaHtml').modal('show');
	};

	document.getElementById('FrmCategoriaModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestCategoriaC.operation = 'add';
		beanRequestCategoriaC.type_request = 'POST';

		if (validateFormCategoria()) {
			processAjaxCategoriaC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmCategoriaC').submit(function(event) {
		beanRequestCategoriaC.operation = 'paginate';
		beanRequestCategoriaC.type_request = 'GET';
		processAjaxCategoriaC();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#ventanaModalSelectedCategoriaC').on('hidden.bs.modal', function() {
		beanRequestCategoriaC.operation = 'paginate';
		beanRequestCategoriaC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarCategoria').onclick = function() {
		if (categoriaSelected != undefined) {
			$('#ventanaModalSelectedCategoriaC').modal('show');
		} else {
			processAjaxCategoriaC();
			$('#ventanaModalSelectedCategoriaC').modal('show');
		}
	};
});

function processAjaxCategoriaC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Categoría </i>'
	);
	let parameters_pagination = '';
	let json = '';

	switch (beanRequestCategoriaC.operation) {
		case 'add':
			json = {
				nombre: document
					.querySelector('#txtNombreCategoria')
					.value.toUpperCase(),
				indice: parseInt(1)
			};
			break;

		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterCategoriaC').value)
					.toLowerCase()
					.concat(1);
			parameters_pagination += '&page=1&size=5';

			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestCategoriaC,
		json,
		parameters_pagination,
		'Categoria'
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
			beanPaginationCategoriaC = beanCrudResponse.beanPagination;
			toListCategoriaC(beanPaginationCategoriaC);
		}
	};
}

function toListCategoriaC(beanPagination) {
	document.querySelector('#tbodyCategoriaC').innerHTML = '';
	document.querySelector('#titleManagerCategoriaC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] CATEGORIAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((categoria) => {
			row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-categoria form-control form-control-sm " type="checkbox" idcategoria="${
																	categoria.iditem
																}">
                                <label class="dt-checkbox-content" for="${
																	categoria.iditem
																}"">${getStringCapitalize(
				categoria.nombre
			)}</label>
                            </div>
                            <!-- /tasks -->
			`;
			document.querySelector('#tbodyCategoriaC').innerHTML += row;
		});

		addEventsCategoriaCes();
		if (beanRequestCategoriaC.operation == 'paginate') {
			document.querySelector('#txtFilterCategoriaC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterCategoriaC').focus();
	}
}

function addEventsCategoriaCes() {
	document
		.querySelectorAll('.click-selection-categoria')
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
					categoriaCSelected = findByCategoriaC(
						this.getAttribute('idcategoria')
					);
				} else {
					categoriaCSelected = undefined;
				}

				if (categoriaCSelected != undefined) {
					categoriaSelected = categoriaCSelected;
					document.querySelector(
						'#txtCategoriaProducto'
					).value = categoriaCSelected.nombre.toUpperCase();
					$('#ventanaModalSelectedCategoriaC').modal('hide');
				}
			};
		});
}

function findByCategoriaC(idcategoria) {
	let categoria_;
	beanPaginationCategoriaC.list.forEach((categoria) => {
		if (parseInt(idcategoria) == parseInt(categoria.iditem)) {
			categoria_ = categoria;
			return;
		}
	});
	return categoria_;
}
function validateFormCategoria() {
	if (
		limpiar_campo(document.querySelector('#txtNombreCategoria').value) == ''
	) {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenCategoria').focus();
		return false;
	}
	return true;
}
