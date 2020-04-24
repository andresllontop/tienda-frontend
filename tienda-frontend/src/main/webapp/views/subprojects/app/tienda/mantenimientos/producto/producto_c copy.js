/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationProductoC;
var beanPaginationProductoColorC;
var productoCSelected;
var productoColorCSelected;
var beanRequestProductoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function() {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestProductoC.entity_api = 'api/productos';
	beanRequestProductoC.operation = 'paginate';
	beanRequestProductoC.type_request = 'GET';
	/*PRODUCTO ADD*/
	document.getElementById('btnCancelAddProductoHtml').innerHTML = 'Cancelar';

	document.getElementById('btnCancelAddProductoHtml').onclick = () => {
		removeClass(document.getElementById('addProductoHtml'), 'd-block');
		removeClass(document.getElementById('listCompraHtml'), 'd-none');
		addClass(document.getElementById('addProductoHtml'), 'd-none');
		addClass(document.getElementById('listCompraHtml'), 'd-block');
		addProducto();
	};
	/* /AGREGAR BOTON X PARA CERRAR */
	document.querySelector('#btnSelecionarNewProductoc').onclick = function() {
		removeClass(document.getElementById('addProductoHtml'), 'd-none');
		addClass(document.getElementById('addProductoHtml'), 'd-block');
		removeClass(document.getElementById('listCompraHtml'), 'd-block');
		addClass(document.getElementById('listCompraHtml'), 'd-none');

		$('#ventanaModalSelectedProductoC').modal('hide');
	};

	document.getElementById('FrmProductoModal').onsubmit = (event) => {
		//CONFIGURAMOS LA SOLICITUD
		beanRequestProductoC.operation = 'add';
		beanRequestProductoC.type_request = 'POST';

		if (validateFormProducto()) {
			processAjaxProductoC();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	/* */

	$('#FrmProductoC').submit(function(event) {
		event.preventDefault();
		event.stopPropagation();
		beanRequestProductoC.operation = 'paginate';
		beanRequestProductoC.type_request = 'GET';
		processAjaxProductoC();
	});

	$('#ventanaModalSelectedProductoC').on('hidden.bs.modal', function() {
		beanRequestProductoC.operation = 'paginate';
		beanRequestProductoC.type_request = 'GET';
	});

	document.querySelector('#btnSeleccionarProducto').onclick = function() {
		if (productoSelected != undefined) {
			$('#ventanaModalSelectedProductoC').modal('show');
		} else {
			processAjaxProductoC();
			$('#ventanaModalSelectedProductoC').modal('show');
		}
	};
});

function processAjaxProductoC() {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Producto </i>'
	);

	let parameters_pagination = '';
	let json = '';
	switch (beanRequestProductoC.operation) {
		case 'add':
			json = {
				producto: new Producto(
					parseInt(1),
					document.getElementById('txtCodigoProducto').value,
					document.getElementById('txtNombreProducto').value,
					document.getElementById('txtDescripcionProducto').value,
					document.getElementById('txtEstadoProducto').value,
					document.getElementById('txtCantidadMinimaProducto').value,
					unidadMedidaSelected,
					categoriaSelected,
					marcaSelected
				),
				list: listBeanDetalleProducto
			};
			break;
		case 'detalles/properties/paginate':
			parameters_pagination += '?idproducto=' + productoSelected.idproducto;
			break;
		default:
			parameters_pagination +=
				'?nombre=' +
				limpiar_campo(document.querySelector('#txtFilterProductoC').value)
					.toLowerCase()
					.concat(1);
			parameters_pagination += '&page=1&size=5';
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(
		beanRequestProductoC,
		json,
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

function toListProductoC(beanPagination) {
	document.querySelector('#tbodyProductoC').innerHTML = '';
	document.querySelector('#titleManagerProductoC').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] PRODUCTOS';
	if (beanPagination.count_filter == 0) {
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterProductoC').focus();
		return;
	}
	let row;
	beanPagination.list.forEach((producto) => {
		if (producto.indice > 0) {
			row = `
				<!-- Tasks -->
			<div class="pb-0 pt-2 row-selected-celeste-claro detalle-producto" idproducto="${producto.idproducto}">
				<a class="tienda-cursor-mano "
				 href="javascript:void(0)"
				 >
				<i class="icon icon-fw icon-xl icon-chevrolet-down"></i>
				</a>
				<label >${producto.codigo}
			 `;
		} else {
			row = `
				<!-- Tasks -->
			<div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
				<input class="click-selection-producto form-control form-control-sm " type="checkbox" idproducto="${producto.idproducto}">
				<label class="dt-checkbox-content" for="${producto.idproducto}"">${producto.codigo}
				 `;
		}
		row += `
                   
				<span class="dt-separator-v">&nbsp;</span>
				<span class="designation">${getStringCapitalize(producto.nombre)}</span>
				<span class="dt-separator-v">&nbsp;</span>
				<span class="designation">${producto.precio_compra}</span>
				</label>
           
			`;
		row += `
			<div id='${producto.idproducto}'
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
					productoCSelected = findByProductoC(this.getAttribute('idproducto'));
				} else {
					productoCSelected = undefined;
				}
				productoColorSelected = undefined;
				if (productoCSelected == undefined) {
					showAlertTopEnd('warning', 'No seleccionaste Producto');
					return;
				}
				productoSelected = productoCSelected;
				document.querySelector(
					'#btnSeleccionarProducto'
				).value = productoSelected.codigo.concat(
					' / ' + getStringCapitalize(productoSelected.nombre)
				);
				addClass(
					document.querySelector('#btnSeleccionarProducto').labels[0],
					'sr-only'
				);
				document.querySelector(
					'#btnSeleccionarProducto'
				).labels[0].style.backgroundColor = '';
				document.querySelector(
					'#btnSeleccionarProducto'
				).nextElementSibling.style.paddingLeft = '0';

				$('#ventanaModalSelectedProductoC').modal('hide');
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
			document.querySelector('#btnSeleccionarProducto').value =
				productoColorSelected.detalle_producto.producto.codigo +
				' / ' +
				getStringCapitalize(
					productoColorSelected.detalle_producto.producto.nombre
				) +
				' / ' +
				productoColorSelected.detalle_producto.longitud;
			document.querySelector('#btnSeleccionarProducto').labels[0].style.color =
				'transparent';
			document.querySelector(
				'#btnSeleccionarProducto'
			).labels[0].style.backgroundColor = productoColorSelected.idcolor.codigo;
			removeClass(
				document.querySelector('#btnSeleccionarProducto').labels[0],
				'sr-only'
			);
			document.querySelector(
				'#btnSeleccionarProducto'
			).nextElementSibling.style.paddingLeft = '45px';

			$('#ventanaModalSelectedProductoC').modal('hide');
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
				document.querySelector('#btnSeleccionarProducto').value = '';
			}
			addClass(document.getElementById(productoSelected.idproducto), 'show');

			if (document.getElementById(productoSelected.idproducto).innerText != '')
				return;

			if (productoSelected == undefined) {
				showAlertTopEnd('warning', 'No se encontró el producto');
				return;
			}

			beanRequestProductoC.operation = 'detalles/properties/paginate';
			beanRequestProductoC.type_request = 'GET';
			processAjaxProductoC();

			// if (document.getElementById(productoSelected.idproducto).innerText != '')
			// 	return;
		};
	});
}

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
function findByProductoC(idproducto) {
	let producto_;
	beanPaginationProductoC.list.forEach((producto) => {
		if (parseInt(idproducto) == parseInt(producto.idproducto)) {
			producto_ = producto;
			return;
		}
	});
	return producto_;
}
