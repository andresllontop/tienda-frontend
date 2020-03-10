var beanPaginationProducto;
var categoriaSelected;
var beanRequestProducto = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//invocar funcion agregar
	addProducto();
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestProducto.entity_api = 'api/productos';
	beanRequestProducto.operation = 'paginate';
	beanRequestProducto.type_request = 'GET';

	$('#FrmProducto').submit(function(event) {
		beanRequestProducto.operation = 'paginate';
		beanRequestProducto.type_request = 'GET';
		$('#modalCargandoProducto').modal('show');
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmProductoModal').submit(function(event) {
		console.log(document.querySelector('#picker-15').value);
		console.log(document.querySelector('#txtFechaVencimientoProducto').value);
		/*if (validateFormProducto()) {
			$('#modalCargandoProducto').modal('show');
		}*/
		event.preventDefault();
		event.stopPropagation();
	});

	$('#modalCargandoProducto').on('shown.bs.modal', function() {
		processAjaxProducto();
	});

	$('#ventanaModalProducto').on('hidden.bs.modal', function() {
		beanRequestProducto.operation = 'paginate';
		beanRequestProducto.type_request = 'GET';
	});

	$('#modalCargandoProducto').on('hide.bs.modal', function() {
		beanRequestProducto.operation = 'paginate';
		beanRequestProducto.type_request = 'GET';
	});

	$('#sizePageProducto').change(function() {
		$('#modalCargandoProducto').modal('show');
	});
});
function addProducto() {
	//CONFIGURAMOS LA SOLICITUD
	beanRequestProducto.operation = 'add';
	beanRequestProducto.type_request = 'POST';
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtNombreProducto').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalProducto').innerHTML =
		'REGISTRAR PRODUCTO';
}

function processAjaxProducto() {
	let parameters_pagination = '';
	let json = '';
	if (beanRequestProducto.operation == 'paginate') {
		if (document.querySelector('#txtFilterProducto').value != '') {
			document.querySelector('#pageProducto').value = 1;
		}
		parameters_pagination +=
			'?nombre=' +
			document.querySelector('#txtFilterProducto').value.toUpperCase();
		parameters_pagination +=
			'&page=' + document.querySelector('#pageProducto').value;
		parameters_pagination +=
			'&size=' + document.querySelector('#sizePageProducto').value;
	} else {
		parameters_pagination = '';
		if (beanRequestProducto.operation == 'delete') {
			parameters_pagination = '/' + categoriaSelected.idcategoria;
		} else {
			json = {
				nombre: document.querySelector('#txtNombreProducto').value
			};
			if (beanRequestProducto.operation == 'update') {
				json.idcategoria = categoriaSelected.idcategoria;
			}
		}
	}
	$.ajax({
		url:
			getHostAPI() +
			beanRequestProducto.entity_api +
			'/' +
			beanRequestProducto.operation +
			parameters_pagination,
		type: beanRequestProducto.type_request,
		/*headers: {
            'Authorization': 'Bearer ' + Cookies.get("tienda_token")
        },*/
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			$('#modalCargandoProducto').modal('hide');
			if (beanCrudResponse.messageServer !== undefined) {
				if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
					showAlertTopEnd('success', 'Acción realizada exitosamente');
					$('#ventanaModalProducto').modal('hide');
				} else {
					showAlertTopEnd('warning', beanCrudResponse.messageServer);
				}
			}
			if (beanCrudResponse.beanPagination !== undefined) {
				beanPaginationProducto = beanCrudResponse.beanPagination;
				toListProducto(beanPaginationProducto);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#modalCargandoProducto').modal('hide');
			showAlertErrorRequest();
		});
}

function toListProducto(beanPagination) {
	document.querySelector('#tbodyProducto').innerHTML = '';
	document.querySelector('#titleManagerProducto').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PRODUCTOS';
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
                    
                </div>
            `;
		document.querySelector('#tbodyProducto').innerHTML += row;
		beanPagination.list.forEach((categoria) => {
			row = `
                 <div class="dt-widget__item border-success  ">
                    <!-- Widget Extra -->
                    <div class="dt-widget__extra text-right">
                      
                        <!-- Hide Content -->
                        <div class="hide-content pr-2"">
                            <!-- Action Button Group -->
                            <div class="action-btn-group">
                                <button class="btn btn-default text-primary dt-fab-btn editar-categoria" idcategoria='${categoria.idcategoria}' title="Editar" data-toggle="tooltip">
                                    <i class="icon icon-editors"></i>
                                </button>
                                <button class="btn btn-default text-danger dt-fab-btn eliminar-categoria" idcategoria='${categoria.idcategoria}' title="Eliminar" data-toggle="tooltip">
                                    <i class="icon icon-trash-filled"></i>
                                </button>
                              
                            </div>
                            <!-- /action button group -->
                        </div>
                        <!-- /hide content -->
                    </div>
                    <!-- /widget extra -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-truncate " >
                        <p class="mb-0 text-truncate ">
                           ${categoria.nombre}
                        </p>
                    </div>
                    <!-- /widget info -->
                 
                    
                </div>
            `;
			document.querySelector('#tbodyProducto').innerHTML += row;
			$('[data-toggle="tooltip"]').tooltip();
		});
		buildPagination(
			beanPagination.count_filter,
			parseInt(document.querySelector('#sizePageProducto').value),
			document.querySelector('#pageProducto'),
			$('#modalCargandoProducto'),
			$('#paginationProducto')
		);
		addEventsProductos();
		if (beanRequestProducto.operation == 'paginate') {
			document.querySelector('#txtFilterProducto').focus();
		}
	} else {
		destroyPagination($('#paginationProducto'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterProducto').focus();
	}
}

function addEventsProductos() {
	document.querySelectorAll('.editar-categoria').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			categoriaSelected = findByProducto(btn.getAttribute('idcategoria'));
			if (categoriaSelected != undefined) {
				beanRequestProducto.operation = 'update';
				beanRequestProducto.type_request = 'PUT';
				//SET VALUES MODAL
				document.querySelector('#txtNombreProducto').value =
					categoriaSelected.nombre;
				document.querySelector('#TituloModalProducto').innerHTML =
					'EDITAR PRODUCTO';
				$('#ventanaModalProducto').modal('show');
				document.querySelector('#txtNombreProducto').focus();
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
			categoriaSelected = findByProducto(btn.getAttribute('idcategoria'));
			beanRequestProducto.operation = 'delete';
			beanRequestProducto.type_request = 'DELETE';
			processAjaxProducto();
		};
	});
}

function findByProducto(idcategoria) {
	let categoria_;
	beanPaginationProducto.list.forEach((categoria) => {
		if (idcategoria == categoria.idcategoria) {
			categoria_ = categoria;
			return;
		}
	});
	return categoria_;
}

function validateFormProducto() {
	if (document.querySelector('#txtNombreProducto').value == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenProducto').focus();
		return false;
	}
	return true;
}
