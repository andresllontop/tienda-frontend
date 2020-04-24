var beanRequestProducto = new BeanRequest();
var beanPaginationProducto;
var productoSelected;
var filterSelected = 0,
	BooleanValor = false;
let timeout;
document.addEventListener('DOMContentLoaded', () => {
	/* ADD PRODUCTO */

	document.getElementById('btnCancelAddProductoHtml').innerHTML = 'Cancelar';
	document.getElementById('btnAgregarNewProducto').onclick = () => {
		removeClass(document.getElementById('addProductoHtml'), 'd-none');
		removeClass(document.getElementById('listProductoHtml'), 'd-block');

		addClass(document.getElementById('addProductoHtml'), 'd-block');
		addClass(document.getElementById('listProductoHtml'), 'd-none');
		addProducto();
		//SET TITLE MODAL
		document.querySelector('#TituloModalProducto').innerHTML =
			'REGISTRAR PRODUCTO';
		beanRequestProducto.operation = 'add';
		beanRequestProducto.type_request = 'POST';
	};
	document.getElementById('btnCancelAddProductoHtml').onclick = () => {
		listBeanDetalleProducto.length = 0;
		productoSelected = undefined;
		removeClass(document.getElementById('collapseDetalleProducto'), 'show');
		removeClass(
			document.getElementById('buttonCollapseDetalleProducto').lastChild
				.previousElementSibling,
			'icon-arrow-long-left'
		);
		addClass(
			document.getElementById('buttonCollapseDetalleProducto').lastChild
				.previousElementSibling,
			'icon-arrow-long-right'
		);
		document.querySelector('#tbodyDetalleProducto').innerHTML = '';
		removeClass(document.getElementById('addProductoHtml'), 'd-block');
		removeClass(document.getElementById('listProductoHtml'), 'd-none');
		addClass(document.getElementById('addProductoHtml'), 'd-none');
		addClass(document.getElementById('listProductoHtml'), 'd-block');
		beanRequestProducto.operation = 'paginate';
		beanRequestProducto.type_request = 'GET';
		processAjaxProducto();
	};

	/* / */
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestProducto.entity_api = 'api/productos';
	beanRequestProducto.operation = 'paginate';
	beanRequestProducto.type_request = 'GET';

	//filtro del campo registrar
	document
		.querySelector('#txtCodigoProducto')
		.addEventListener('keydown', () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (
					letra_numero_campo(document.querySelector('#txtCodigoProducto')) !=
					undefined
				) {
					beanRequestProducto.operation = 'model';
					beanRequestProducto.type_request = 'GET';
					processAjaxProducto();
				}

				clearTimeout(timeout);
			}, 1000);
		});
	// filtro de la tabla
	document.querySelector('#txtFilterCodigo').addEventListener('keydown', () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			beanRequestProducto.operation = 'paginate';
			beanRequestProducto.type_request = 'GET';
			filterSelected = limpiar_campo(
				document.querySelector('#txtFilterCodigo').value
			)
				.toLowerCase()
				.concat('0');
			processAjaxProducto();

			clearTimeout(timeout);
		}, 1000);
	});
	document
		.querySelector('#txtFilterProducto')
		.addEventListener('keydown', () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				beanRequestProducto.operation = 'paginate';
				beanRequestProducto.type_request = 'GET';
				filterSelected = limpiar_campo(
					document.querySelector('#txtFilterProducto').value
				)
					.toLowerCase()
					.concat('1');
				processAjaxProducto();
				clearTimeout(timeout);
			}, 1000);
		});
	document
		.querySelector('#txtFilterCategoria')
		.addEventListener('keydown', () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				beanRequestProducto.operation = 'paginate';
				beanRequestProducto.type_request = 'GET';
				filterSelected = limpiar_campo(
					document.querySelector('#txtFilterCategoria').value
				)
					.toLowerCase()
					.concat('2');
				processAjaxProducto();
				clearTimeout(timeout);
			}, 1000);
		});
	document.querySelector('#txtFilterPrecio').addEventListener('keydown', () => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			beanRequestProducto.operation = 'paginate';
			beanRequestProducto.type_request = 'GET';
			filterSelected = limpiar_campo(
				document.querySelector('#txtFilterPrecio').value
			)
				.toLowerCase()
				.concat('3');
			processAjaxProducto();
			clearTimeout(timeout);
		}, 1000);
	});

	$('#FrmProducto').submit(function(event) {
		beanRequestProducto.operation = 'paginate';
		beanRequestProducto.type_request = 'GET';
		processAjaxProducto();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmProductoModal').submit(function(event) {
		//CONFIGURAMOS LA SOLICITUD
		event.preventDefault();
		event.stopPropagation();
		if (!validateFormProducto()) return;
		if (!validateFormPrecios()) return;
		if (document.getElementById('radioConStockProducto').checked) {
			if (document.querySelector('#txtCantidadTotalProducto').value == '') {
				document.querySelector('#txtCantidadTotalProducto').focus();
				return showAlertTopEnd('warning', 'Por favor Ingrese Cantidad total');
			}
			if (
				isNaN(
					parseInt(document.querySelector('#txtCantidadTotalProducto').value)
				)
			) {
				showAlertTopEnd(
					'warning',
					'Por favor Ingrese sólo Números a la cantidad total'
				);
				return document.querySelector('#txtCantidadTotalProducto').focus();
			}
			document.querySelector('#txtCantidadTotalProducto').value = parseInt(
				document.querySelector('#txtCantidadTotalProducto').value
			);
		} else {
			document.querySelector('#txtCantidadTotalProducto').value = 0;
		}

		processAjaxProducto();
	});

	processAjaxProducto();

	$('#sizePageProducto').change(function() {
		beanRequestProducto.operation = 'paginate';
		beanRequestProducto.type_request = 'GET';
		processAjaxProducto();
	});
});

function processAjaxProducto() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Producto </i>'
	);
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestProducto.operation == 'add' ||
		beanRequestProducto.operation == 'update'
	) {
		json = {
			producto: new Producto(
				parseInt(1),
				listBeanDetalleProducto.length > 0
					? '1'
					: productoSelected == undefined
					? '0'
					: productoSelected.indice,
				document.getElementById('txtCodigoProducto').value,
				document.getElementById('txtNombreProducto').value,
				document.getElementById('txtDescripcionProducto').value,
				document.getElementById('txtEstadoProducto').value,
				document.getElementById('txtCantidadMinimaProducto').value,
				unidadMedidaSelected,
				categoriaSelected,
				marcaSelected,
				document.getElementById('txtCantidadTotalProducto').value,
				document.getElementById('txtPrecioCompraProducto').value,
				document.getElementById('txtPrecioGananciaPorcentajeProducto').value,
				document.getElementById('txtDescuentoPorcentajeProducto').value,
				document.getElementById('selectImpuestoProducto').value
			),
			list: listBeanDetalleProducto
		};
	}
	switch (beanRequestProducto.operation) {
		case 'model':
			parameters_pagination +=
				'?codigo=' + document.querySelector('#txtCodigoProducto').value.trim();
			break;
		case 'detalles/properties/paginate':
			parameters_pagination += '?idproducto=' + productoSelected.idproducto;
			break;
		case 'delete':
			parameters_pagination = '/' + productoSelected.idproducto;
			break;
		case 'update':
			json.producto.idproducto = productoSelected.idproducto;
			break;
		case 'add':
			break;

		default:
			if (filterSelected != '') {
				document.querySelector('#pageProducto').value = 1;
			}
			parameters_pagination += '?nombre=' + filterSelected;
			parameters_pagination +=
				'&page=' + document.querySelector('#pageProducto').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageProducto').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestProducto,
		json,
		parameters_pagination,
		'Producto'
	);
	xhr.onload = () => {
		hideProgress();
		beanCrudResponse = xhr.response;
		if (beanCrudResponse.messageServer !== undefined) {
			if (beanCrudResponse.messageServer.toLowerCase() != 'ok') {
				showAlertTopEnd('warning', beanCrudResponse.messageServer);
				return;
			}

			showAlertTopEnd('success', 'Acción realizada exitosamente');
			if (beanRequestProducto.operation !== 'update') addProducto();
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			if (beanRequestProducto.operation == 'detalles/properties/paginate') {
				if (BooleanValor) {
					toListDetalleProductoColor(beanCrudResponse.beanPagination);
					BooleanValor = false;
					beanRequestProducto.operation = 'paginate';
					beanRequestProducto.type_request = 'GET';
				} else {
					tolistUpdateDetalleProducto(beanCrudResponse.beanPagination);
					beanRequestProducto.operation = 'update';
					beanRequestProducto.type_request = 'PUT';
				}
				return;
			}
			beanPaginationProducto = beanCrudResponse.beanPagination;
			toListProducto(beanPaginationProducto);
		}
	};
}
function toListProducto(beanPagination) {
	document.querySelector('#tbodyProducto').innerHTML = '';
	document.querySelector('#titleManagerProducto').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PRODUCTOS';
	if (beanPagination.count_filter == 0) {
		destroyPagination($('#paginationProducto'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterProducto').focus();
		return;
	}
	let row;
	beanPagination.list.forEach((producto) => {
		if (producto.indice > 0) {
			row = `
				<!-- Widget Item -->
			<div class="dt-widget__item text-center p-1 pt-2 pb-2" idproducto='${producto.idproducto}'>
			<div class="slide-content tienda-cursor-mano detalle-producto">
				<a href="javascript:void(0)">
				<i class="icon icon-fw icon-xl icon-chevrolet-down"></i>
				</a>
			 </div>

			 `;
		} else {
			row = `
			<!-- Widget Item -->
			<div class="dt-widget__item text-center p-1 pt-2 pb-2 pl-8" idproducto='${producto.idproducto}'>`;
		}
		row += `
			  <!-- Widget Info -->
			  <div class="dt-widget__info align-text-top " style="border-right:0.1em solid;max-width: 135px;min-width: 100px;">
				<p class="dt-widget__subtitle text-truncate">
				 ${producto.codigo}
				</p>
			  </div>
			  <!-- /widget info -->
		
			  <!-- Widget Info -->
			  <div class="dt-widget__info align-text-top " style="border-right:0.1em solid;">
				<p class="dt-widget__subtitle text-truncate " >
				${producto.nombre}
				</p>
			  </div>
			  <!-- /widget info -->

			  <!-- Widget Info -->
			  <div class="dt-widget__info align-text-top"style="border-right:0.1em solid; ">
				<p class="dt-widget__subtitle text-truncate " >
				${producto.categoria.nombre}
				</p>
			  </div>
			  <!-- /widget info -->

			  <!-- Widget Info -->
			  <div class="dt-widget__info align-text-top" style="border-right:0.1em solid;max-width: 135px;min-width: 100px;">
				<p class="dt-widget__subtitle text-truncate">
				${producto.cantidad + ' ' + producto.unidad_medida.abreviatura} 
				</p>
			  </div>
			  <!-- /widget info -->

			  <!-- Widget Info -->
			  <div class="dt-widget__info align-text-top"style="max-width: 100px;min-width: 100px;">
				<p class="dt-widget__subtitle text-truncate">S/. ${producto.precio_costo *
					(1 + producto.ganancia_porcentaje / 100)} 
				</p>
			  </div>
			  <!-- /widget info -->

			  <div class="dt-widget__extra text-left">
			  <!-- Hide Content -->
			  	<div class="hide-content">
				<!-- Action Button Group -->
					<div class="action-btn-group">
						<button idproducto='${producto.idproducto}' type="button"
						class="btn btn-default text-success dt-fab-btn editar-producto" data-toggle="tooltip" data-html="true" title="" data-original-title="<em>Editar</em>">
							<i class="icon icon-editors icon-sm pulse-success"></i>
		  				</button>
		  				<button type="button" class="btn btn-default text-danger dt-fab-btn eliminar-producto"
						idproducto='${
							producto.idproducto
						}' data-toggle="tooltip" data-html="true" title=""
						data-original-title="<em>Eliminar</em>">
							<i class="icon icon-trash-filled icon-sm pulse-danger"></i>
		  				</button>
					</div>
				<!-- /action button group -->
			 	</div>
			  <!-- /hide content -->
			  </div>
			</div>
			<!-- /widget item -->
			<div id='${producto.idproducto}'
			  class="collapse dt-widget dt-widget-hl-item dt-widget-hl-item-space dt-widget-mb-item dt-widget-hover-bg dt-card mb-0 col-12 p-0"></div>
            `;
		document.querySelector('#tbodyProducto').innerHTML += row;
		$('[data-toggle="tooltip"]').tooltip();
	});
	buildPagination(
		beanPagination.count_filter,
		parseInt(document.querySelector('#sizePageProducto').value),
		document.querySelector('#pageProducto'),
		processAjaxProducto,
		$('#paginationProducto')
	);
	addEventsProductos();
	if (beanRequestProducto.operation == 'paginate') {
		document.querySelector('#txtFilterProducto').focus();
	}
}
function addEventsProductos() {
	document.querySelectorAll('.editar-producto').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			productoSelected = findByProducto(btn.getAttribute('idproducto'));
			if (productoSelected == undefined) {
				showAlertTopEnd(
					'warning',
					'No se encontró la producto para poder editar'
				);
				return;
			}
			beanRequestProducto.operation = 'update';
			beanRequestProducto.type_request = 'PUT';
			//SET VALUES MODAL
			removeClass(document.getElementById('addProductoHtml'), 'd-none');
			removeClass(document.getElementById('listProductoHtml'), 'd-block');

			addClass(document.getElementById('addProductoHtml'), 'd-block');
			addClass(document.getElementById('listProductoHtml'), 'd-none');
			addProducto(productoSelected);
			document.querySelector('#TituloModalProducto').innerHTML =
				'EDITAR PRODUCTO';
			document.querySelector('#txtNombreProducto').focus();
		};
	});
	document.querySelectorAll('.eliminar-producto').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			productoSelected = findByProducto(btn.getAttribute('idproducto'));
			if (productoSelected == undefined) {
				showAlertTopEnd(
					'warning',
					'No se encontró el producto para poder editar'
				);
				return;
			}
			beanRequestProducto.operation = 'delete';
			beanRequestProducto.type_request = 'DELETE';
			processAjaxProducto();
		};
	});
	document.querySelectorAll('.detalle-producto').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			productoSelected = findByProducto(
				btn.parentElement.getAttribute('idproducto')
			);
			if (btn.children[0].children[0].classList[3] == 'icon-chevrolet-down') {
				removeClass(btn.children[0].children[0], 'icon-chevrolet-down');
				addClass(btn.children[0].children[0], 'icon-chevrolet-up');
			} else {
				removeClass(btn.children[0].children[0], 'icon-chevrolet-up');
				addClass(btn.children[0].children[0], 'icon-chevrolet-down');
			}

			if (
				document.getElementById(productoSelected.idproducto).classList[10] !==
				undefined
			) {
				removeClass(
					document.getElementById(productoSelected.idproducto),
					'show'
				);
				return;
			}
			for (
				let index = 0;
				index < document.getElementsByClassName('collapse').length;
				index++
			) {
				removeClass(document.getElementsByClassName('collapse')[index], 'show');
			}
			addClass(document.getElementById(productoSelected.idproducto), 'show');

			if (document.getElementById(productoSelected.idproducto).innerText != '')
				return;

			if (productoSelected == undefined) {
				showAlertTopEnd('warning', 'No se encontró el producto');
				return;
			}
			beanRequestProducto.operation = 'detalles/properties/paginate';
			beanRequestProducto.type_request = 'GET';
			processAjaxProducto();
			BooleanValor = true;
		};
	});
}
function findByProducto(idproducto) {
	let producto_;
	beanPaginationProducto.list.forEach((producto) => {
		if (parseInt(idproducto) == parseInt(producto.idproducto)) {
			producto_ = producto;
			return;
		}
	});
	return producto_;
}
var toListDetalleProductoColor = (beanPagination) => {
	document.getElementById(productoSelected.idproducto).innerHTML = '';
	if (beanPagination.list.length == 0) return;
	let row = '',
		longitudTemporal = '';
	sumaCantidad = 0;

	let ListaTemporal = beanPagination.list;
	ListaTemporal = ListaTemporal.filter((temporal) => {
		if (temporal.detalle_producto.longitud != longitudTemporal) {
			longitudTemporal = temporal.detalle_producto.longitud;
			return temporal;
		} else {
			return undefined;
		}
	});
	ListaTemporal.forEach((beanDetalleProducto) => {
		row = `
			<!-- Widget Item -->
		  <div class="dt-widget__item mb-0 pb-0 pt-0 " >

			<!-- Widget Info -->
			<div class="dt-widget__info text-truncate" style="max-width: 59px;">
			  <div class="dt-widget__title f-16 font-weight-500 text-truncate">${beanDetalleProducto.detalle_producto.longitud}
			  </div>
			</div>
			<!-- /widget info -->
			<!-- Widget Extra -->
			<div class="dt-widget__info text-right">
			  <!-- Show Content -->
			  <div class="content">`;
		beanPagination.list.forEach((detalle) => {
			if (
				beanDetalleProducto.detalle_producto.iddetalle_producto ==
				detalle.detalle_producto.iddetalle_producto
			) {
				sumaCantidad = parseInt(sumaCantidad) + parseInt(detalle.cantidad);
				row += `
					<button type="button" class="btn btn-primary m-1 p-1 border-0"		
					style="background:${detalle.idcolor.codigo};">
						<span class="badge badge-pill badge-light p-1" style="color:black;">${detalle.cantidad}</span>
                    </button>
					`;
			}
		});
		row += `    </div>
					<!-- /show content -->
					  </div>
		 		 <!-- /widget extra -->

		 		 </div>
	  		<!-- /widgets item -->
		`;

		document.getElementById(productoSelected.idproducto).innerHTML += row;
	});
};
