var beanPaginationCategoria;
var categoriaSelected;
var metodo = false;
var beanRequestCategoria = new BeanRequest();
document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestCategoria.entity_api = 'api/items';
	beanRequestCategoria.operation = 'paginate';
	beanRequestCategoria.type_request = 'GET';
	//LISTAR
	processAjaxCategoria();
	//
	$('#FrmCategoria').submit(function(event) {
		beanRequestCategoria.operation = 'paginate';
		beanRequestCategoria.type_request = 'GET';
		processAjaxCategoria();
		event.preventDefault();
		event.stopPropagation();
	});

	document.getElementById('FrmCategoriaModal').onsubmit = (event) => {
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
			processAjaxCategoria();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	$('#sizePageCategoria').change(function() {
		processAjaxCategoria();
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
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Categoría </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestCategoria.operation == 'update' ||
		beanRequestCategoria.operation == 'add'
	) {
		json = {
			nombre: document.querySelector('#txtNombreCategoria').value.toUpperCase(),
			indice: parseInt(1)
		};
	}
	switch (beanRequestCategoria.operation) {
		case 'delete':
			parameters_pagination = '/' + categoriaSelected.iditem;
			break;

		case 'update':
			json.iditem = categoriaSelected.iditem;
			break;
		case 'add':
			break;

		default:
			if (
				limpiar_campo(document.querySelector('#txtFilterCategoria').value) != ''
			) {
				document.querySelector('#pageCategoria').value = 1;
			}
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterCategoria').value)
					.toLowerCase()
					.concat('1');
			parameters_pagination +=
				'&page=' + document.querySelector('#pageCategoria').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageCategoria').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestCategoria,
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
			addCategoria();
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationCategoria = beanCrudResponse.beanPagination;
			toListCategoria(beanPaginationCategoria);
		}
		addCategoria();
		beanRequestCategoria.operation = 'paginate';
		beanRequestCategoria.type_request = 'GET';
	};
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
                </div>
            `;
		document.querySelector('#tbodyCategoria').innerHTML += row;
		beanPagination.list.forEach((categoria) => {
			row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
				 	
					<label for="${categoria.iditem}" 
					class="dt-widget__subtitle text-truncate ">
					${categoria.nombre}
					</label>
				  </div>
				  <!-- /widget info -->
		  
				  <!-- Widget Extra -->
				  <div class="dt-widget__extra">
				  <div class="dt-task">
				  <div class="dt-task__redirect">
					<!-- Action Button Group -->
					<div class="action-btn-group">
					  <button
					  id='${categoria.iditem}'
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
						class="btn btn-default text-danger dt-fab-btn eliminar-categoria" idcategoria='${categoria.iditem}' 
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
			processAjaxCategoria,
			$('#paginationCategoria')
		);
		addEventsCategorias();
	} else {
		destroyPagination($('#paginationCategoria'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
	}
}

function addEventsCategorias() {
	document.querySelectorAll('.editar-categoria').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			categoriaSelected = findByCategoria(btn.getAttribute('id'));
			document.querySelectorAll('.dt-widget__subtitle').forEach((element) => {
				removeClass(element, 'text-strike');
			});
			if (categoriaSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombreCategoria').value =
					categoriaSelected.nombre;
				document.querySelector('#TituloModalCategoria').innerHTML =
					'EDITAR CATEGORIA';
				document.querySelector('#txtNombreCategoria').focus();
				addClass(btn.labels[0], 'text-strike');
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
	document.querySelectorAll('.tooltip').forEach((btn) => {
		removeClass(btn, 'show');
		btn.innerHTML = '';
	});
}

function findByCategoria(idcategoria) {
	let categoria_;
	beanPaginationCategoria.list.forEach((categoria) => {
		if (idcategoria == categoria.iditem) {
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
