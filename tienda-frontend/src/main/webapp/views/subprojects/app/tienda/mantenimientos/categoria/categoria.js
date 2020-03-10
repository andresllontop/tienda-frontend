var beanPaginationCategoria;
var categoriaSelected;
var metodo = false;
var beanRequestCategoria = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//invocar funcion agregar
	addCategoria();
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestCategoria.entity_api = 'api/categorias';
	beanRequestCategoria.operation = 'paginate';
	beanRequestCategoria.type_request = 'GET';

	$('#FrmCategoria').submit(function(event) {
		beanRequestCategoria.operation = 'paginate';
		beanRequestCategoria.type_request = 'GET';
		$('#modalCargandoCategoria').modal('show');
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmCategoriaModal').submit(function(event) {
		if (metodo) {
			beanRequestCategoria.operation = 'update';
			beanRequestCategoria.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestCategoria.operation = 'add';
			beanRequestCategoria.type_request = 'POST';
		}

		if (validateFormCategoria()) {
			$('#modalCargandoCategoria').modal('show');
		}
		event.preventDefault();
		event.stopPropagation();
	});

	$('#modalCargandoCategoria').on('shown.bs.modal', function() {
		processAjaxCategoria();
		addCategoria();
	});

	$('#modalCargandoCategoria').on('hidden.bs.modal', function() {
		beanRequestCategoria.operation = 'paginate';
		beanRequestCategoria.type_request = 'GET';
	});

	$('#modalCargandoCategoria').modal('show');

	$('#sizePageCategoria').change(function() {
		$('#modalCargandoCategoria').modal('show');
	});
});
function addCategoria() {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombreCategoria').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalCategoria').innerHTML =
		'REGISTRAR CATEGORÍA';
}

function processAjaxCategoria() {
	let parameters_pagination = '';
	let json = '';
	if (beanRequestCategoria.operation == 'paginate') {
		if (document.querySelector('#txtFilterCategoria').value != '') {
			document.querySelector('#pageCategoria').value = 1;
		}
		parameters_pagination +=
			'?nombre=' +
			document.querySelector('#txtFilterCategoria').value.toUpperCase();
		parameters_pagination +=
			'&page=' + document.querySelector('#pageCategoria').value;
		parameters_pagination +=
			'&size=' + document.querySelector('#sizePageCategoria').value;
	} else {
		parameters_pagination = '';
		if (beanRequestCategoria.operation == 'delete') {
			parameters_pagination = '/' + categoriaSelected.idcategoria;
		} else {
			json = {
				nombre: document.querySelector('#txtNombreCategoria').value
			};
			if (beanRequestCategoria.operation == 'update') {
				json.idcategoria = categoriaSelected.idcategoria;
			}
		}
	}

	$.ajax({
		type: beanRequestCategoria.type_request,
		url:
			getHostAPI() +
			beanRequestCategoria.entity_api +
			'/' +
			beanRequestCategoria.operation +
			parameters_pagination,
		headers: {
			Authorization: 'Bearer ' + Cookies.get('tienda_token')
		},
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			console.log(beanCrudResponse);
			$('#modalCargandoCategoria').modal('hide');
			if (beanCrudResponse.messageServer !== undefined) {
				if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
					showAlertTopEnd('success', 'Acción realizada exitosamente');
				} else {
					showAlertTopEnd('warning', beanCrudResponse.messageServer);
				}
			}
			if (beanCrudResponse.beanPagination !== undefined) {
				beanPaginationCategoria = beanCrudResponse.beanPagination;
				toListCategoria(beanPaginationCategoria);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoCategoria').modal('hide');
			showAlertErrorRequest();
			console.log(errorThrown);
			console.log(jqXHR);
			console.log(textStatus);
		});
}

function toListCategoria(beanPagination) {
	document.querySelector('#tbodyCategoria').innerHTML = '';
	document.querySelector('#titleManagerCategoria').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] CATEGORIAS';
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
					<!-- Widget Info -->
                    <div class="dt-widget__info text-truncate " >
                        <p class="mb-0 text-truncate text-right">
                           ACCIÓN
                        </p>
                    </div>
                    <!-- /widget info -->
                    
                </div>
            `;
		document.querySelector('#tbodyCategoria').innerHTML += row;
		beanPagination.list.forEach((categoria) => {
			row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
					<p class="dt-widget__subtitle text-truncate">
					${categoria.nombre}
					</p>
				  </div>
				  <!-- /widget info -->
		  
				  <!-- Widget Extra -->
				  <div class="dt-widget__extra">
					<!-- Action Button Group -->
					<div class="action-btn-group">
					  <button
					  idcategoria='${categoria.idcategoria}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-categoria"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-task-manager icon-1x"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-categoria" idcategoria='${categoria.idcategoria}' 
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
				  <!-- /widget extra -->
				</div>
				<!-- /widgets item -->
            `;
			document.querySelector('#tbodyCategoria').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});
		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageCategoria').value),
			document.querySelector('#pageCategoria'),
			$('#modalCargandoCategoria'),
			$('#paginationCategoria')
		);
		addEventsCategorias();
		if (beanRequestCategoria.operation == 'paginate') {
			document.querySelector('#txtFilterCategoria').focus();
		}
	} else {
		destroyPagination($('#paginationCategoria'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterCategoria').focus();
	}
}

function addEventsCategorias() {
	document.querySelectorAll('.editar-categoria').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			categoriaSelected = findByCategoria(btn.getAttribute('idcategoria'));
			if (categoriaSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombreCategoria').value =
					categoriaSelected.nombre;
				document.querySelector('#TituloModalCategoria').innerHTML =
					'EDITAR CATEGORIA';
				document.querySelector('#txtNombreCategoria').focus();
			} else {
				showAlertTopEnd(
					'warning',
					'No se encontró la categoria para poder editar'
				);
			}
		};
	});
	document.querySelectorAll('.eliminar-categoria').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			categoriaSelected = findByCategoria(btn.getAttribute('idcategoria'));
			beanRequestCategoria.operation = 'delete';
			beanRequestCategoria.type_request = 'DELETE';
			processAjaxCategoria();
		};
	});
}

function findByCategoria(idcategoria) {
	let categoria_;
	beanPaginationCategoria.list.forEach((categoria) => {
		if (idcategoria == categoria.idcategoria) {
			categoria_ = categoria;
			return;
		}
	});
	return categoria_;
}

function validateFormCategoria() {
	if (document.querySelector('#txtNombreCategoria').value == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenCategoria').focus();
		return false;
	}
	return true;
}
