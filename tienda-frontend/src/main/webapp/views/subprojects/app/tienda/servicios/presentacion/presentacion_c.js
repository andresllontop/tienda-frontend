var beanPaginationPresentacionC;
var beanPaginationProductoColorC;
var productoCSelected;
var presentacionCSelected;
var productoColorCSelected;
var beanRequestProductoC = new BeanRequest();
var beanRequestPresentacionC = new BeanRequest();
let timeout;
document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestProductoC.entity_api = 'api/productos';
	beanRequestProductoC.operation = 'paginate';
	beanRequestProductoC.type_request = 'GET';
	/* */
	beanRequestPresentacionC.entity_api = 'api/presentaciones';
	beanRequestPresentacionC.operation = 'paginate';
	beanRequestPresentacionC.type_request = 'GET';

	$('#FrmPresentacionC').submit(function(event) {
		event.preventDefault();
		event.stopPropagation();
		// processAjaxPresentacionC();
	});

	document.getElementById('txtFilterProductoC').onclick = () => {
		if (beanPaginationPresentacionC == undefined) return;
		// if (
		// 	beanPaginationPresentacionC.list.length > 0 &&
		// 	!document.querySelector('#tbodyProductoC').className.includes('show')
		// )
		// 	addClass(document.querySelector('#tbodyProductoC'), 'show');
	};

	document
		.querySelector('#txtFilterProductoC')
		.addEventListener('keydown', () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				document.querySelector('#txtFilterProductoC').value = limpiar_campo(
					document.querySelector('#txtFilterProductoC').value
				).toLowerCase();
				processAjaxPresentacionC();

				clearTimeout(timeout);
			}, 1000);
		});
	/* accion al seleccionar afuera de la tabla productoC*/
	window.addEventListener('click', (e) => {
		if (!document.getElementById('tbodyProductoC').contains(e.target))
			removeClass(document.querySelector('#tbodyProductoC'), 'show');
	});
});

function processAjaxPresentacionC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Producto </i>'
	);

	let parameters_pagination = '';
	parameters_pagination +=
		'?nombre=' +
		limpiar_campo(
			document.querySelector('#txtFilterProductoC').value
		).toLowerCase();
	parameters_pagination += '&page=1&size=5';

	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestPresentacionC,
		'',
		parameters_pagination,
		'Producto'
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
			beanPaginationPresentacionC = beanCrudResponse.beanPagination;
			toListPresentacionC(beanPaginationPresentacionC);
		}
	};
}

function toListPresentacionC(beanPagination) {
	document.querySelector('#tbodyProductoC').innerHTML = '';
	if (beanPagination.count_filter == 0) {
		removeClass(document.querySelector('#tbodyProductoC'), 'show');
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterProductoC').focus();
		return;
	}
	addClass(document.querySelector('#tbodyProductoC'), 'show');

	let row;
	beanPagination.list.forEach((presentacion) => {
		if (presentacion.producto.indice > 0) {
			row = `
				<!-- Tasks -->
			<div class="pb-0 pt-2 row-selected-celeste-claro detalle-producto" idproducto="${presentacion.producto.idproducto}" idpresentacion="${presentacion.idpresentacion}">
				<a class="tienda-cursor-mano "
				 href="javascript:void(0)"
				 >
				<i class="icon icon-fw icon-xl icon-chevrolet-down"></i>
				</a>
				<label >${presentacion.producto.codigo}
			 `;
		} else {
			row = `
				<!-- Tasks -->
			<div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
				<input class="click-selection-producto form-control form-control-sm " type="checkbox" idproducto="${presentacion.producto.idproducto}" idpresentacion="${presentacion.idpresentacion}">
				<label  for="${presentacion.producto.idproducto}"">${presentacion.producto.codigo}
				 `;
		}
		row += `
                   
				<span class="dt-separator-v">&nbsp;</span>
				<span class="designation">${getStringCapitalize(
					presentacion.producto.nombre
				)}</span>
				<span class="dt-separator-v">&nbsp;</span>
				<span class="designation"> ${presentacion.existencia}  ${
			presentacion.producto.unidad_medida.abreviatura
		}</span>
				<span class="dt-separator-v">&nbsp;</span>
				<span class="designation">S/. ${
					presentacion.idpresentacion == 0
						? presentacion.producto.precio_costo
						: presentacion.inventario_final
				}</span>
				<span class="dt-separator-v">&nbsp;</span>
				<span class="designation">S/. ${(presentacion.idpresentacion == 0
					? presentacion.producto.precio_costo
					: presentacion.inventario_final) *
					(1 + presentacion.producto.ganancia_porcentaje / 100)}</span>
				</label>

			<div id='${presentacion.producto.idproducto}'
			  class="collapse dt-widget dt-widget-hl-item dt-widget-hl-item-space dt-widget-mb-item dt-widget-hover-bg dt-card mb-0 col-12 p-0"></div>

			  </div>
			  <!-- /tasks -->
			`;
		document.querySelector('#tbodyProductoC').innerHTML += row;
	});

	addEventsProductoCes();
	if (beanRequestProductoC.operation == 'paginate') {
		document.querySelector('#txtFilterProductoC').focus();
	}
	$('[data-toggle="tooltip"]').tooltip();
}

function addEventsProductoCes() {
	document
		.querySelectorAll('.click-selection-producto')
		.forEach(function(element) {
			element.onclick = function() {
				productoCSelected = findByProductoC(this.getAttribute('idproducto'));
				presentacionCSelected = findByPresentacionC(
					this.getAttribute('idpresentacion')
				);
				if (productoCSelected == undefined) {
					return showAlertTopEnd('warning', 'No seleccionaste Producto');
				}
				presentacionSelected = presentacionCSelected;
				productoSelected = productoCSelected;

				removeClass(document.querySelector('#tbodyProductoC'), 'show');
				newSelected();
				toDetalleProducto(presentacionSelected);
			};
		});

	document.querySelectorAll('.btn-medida-producto').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			productoColorCSelected = findByProductoColorC(
				btn.getAttribute('iddetalle-medida-producto')
			);

			if (productoColorCSelected == undefined) {
				showAlertTopEnd('warning', 'No se encontraron resultados');
				return;
			}
			productoColorSelected = productoColorCSelected;

			removeClass(document.querySelector('#tbodyProductoC'), 'show');
			if (document.getElementById('FrmPresentacionModal') == null)
				return newSelected();

			document.querySelector('#txtFilterProductoC').value =
				productoColorSelected.detalle_producto.producto.codigo +
				' / ' +
				getStringCapitalize(
					productoColorSelected.detalle_producto.producto.nombre
				) +
				' / ' +
				productoColorSelected.detalle_producto.longitud;
			document.querySelector('#txtFilterProductoC').labels[0].style.color =
				'transparent';
			document.querySelector(
				'#txtFilterProductoC'
			).labels[0].style.backgroundColor = productoColorSelected.idcolor.codigo;
			removeClass(
				document.querySelector('#txtFilterProductoC').labels[0],
				'sr-only'
			);
		};
	});
	document.querySelectorAll('.tooltip').forEach((thisbtn) => {
		removeClass(thisbtn, 'show');
		thisbtn.innerHTML = '';
	});
	// enviar consulta id producto
	document.querySelectorAll('.detalle-producto').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			for (let index = 0; index < this.parentElement.children.length; index++) {
				this.parentElement.children[index].children[0].checked = false;
			}

			if (btn.children[0].children[0].classList[3] == 'icon-chevrolet-down') {
				removeClass(btn.children[0].children[0], 'icon-chevrolet-down');
				addClass(btn.children[0].children[0], 'icon-chevrolet-up');
			} else {
				removeClass(btn.children[0].children[0], 'icon-chevrolet-up');
				addClass(btn.children[0].children[0], 'icon-chevrolet-down');
			}

			productoSelected = findByProductoC(btn.getAttribute('idproducto'));

			if (
				document.getElementById(productoSelected.idproducto).classList[10] !==
				undefined
			) {
				removeClass(
					document.getElementById(productoSelected.idproducto),
					'show'
				);
				productoSelected = undefined;
				return;
			}

			for (
				let index = 0;
				index < document.getElementsByClassName('collapse').length;
				index++
			) {
				removeClass(document.getElementsByClassName('collapse')[index], 'show');
				document.querySelector('#txtFilterProductoC').value = '';
			}
			addClass(document.getElementById(productoSelected.idproducto), 'show');

			if (document.getElementById(productoSelected.idproducto).innerText != '')
				return;

			if (productoSelected == undefined) {
				return showAlertTopEnd('warning', 'No se encontró el producto');
			}

			beanRequestProductoC.operation = 'detalles/properties/paginate';
			beanRequestProductoC.type_request = 'GET';
			processAjaxProductoC();
		};
	});
}

function findByProductoC(idproducto) {
	let producto_;
	beanPaginationPresentacionC.list.forEach((presentacion) => {
		if (parseInt(idproducto) == parseInt(presentacion.producto.idproducto)) {
			producto_ = presentacion.producto;
			return;
		}
	});
	return producto_;
}
function findByPresentacionC(idpresentacion) {
	let presentacion_;
	beanPaginationPresentacionC.list.forEach((presentacion) => {
		if (
			parseInt(idpresentacion) == parseInt(presentacion.idpresentacion) &&
			parseInt(idpresentacion) > 0
		) {
			presentacion_ = presentacion;
			return;
		}
	});
	return presentacion_;
}

function processAjaxProductoC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Producto </i>'
	);

	let parameters_pagination = '';
	parameters_pagination += '?idproducto=' + productoSelected.idproducto;
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestProductoC,
		'',
		parameters_pagination,
		'Detalle Producto'
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
			if (beanRequestProductoC.operation == 'paginate') {
				beanPaginationProductoC = beanCrudResponse.beanPagination;
				toListProductoC(beanPaginationProductoC);
			} else {
				beanPaginationProductoColorC = beanCrudResponse.beanPagination;
				toListDetalleProductoColorC(beanPaginationProductoColorC);
			}
		}
	};
}

var toListDetalleProductoColorC = (beanPagination) => {
	document.getElementById(productoSelected.idproducto).innerHTML = '';
	if (beanPagination.list.length == 0) {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		return;
	}
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
			<div class="dt-widget__info text-right ">
			  <!-- Show Content -->
			  <div class="content">`;
		beanPagination.list.forEach((detalle) => {
			if (
				beanDetalleProducto.detalle_producto.iddetalle_producto ==
				detalle.detalle_producto.iddetalle_producto
			) {
				sumaCantidad = parseInt(sumaCantidad) + parseInt(detalle.cantidad);
				row += `
					<button type="button" class="btn btn-primary m-1 p-1 border-0 btn-medida-producto"
					data-toggle="tooltip"
					data-html="true" title="" data-original-title="<em>Seleccionar</em>"
					iddetalle-medida-producto="${detalle.iddetalle_producto_color}"		
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
		$('[data-toggle="tooltip"]').tooltip();
	});
	productoSelected = undefined;
	addEventsProductoCes();
};

function findByProductoColorC(idproducto) {
	let producto_;
	beanPaginationProductoColorC.list.forEach((producto) => {
		if (parseInt(idproducto) == parseInt(producto.iddetalle_producto_color)) {
			producto_ = producto;
			return;
		}
	});
	return producto_;
}

var toDetalleProducto = (presentacion) => {
	document.getElementById('detalleProducto').children[0].innerText =
		presentacion.producto == null
			? presentacion.detalle_producto_color.detalle_producto.producto.nombre
			: presentacion.producto.nombre;
	document.getElementById('detalleProducto').children[1].innerText =
		presentacion.producto == null
			? presentacion.detalle_producto_color.detalle_producto.producto.codigo
			: presentacion.producto.codigo;
	document.getElementById('detalleProducto').children[2].innerText =
		'Stock Actual : ' + presentacion.existencia;
	document.getElementById('detalleProducto').children[3].innerText =
		'Precio de Venta : ' +
		presentacion.inventario_final *
			(1 +
				(presentacion.producto == null
					? presentacion.detalle_producto_color.detalle_producto.producto
							.ganancia_porcentaje
					: presentacion.producto.ganancia_porcentaje) /
					100);
};
