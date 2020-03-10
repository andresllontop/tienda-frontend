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
	beanRequestCategoriaC.entity_api = 'api/categorias';
	beanRequestCategoriaC.operation = 'paginate';
	beanRequestCategoriaC.type_request = 'GET';

	$('#FrmCategoriaC').submit(function(event) {
		beanRequestCategoriaC.operation = 'paginate';
		beanRequestCategoriaC.type_request = 'GET';
		$('#modalCargandoSelectedCategoriaC').modal('show');
		event.preventDefault();
		event.stopPropagation();
	});

	$('#modalCargandoSelectedCategoriaC').on('shown.bs.modal', function() {
		processAjaxCategoriaC();
	});

	$('#ventanaModalSelectedCategoriaC').on('shown.bs.modal', function() {
		$('#modalCargandoSelectedCategoriaC').modal('show');
	});

	$('#ventanaModalSelectedCategoriaC').on('hidden.bs.modal', function() {
		beanRequestCategoriaC.operation = 'paginate';
		beanRequestCategoriaC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarCategoria').onclick = function() {
		$('#ventanaModalSelectedCategoriaC').modal('show');
	};

	document.querySelector('#btn-selecionar-categoriac').onclick = function() {
		if (categoriaCSelected == undefined) {
			showAlertTopEnd('warning', 'Por favor seleccione un categoria');
			return;
		}
		categoriaSelected = categoriaCSelected;
		document.querySelector(
			'#txtCategoriaProducto'
		).value = categoriaCSelected.nombre.toUpperCase();
		$('#ventanaModalSelectedCategoriaC').modal('hide');
	};

	document.querySelector('#btnCancelSelectionCategoriaC').onclick = function() {
		categoriaCSelected = undefined;
		categoriaSelected = categoriaCSelected;
		document.querySelector('#txtCategoriaProducto').value = '';
	};

	$('#sizePageCategoriaC').change(function() {
		$('#modalCargandoSelectedCategoriaC').modal('show');
	});
});

function processAjaxCategoriaC() {
	let parameters_pagination = '';
	let json = '';
	let url_request =
		getHostAPI() +
		beanRequestCategoriaC.entity_api +
		'/' +
		beanRequestCategoriaC.operation;
	switch (beanRequestCategoriaC.operation) {
		default:
			parameters_pagination +=
				'?nombre=' +
				document.querySelector('#txtFilterCategoriaC').value.toUpperCase();
			parameters_pagination +=
				'&page=' + document.querySelector('#pageCategoriaC').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageCategoriaC').value;
			url_request += parameters_pagination;
			break;
	}
	$.ajax({
		url: url_request,
		type: beanRequestCategoriaC.type_request,
		headers: {
			Authorization: 'Bearer ' + Cookies.get('tienda_token')
		},
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			$('#modalCargandoSelectedCategoriaC').modal('hide');
			if (beanCrudResponse.beanPagination !== undefined) {
				beanPaginationCategoriaC = beanCrudResponse.beanPagination;
				toListCategoriaC(beanPaginationCategoriaC);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoSelectedCategoriaC').modal('hide');
			showAlertErrorRequest();
		});
}

function toListCategoriaC(beanPagination) {
	document.querySelector('#tbodyCategoriaC').innerHTML = '';
	document.querySelector('#titleManagerCategoriaC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] CATEGORIAS';
	if (beanPagination.count_filter > 0) {
		let row;
		beanPagination.list.forEach((categoria) => {
			row =
				"<tr class='click-selection-categoria tienda-cursor-mano' idcategoria='" +
				categoria.idcategoria +
				"'>";
			row +=
				"<td class='align-middle text-left'>" +
				categoria.nombre.toUpperCase() +
				'</td>';
			row += '</tr>';
			document.querySelector('#tbodyCategoriaC').innerHTML += row;
		});
		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageCategoriaC').value),
			document.querySelector('#pageCategoriaC'),
			$('#modalCargandoSelectedCategoriaC'),
			$('#paginationCategoriaC')
		);
		addEventsCategoriaCes();
		if (beanRequestCategoriaC.operation == 'paginate') {
			document.querySelector('#txtFilterCategoriaC').focus();
		}
		$('[data-toggle="tooltip"]').tooltip();
	} else {
		destroyPagination($('#paginationCategoriaC'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterCategoriaC').focus();
	}
}

function addEventsCategoriaCes() {
	document
		.querySelectorAll('.click-selection-categoria')
		.forEach(function(element) {
			element.onclick = function() {
				if (this.classList.contains('row-selected-celeste-claro')) {
					this.classList.remove('row-selected-celeste-claro');
					categoriaCSelected = undefined;
				} else {
					categoriaCSelected = findByCategoriaC(
						this.getAttribute('idcategoria')
					);
					this.parentElement.childNodes.forEach(function(element) {
						element.classList.remove('row-selected-celeste-claro');
					});
					this.classList.add('row-selected-celeste-claro');
				}
			};
		});
}

function findByCategoriaC(idcategoria) {
	let categoria_;
	beanPaginationCategoriaC.list.forEach((categoria) => {
		if (parseInt(idcategoria) == parseInt(categoria.idcategoria)) {
			categoria_ = categoria;
			return;
		}
	});
	return categoria_;
}
