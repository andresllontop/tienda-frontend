var beanPaginationCompra;
var compraSelected;
var productoSelected;
var productoColorSelected;
var detalle_entradaSelected;
var metodo = false;
var beanRequestCompra = new BeanRequest();
var colorArray = [];
var contador = 0,
	sumaSubTotal = 0,
	sumaTotal = 0;
document.addEventListener('DOMContentLoaded', function() {
	//invocar funcion agregar
	//addCompra();
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestCompra.entity_api = 'api/entradas';
	beanRequestCompra.operation = 'paginate';
	beanRequestCompra.type_request = 'GET';
	$('#FrmCompra').submit(function(event) {
		beanRequestCompra.operation = 'paginate';
		beanRequestCompra.type_request = 'GET';
		processAjaxCompra();
		event.preventDefault();
		event.stopPropagation();
	});

	$('#FrmCompraModal').submit(function(event) {
		if (metodo) {
			beanRequestCompra.operation = 'update';
			beanRequestCompra.type_request = 'PUT';
			metodo = false;
		} else {
			//CONFIGURAMOS LA SOLICITUD
			beanRequestCompra.operation = 'add';
			beanRequestCompra.type_request = 'POST';
		}
		event.preventDefault();
		event.stopPropagation();
		// if (validateFormCompra()) {
		processAjaxCompra();
		// }
	});

	$('#sizePageCompra').change(function() {
		$('#modalCargandoCompra').modal('show');
	});
	addEventsDescuento();
	$('#txtFechaCompra').datetimepicker({
		defaultDate: new Date(),
		format: 'DD/MM/YYYY HH:mm:ss',
		icons: calIcons
	});
});
var newSelected = () => {
	/* VALIDAR PRODUCTO Y PRODUCTOCOLOR*/
	if (!(productoSelected != undefined || productoColorSelected != undefined)) {
		return showAlertTopEnd('info', 'Por favor ingrese Producto');
	}
	/* INGRESAR NULL A PRODUCTO Y PRODUCTOCOLOR*/
	if (productoSelected == undefined) productoSelected = null;
	if (productoColorSelected == undefined) productoColorSelected = null;
	/* OPERACION AGREGAR*/
	let precioUnitario =
		presentacionSelected == undefined
			? productoSelected == null
				? productoColorSelected.detalle_producto.producto.precio_costo
				: productoSelected.precio_costo
			: presentacionSelected.inventario_final;

	listDetalleEntrada.push(
		new Detalle_Entrada(
			contador++,
			1,
			precioUnitario,
			selectImpuestoProducto(
				productoSelected == null
					? productoColorSelected.detalle_producto.producto.impuesto
					: productoSelected.impuesto
			) / 100,
			1,
			precioUnitario -
				(precioUnitario *
					selectImpuestoProducto(
						productoSelected == null
							? productoColorSelected.detalle_producto.producto.impuesto
							: productoSelected.impuesto
					)) /
					100,
			precioUnitario,
			new Entrada(1),
			objectPresentacion(
				precioUnitario,
				1,
				presentacionSelected == undefined
					? {
							tipo_producto: 1,
							producto: productoSelected,
							detalle_producto_color: productoColorSelected
					  }
					: presentacionSelected,
				presentacionSelected == undefined ? false : true
			),
			productoSelected == null
				? productoColorSelected.detalle_producto.producto.unidad_medida
						.abreviatura
				: productoSelected.unidad_medida.abreviatura
		)
	);
	presentacionSelected = undefined;
	productoSelected = undefined;
	productoColorSelected = undefined;
	toListDetalleEntrada(listDetalleEntrada);
};
var addCompra = () => {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtFechaCompra').value = '';
	//SET TITLE MODAL
	document.querySelector('#TituloModalCompra').innerHTML = 'REGISTRAR COMPRA';
};

var processAjaxCompra = () => {
	SwalProgress();
	showProgress(
		'<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Compra </i>'
	);
	eliminarAtributosDetalleEntrada();
	let parameters_pagination = '';
	let json = '';
	if (
		beanRequestCompra.operation == 'add' ||
		beanRequestCompra.operation == 'update'
	) {
		json = {
			entrada: new Entrada(
				parseInt(1),
				document.getElementsByClassName('datetimepicker-input')[0].value,
				3
			),
			list: listDetalleEntrada
		};
	}
	switch (beanRequestCompra.operation) {
		case 'delete':
			parameters_pagination = '/' + entradaSelected.identrada;
			break;
		case 'update':
			json.entrada.identrada = entradaSelected.identrada;
			break;
		case 'add':
			break;

		default:
			if (document.querySelector('#txtFilterCompra').value != '') {
				document.querySelector('#pageCompra').value = 1;
			}
			parameters_pagination +=
				'?nombre=' +
				limpiar_Campo(
					document.querySelector('#txtFilterCompra').value
				).toLowerCase();
			parameters_pagination +=
				'&page=' + document.querySelector('#pageCompra').value;
			parameters_pagination +=
				'&size=' + document.querySelector('#sizePageCompra').value;
			break;
	}
	var xhr = new XMLHttpRequest();
	xhr = RequestServer(beanRequestCompra, json, parameters_pagination, 'Compra');
	xhr.onload = () => {
		hideProgress();
		beanCrudResponse = xhr.response;
		if (beanCrudResponse.messageServer !== undefined) {
			if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
				showAlertTopEnd('success', 'Acción realizada exitosamente');
				listDetalleEntrada.length = 0;
				toListDetalleEntrada(listDetalleEntrada);
			} else {
				showAlertTopEnd('warning', beanCrudResponse.messageServer);
			}
		}
		if (beanCrudResponse.beanPagination !== undefined) {
			beanPaginationCompra = beanCrudResponse.beanPagination;
			toListCompra(beanPaginationCompra);
		}
	};
};

var toListCompra = (beanPagination) => {
	document.querySelector('#tbodyCompra').innerHTML = '';
	document.querySelector('#titleManagerCompra').innerHTML =
		'[ ' + beanPagination.count_filter + ' ] COMPRAS';
	if (beanPagination.count_filter == 0) {
		destroyPagination($('#paginationCompra'));
		showAlertTopEnd('warning', 'No se encontraron resultados');
		document.querySelector('#txtFilterCompra').focus();
		return;
	}
	let row;
	document.querySelector('#tbodyCompra').innerHTML += row;
	beanPagination.list.forEach((compra) => {
		row = `
				<!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
					<p class="dt-widget__subtitle text-truncate">
					${compra.nombre}
					</p>
				  </div>
				  <!-- /widget info -->
		  
				  <!-- Widget Extra -->
				  <div class="dt-widget__extra">
				  <div class="dt-task">
				  <div class="dt-task__redirect">
					<!-- Action Button Group -->
					<div class="action-btn-group">
					  <button
					  idcompra='${compra.idcompra}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-compra"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-task-manager icon-1x"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-compra" idcompra='${compra.idcompra}' 
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
		document.querySelector('#tbodyCompra').innerHTML += row;
		$('[data-toggle="tooltip"]').tooltip();
	});
	buildPagination(
		beanPagination.count_filter,
		parseInt(document.querySelector('#sizePageCompra').value),
		document.querySelector('#pageCompra'),
		processAjaxCompra,
		$('#paginationCompra')
	);
	addEventsCompras();
	if (beanRequestCompra.operation == 'paginate')
		document.querySelector('#txtFilterCompra').focus();
};

var addEventsDescuento = () => {
	document
		.querySelectorAll('.btn-descuento-porcentaje-total-mas')
		.forEach((btn) => {
			//AGREGANDO EVENTO CLICK
			btn.onclick = () => {
				if (document.getElementById('txtDescuentoPorcentajeCompra').value == '')
					return;
				document.getElementById('txtDescuentoPorcentajeCompra').value++;
				let numero = numero_campo(
					document.querySelector('#txtDescuentoPorcentajeCompra')
				);
				if (numero != undefined) {
					if (numero.value != '') {
						numero.focus();
						numero.labels[0].style.fontWeight = '600';
						addClass(numero.labels[0], 'text-danger');
						showAlertTopEnd(
							'info',
							'Por favor ingrese solo numeros al campo ' +
								numero.labels[0].innerText
						);
					}
					return;
				}
				document.getElementById(
					'txtDescuentoPorcentajeCompra'
				).value = parseFloat(
					document.getElementById('txtDescuentoPorcentajeCompra').value
				).toFixed(2);
				document.getElementById('txtDescuentoCompra').value = (
					(document.getElementById('txtDescuentoPorcentajeCompra').value *
						sumaTotal) /
					100
				).toFixed(2);

				updateListDetalleEntrada(
					document.getElementById('txtDescuentoCompra').value /
						listDetalleEntrada.length
				);
			};
		});
	document
		.querySelectorAll('.btn-descuento-porcentaje-total-menos')
		.forEach((btn) => {
			//AGREGANDO EVENTO CLICK
			btn.onclick = () => {
				if (document.getElementById('txtDescuentoPorcentajeCompra').value == '')
					return;

				document.getElementById('txtDescuentoPorcentajeCompra').value--;

				if (document.getElementById('txtDescuentoPorcentajeCompra').value < 0)
					document.getElementById('txtDescuentoPorcentajeCompra').value = 0;

				let numero = numero_campo(
					document.querySelector('#txtDescuentoPorcentajeCompra')
				);
				if (numero != undefined) {
					if (numero.value != '') {
						numero.focus();
						showAlertTopEnd(
							'info',
							'Por favor ingrese sólo números al al porcentaje'
						);
					}
					return;
				}
				document.getElementById(
					'txtDescuentoPorcentajeCompra'
				).value = parseFloat(
					document.getElementById('txtDescuentoPorcentajeCompra').value
				).toFixed(2);

				document.getElementById('txtDescuentoCompra').value = (
					(document.getElementById('txtDescuentoPorcentajeCompra').value *
						sumaTotal) /
					100
				).toFixed(2);

				updateListDetalleEntrada(
					document.getElementById('txtDescuentoCompra').value /
						listDetalleEntrada.length
				);
			};
		});
	document.querySelectorAll('.btn-descuento-total-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtDescuentoCompra').value++;
			let numero = numero_campo(document.querySelector('#txtDescuentoCompra'));
			if (numero != undefined) {
				if (numero.value != '') {
					numero.focus();
					numero.labels[0].style.fontWeight = '600';
					addClass(numero.labels[0], 'text-danger');
					showAlertTopEnd(
						'info',
						'Por favor ingrese solo numeros al campo ' +
							numero.labels[0].innerText
					);
				}
				return;
			}
			document.getElementById('txtDescuentoCompra').value = parseFloat(
				document.getElementById('txtDescuentoCompra').value
			).toFixed(2);
			document.getElementById('txtDescuentoPorcentajeCompra').value = (
				(document.getElementById('txtDescuentoCompra').value * 100) /
				sumaTotal
			).toFixed(2);

			updateListDetalleEntrada(
				document.getElementById('txtDescuentoCompra').value /
					listDetalleEntrada.length
			);
		};
	});
	document.querySelectorAll('.btn-descuento-total-menos').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtDescuentoCompra').value--;
			if (document.getElementById('txtDescuentoCompra').value < 0)
				document.getElementById('txtDescuentoCompra').value = 0;
			let numero = numero_campo(document.querySelector('#txtDescuentoCompra'));
			if (numero != undefined) {
				if (numero.value != '') {
					numero.focus();
					numero.labels[0].style.fontWeight = '600';
					addClass(numero.labels[0], 'text-danger');
					showAlertTopEnd(
						'info',
						'Por favor ingrese solo numeros al campo ' +
							numero.labels[0].innerText
					);
				}
				return;
			}
			document.getElementById('txtDescuentoCompra').value = parseFloat(
				document.getElementById('txtDescuentoCompra').value
			).toFixed(2);

			document.getElementById('txtDescuentoPorcentajeCompra').value = (
				(document.getElementById('txtDescuentoCompra').value * 100) /
				sumaTotal
			).toFixed(2);

			updateListDetalleEntrada(
				document.getElementById('txtDescuentoCompra').value /
					listDetalleEntrada.length
			);
		};
	});

	document
		.querySelector('#txtDescuentoCompra')
		.addEventListener('keyup', () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (
					document.getElementById('txtDescuentoCompra').value < 0 ||
					document.getElementById('txtDescuentoCompra').value == ''
				)
					return;

				let numero = numero_campo(
					document.querySelector('#txtDescuentoCompra')
				);
				if (numero != undefined) {
					if (numero.value != '') {
						numero.focus();
						numero.labels[0].style.fontWeight = '600';
						addClass(numero.labels[0], 'text-danger');
						showAlertTopEnd(
							'info',
							'Por favor ingrese solo numeros al campo ' +
								numero.labels[0].innerText
						);
					}
					return;
				}

				document.getElementById('txtDescuentoPorcentajeCompra').value = (
					(document.getElementById('txtDescuentoCompra').value * 100) /
					sumaTotal
				).toFixed(2);

				updateListDetalleEntrada(
					document.getElementById('txtDescuentoCompra').value /
						listDetalleEntrada.length
				);

				clearTimeout(timeout);
			}, 100);
		});

	document
		.querySelector('#txtDescuentoPorcentajeCompra')
		.addEventListener('keyup', () => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (
					document.getElementById('txtDescuentoPorcentajeCompra').value < 0 ||
					document.getElementById('txtDescuentoPorcentajeCompra').value == ''
				)
					return;

				let numero = numero_campo(
					document.querySelector('#txtDescuentoPorcentajeCompra')
				);
				if (numero != undefined) {
					if (numero.value != '') {
						numero.focus();

						showAlertTopEnd(
							'info',
							'Por favor ingrese solo números al Porcentaje del Descuento'
						);
					}
					return;
				}

				document.getElementById('txtDescuentoCompra').value = (
					(document.getElementById('txtDescuentoPorcentajeCompra').value *
						sumaTotal) /
					100
				).toFixed(2);

				updateListDetalleEntrada(
					document.getElementById('txtDescuentoCompra').value /
						listDetalleEntrada.length
				);

				clearTimeout(timeout);
			}, 100);
		});
};

var addEventsCompras = () => {
	document.querySelectorAll('.editar-compra').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			compraSelected = findByCompra(btn.getAttribute('idcompra'));
			if (compraSelected != undefined) {
				metodo = true;
				document.querySelector('#txtNombreCompra').value =
					compraSelected.nombre;
				document.querySelector('#TituloModalCompra').innerHTML =
					'EDITAR COMPRA';
				document.querySelector('#txtNombreCompra').focus();
			} else {
				showAlertTopEnd(
					'warning',
					'No se encontró la compra para poder editar'
				);
			}
		};
	});
	document.querySelectorAll('.eliminar-compra').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			compraSelected = findByCompra(btn.getAttribute('idcompra'));
			beanRequestCompra.operation = 'delete';
			beanRequestCompra.type_request = 'DELETE';
			processAjaxCompra();
		};
	});
	document.querySelectorAll('.tooltip').forEach((thisbtn) => {
		removeClass(thisbtn, 'show');
		thisbtn.innerHTML = '';
	});
};

var findByCompra = (idcompra) => {
	let compra_;
	beanPaginationCompra.list.forEach((compra) => {
		if (idcompra == compra.idcompra) {
			compra_ = compra;
			return;
		}
	});
	return compra_;
};

var validateFormCompra = () => {
	if (document.querySelector('#txtNombreCompra').value == '') {
		showAlertTopEnd('warning', 'Por favor ingrese nombre');
		document.querySelector('#txtNombrenCompra').focus();
		return false;
	}
	return true;
};
/* DETALLE SALIDA*/
var precioUnitarioEntrada = (eleme, btn) => {
	if (btn.value < 0) {
		if (numeroSepararDecimal(btn.value).length > 1) {
			btn.value = 0;
		} else {
			btn.value = -1;
			return false;
		}
	}
	compraSelected = findByDetalleEntrada(
		eleme.getAttribute('iddetalle_entrada')
	);
	if (compraSelected == undefined) return false;

	eliminarDetalleEntrada(compraSelected.iddetalle_entrada);
	listDetalleEntrada.push(
		new Object(
			new Detalle_Entrada(
				compraSelected.iddetalle_entrada,
				compraSelected.cantidad,
				btn.value,
				compraSelected.impuesto,
				compraSelected.selected_igv,
				compraSelected.cantidad * btn.value -
					compraSelected.cantidad * btn.value * compraSelected.impuesto,
				compraSelected.cantidad * btn.value,
				compraSelected.entrada,
				objectPresentacion(
					btn.value,
					compraSelected.presentacion.existencia -
						compraSelected.presentacion.existencia_actual,
					compraSelected.presentacion,
					compraSelected.presentacion.presentacionExis
				),
				compraSelected.medida
			)
		)
	);
	eleme.getElementsByTagName('input')[2].value = numeroConComas(
		(btn.value * compraSelected.cantidad).toFixed(2)
	);
	eleme.getElementsByTagName('a')[1].text =
		'S/.' +
		numeroConComas(
			(
				compraSelected.cantidad * btn.value -
				compraSelected.cantidad * btn.value * compraSelected.impuesto
			).toFixed(2)
		);

	preciosTotalesCompra();
	return true;
};

var precioTotalEntrada = (eleme, btn) => {
	if (btn.value < 0) {
		if (numeroSepararDecimal(btn.value).length > 1) {
			btn.value = 0;
		} else {
			btn.value = -1;
			return false;
		}
	}
	compraSelected = findByDetalleEntrada(
		eleme.getAttribute('iddetalle_entrada')
	);
	if (compraSelected == undefined) return false;

	eliminarDetalleEntrada(compraSelected.iddetalle_entrada);
	listDetalleEntrada.push(
		new Object(
			new Detalle_Entrada(
				compraSelected.iddetalle_entrada,
				compraSelected.cantidad,
				btn.value / compraSelected.cantidad,
				compraSelected.impuesto,
				compraSelected.selected_igv,
				btn.value - btn.value * compraSelected.impuesto,
				btn.value,
				compraSelected.entrada,
				compraSelected.presentacion,
				compraSelected.medida
			)
		)
	);
	eleme.getElementsByTagName('input')[1].value = numeroConComas(
		(btn.value / compraSelected.cantidad).toFixed(2)
	);
	eleme.getElementsByTagName('a')[1].text =
		'S/.' +
		numeroConComas(
			(btn.value - btn.value * compraSelected.impuesto).toFixed(2)
		);

	preciosTotalesCompra();
	return true;
};

var cantidadEntrada = (eleme, btn) => {
	if (numeroSepararDecimal(btn.value).length > 1)
		btn.value = parseInt(btn.value);

	if (btn.value < 1) {
		btn.value = 0;
		return false;
	}
	compraSelected = findByDetalleEntrada(
		eleme.getAttribute('iddetalle_entrada')
	);
	if (compraSelected == undefined) return false;
	eliminarDetalleEntrada(compraSelected.iddetalle_entrada);
	listDetalleEntrada.push(
		new Object(
			new Detalle_Entrada(
				compraSelected.iddetalle_entrada,
				btn.value,
				compraSelected.precio,
				compraSelected.impuesto,
				compraSelected.selected_igv,
				btn.value * compraSelected.precio -
					btn.value * compraSelected.precio * compraSelected.impuesto,
				btn.value * compraSelected.precio,
				compraSelected.entrada,
				objectPresentacion(
					compraSelected.precio,
					btn.value,
					compraSelected.presentacion,
					compraSelected.presentacion.presentacionExis
				),

				compraSelected.medida
			)
		)
	);

	eleme.getElementsByTagName('a')[1].text =
		'S/. ' +
		numeroConComas(
			(
				btn.value * compraSelected.precio -
				btn.value * compraSelected.precio * compraSelected.impuesto
			).toFixed(2)
		);
	eleme.getElementsByTagName('input')[2].value = numeroConComas(
		(btn.value * compraSelected.precio).toFixed(2)
	);
	preciosTotalesCompra();
	return true;
};

var addEventsDetalleEntrada = () => {
	/* mas y menos*/
	document.querySelectorAll('.btn-cantidad-menos').forEach((btn) => {
		btn.onclick = () => {
			let eleme = btn.parentElement.parentElement.parentElement.parentElement;

			eleme.getElementsByTagName('input')[0].value--;
			if (eleme.getElementsByTagName('input')[0].value < 0)
				return eleme.getElementsByTagName('input')[0].value++;
			if (!cantidadEntrada(eleme, eleme.getElementsByTagName('input')[0]))
				eleme.getElementsByTagName('input')[0].value++;
		};
	});
	document.querySelectorAll('.btn-cantidad-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			let eleme = btn.parentElement.parentElement.parentElement.parentElement;
			eleme.getElementsByTagName('input')[0].value++;
			if (!cantidadEntrada(eleme, eleme.getElementsByTagName('input')[0]))
				eleme.getElementsByTagName('input')[0].value--;
		};
	});
	document.querySelectorAll('.btn-preciounitario-menos').forEach((btn) => {
		btn.onclick = () => {
			let eleme = btn.parentElement.parentElement.parentElement.parentElement;

			eleme.getElementsByTagName('input')[1].value--;

			if (!precioUnitarioEntrada(eleme, eleme.getElementsByTagName('input')[1]))
				eleme.getElementsByTagName('input')[1].value++;

			eleme.getElementsByTagName('input')[1].value = parseFloat(
				eleme.getElementsByTagName('input')[1].value
			).toFixed(2);
			document.getElementById('txtDescuentoCompra').value = 0;
			document.getElementById('txtDescuentoPorcentajeCompra').value = 0;
		};
	});
	document.querySelectorAll('.btn-preciounitario-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			let eleme = btn.parentElement.parentElement.parentElement.parentElement;
			eleme.getElementsByTagName('input')[1].value++;
			if (!precioUnitarioEntrada(eleme, eleme.getElementsByTagName('input')[1]))
				eleme.getElementsByTagName('input')[1].value--;
			eleme.getElementsByTagName('input')[1].value = parseFloat(
				eleme.getElementsByTagName('input')[1].value
			).toFixed(2);
			document.getElementById('txtDescuentoCompra').value = 0;
			document.getElementById('txtDescuentoPorcentajeCompra').value = 0;
		};
	});
	document.querySelectorAll('.btn-preciototal-menos').forEach((btn) => {
		btn.onclick = () => {
			let eleme = btn.parentElement.parentElement.parentElement.parentElement;

			eleme.getElementsByTagName('input')[2].value--;

			if (!precioTotalEntrada(eleme, eleme.getElementsByTagName('input')[2]))
				eleme.getElementsByTagName('input')[2].value++;

			eleme.getElementsByTagName('input')[2].value = parseFloat(
				eleme.getElementsByTagName('input')[2].value
			).toFixed(2);
			document.getElementById('txtDescuentoCompra').value = 0;
			document.getElementById('txtDescuentoPorcentajeCompra').value = 0;
		};
	});
	document.querySelectorAll('.btn-preciototal-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			let eleme = btn.parentElement.parentElement.parentElement.parentElement;
			eleme.getElementsByTagName('input')[2].value++;
			if (!precioTotalEntrada(eleme, eleme.getElementsByTagName('input')[2]))
				eleme.getElementsByTagName('input')[2].value--;
			eleme.getElementsByTagName('input')[2].value = parseFloat(
				eleme.getElementsByTagName('input')[2].value
			).toFixed(2);
			document.getElementById('txtDescuentoCompra').value = 0;
			document.getElementById('txtDescuentoPorcentajeCompra').value = 0;
		};
	});
	/* inputs teclado*/
	document.querySelectorAll('.cantidad-compra').forEach((btn) => {
		btn.onkeyup = () => {
			if (btn.value == '') return;

			let numero = numero_campo(btn);
			if (numero != undefined) {
				if (numero.value != '') {
					numero.focus();
					showAlertTopEnd('info', 'Por favor ingrese solo numeros al campo');
				}
				return;
			}
			let eleme = btn.parentElement.parentElement.parentElement;
			if (cantidadEntrada(eleme, btn));
		};
	});
	document.querySelectorAll('.preciounitario-compra').forEach((btn) => {
		btn.onkeyup = () => {
			if (btn.value == '') return;
			let numero = numero_campo(btn);
			if (numero != undefined) {
				if (numero.value != '') {
					numero.focus();

					showAlertTopEnd('info', 'Por favor ingrese solo numeros al campo');
				}
				return;
			}
			let eleme = btn.parentElement.parentElement.parentElement;
			if (precioUnitarioEntrada(eleme, btn));
		};
	});
	document.querySelectorAll('.preciototal-compra').forEach((btn) => {
		btn.onkeyup = () => {
			if (btn.value == '') return;
			let numero = numero_campo(btn);
			if (numero != undefined) {
				if (numero.value != '') {
					numero.focus();
					showAlertTopEnd('info', 'Por favor ingrese solo números al campo');
				}
				return;
			}
			let eleme = btn.parentElement.parentElement.parentElement;
			if (precioTotalEntrada(eleme, btn));
		};
	});

	/* eliminar compra*/
	document.querySelectorAll('.eliminar-detalle-entrada').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			detalle_entradaSelected = findByDetalleEntrada(
				btn.parentElement.parentElement.parentElement.parentElement.getAttribute(
					'iddetalle_entrada'
				)
			);
			eliminarDetalleEntrada(detalle_entradaSelected.iddetalle_entrada);
			toListDetalleEntrada(listDetalleEntrada);
		};
	});
	document.querySelectorAll('.tooltip').forEach((thisbtn) => {
		removeClass(thisbtn, 'show');
		thisbtn.innerHTML = '';
	});
};

var findByDetalleEntrada = (iddetalle_entrada) => {
	let detalle_entrada_;
	listDetalleEntrada.forEach((detalle_entrada) => {
		if (iddetalle_entrada == detalle_entrada.iddetalle_entrada) {
			detalle_entrada_ = detalle_entrada;
			return;
		}
	});
	return detalle_entrada_;
};

var eliminarDetalleEntrada = (idbusqueda) => {
	listDetalleEntrada = listDetalleEntrada.filter(function(obj) {
		if (obj.iddetalle_entrada == idbusqueda) {
			return undefined;
		}
		{
			return obj;
		}
	});
};

var updateListDetalleEntrada = (descuento) => {
	listDetalleEntrada.forEach((detalle_entrada) => {
		detalle_entrada.subtotal =
			detalle_entrada.total -
			descuento -
			detalle_entrada.impuesto * (detalle_entrada.total - descuento);
		detalle_entrada.total =
			detalle_entrada.precio * detalle_entrada.cantidad - descuento;
	});
	toListDetalleEntrada(listDetalleEntrada);
};

var toListDetalleEntrada = (beanPagination) => {
	let row = '';
	sumaSubTotal = 0;
	sumaTotal = 0;
	beanPagination.forEach((detalle_entrada) => {
		sumaSubTotal += detalle_entrada.subtotal;
		sumaTotal += detalle_entrada.total;
		row += `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4" iddetalle_entrada="${
				detalle_entrada.iddetalle_entrada
			}">

			<!-- Widget Extra -->
				<div class="dt-widget__extra">
					<!-- Hide Content -->
					<div class="hide-content">
						<!-- Action Button Group -->
						<div class="action-btn-group mr-2" style="margin-left: -30px;">
							<button  class="btn btn-default text-danger dt-fab-btn eliminar-detalle-entrada"
							data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Eliminar</em>">
								<i class="icon icon-trash-filled icon-lg pulse-danger"></i>
							</button>
						</div>
						<!-- /action button group -->
					</div>
					<!-- /hide content -->
				</div>
			<!-- /widget extra -->

				<!-- Widget Info -->
				<div class="dt-widget__info text-truncate" style="min-width:130px">
					<div class="dt-widget__title text-left">
						<a href="javascript:void(0)">${
							detalle_entrada.presentacion.producto == null
								? detalle_entrada.presentacion.detalle_producto_color
										.detalle_producto.producto.nombre
								: detalle_entrada.presentacion.producto.nombre
						}</a>
					</div>
					<span class="dt-widget__subtitle p-2 " style="color:transparent;background-color:${
						detalle_entrada.presentacion.producto == null
							? detalle_entrada.presentacion.detalle_producto_color.idcolor
									.codigo
							: ''
					}">...</span>
					<span class="dt-widget__subtitle">
					${
						detalle_entrada.presentacion.producto == null
							? detalle_entrada.presentacion.detalle_producto_color
									.detalle_producto.producto.codigo
							: detalle_entrada.presentacion.producto.codigo
					}</span>
				
					<span class="dt-widget__subtitle">
					${
						detalle_entrada.presentacion.producto == null
							? detalle_entrada.presentacion.detalle_producto_color
									.detalle_producto.longitud
							: ''
					}</span>
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-right  pl-2 pr-2" style=" max-width: 146px;min-width: 100px;">
					<div class="input-group search-box right-side-icon">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-menos tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>

						<input class="form-control form-control-sm cantidad-compra p-1"
						value="${numeroConComas(
							detalle_entrada.cantidad
						)}" type="text" style="height: 27px;">
										
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
							<span class="btn p-1 btn-dark m-0" >${detalle_entrada.medida}
							</span>
						</div>
					</div>

				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-right pl-2 pr-2" style=" max-width: 146px;min-width: 100px;">
					<div class="input-group search-box left-side-icon ">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-secondary btn-preciounitario-menos tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>

						<input class="form-control form-control-sm pl-6 preciounitario-compra pr-0"
						value="${numeroConComas(
							parseFloat(detalle_entrada.precio).toFixed(2)
						)}" type="text" style="height: 27px;">
						
						<span class="search-icon ml-4">s/.</span>
						
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-secondary btn-preciounitario-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
						</div>
					</div>
				
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-center pl-2 pr-2" style=" max-width: 100px;">
					<div class="dt-widget__title text-center">
						<a class="precio-subtotal-compra f-12" href="javascript:void(0)">S/. ${numeroConComas(
							detalle_entrada.subtotal.toFixed(2)
						)}</a>
					</div>
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-center pl-2 pr-2" style=" max-width: 146px; min-width:100px;">
					<div class="input-group search-box left-side-icon ">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-secondary btn-preciototal-menos tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>

						<input class="form-control form-control-sm pl-6 preciototal-compra pr-0"
						value="${numeroConComas(
							parseFloat(detalle_entrada.total).toFixed(2)
						)}" type="text" style="height: 27px;">
						
						<span class="search-icon ml-4">s/.</span>
						
						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-secondary btn-preciototal-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
						</div>
					</div>
				</div>
				<!-- /widget info -->
				
			</div>
			<!-- /widgets item -->
			`;

		$('[data-toggle="tooltip"]').tooltip();
	});

	document.getElementById('tbodyEntradaDetalle').innerHTML = row;

	document.getElementById('txtSubTotal').innerHTML =
		'S/. ' +
		numeroConComas(
			(
				sumaSubTotal - document.getElementById('txtDescuentoCompra').value
			).toFixed(2)
		);
	document.getElementById('txtImpuesto').innerHTML =
		'S/. ' +
		numeroConComas(
			(
				sumaTotal -
				sumaSubTotal -
				document.getElementById('txtDescuentoCompra').value
			).toFixed(2)
		);
	document.getElementById('txtTotal').innerHTML =
		'S/. ' +
		numeroConComas(
			(sumaTotal - document.getElementById('txtDescuentoCompra').value).toFixed(
				2
			)
		);
	addEventsDetalleEntrada();
};

var preciosTotalesCompra = () => {
	sumaSubTotal = 0;
	sumaTotal = 0;
	listDetalleEntrada.forEach((detalle_entrada) => {
		sumaSubTotal += detalle_entrada.subtotal;
		sumaTotal += detalle_entrada.total;
	});
	document.getElementById('txtSubTotal').innerHTML =
		'S/. ' + numeroConComas(sumaSubTotal.toFixed(2));
	document.getElementById('txtImpuesto').innerHTML =
		'S/. ' + numeroConComas((sumaTotal - sumaSubTotal).toFixed(2));
	document.getElementById('txtTotal').innerHTML =
		'S/. ' + numeroConComas(parseFloat(sumaTotal).toFixed(2));
};

var selectImpuestoProducto = (valor) => {
	if (1 > parseInt(valor) || parseInt(valor) > 11) {
		showAlertTopEnd('warning', 'No se encuentra Impuestos');
		return;
	}
	switch (parseInt(valor)) {
		case 1:
			return 18;
		default:
			return 0;
	}
};

var objectPresentacion = (
	preciounitario,
	cantidad = 1,
	presentacionS = undefined,
	presentExis = false
) => {
	let presentacion_;
	if (presentExis)
		presentacion_ = new Presentacion(
			parseInt(cantidad) +
				parseInt(
					presentacionS.presentacionExis == undefined
						? presentacionS.existencia
						: presentacionS.existencia_actual
				),
			parseInt(
				presentacionS.presentacionExis == undefined
					? presentacionS.existencia
					: presentacionS.existencia_actual
			),
			1,
			presentacionS.producto,
			presentacionS.detalle_producto_color,
			parseFloat(preciounitario),
			cantidad * parseFloat(preciounitario) +
				parseFloat(
					presentacionS.presentacionExis == undefined
						? presentacionS.valor_total
						: presentacionS.valor_total_actual
				),
			parseInt(
				presentacionS.presentacionExis == undefined
					? presentacionS.valor_total
					: presentacionS.valor_total_actual
			),
			(cantidad * parseFloat(preciounitario) +
				parseFloat(
					presentacionS.presentacionExis == undefined
						? presentacionS.valor_total
						: presentacionS.valor_total_actual
				)) /
				(parseInt(cantidad) +
					parseInt(
						presentacionS.presentacionExis == undefined
							? presentacionS.existencia
							: presentacionS.existencia_actual
					)),
			true
		);
	else
		presentacion_ = new Presentacion(
			cantidad,
			cantidad,
			presentacionS.tipo_producto,
			presentacionS.producto,
			presentacionS.detalle_producto_color,
			parseFloat(preciounitario),
			cantidad * parseFloat(preciounitario),
			cantidad * parseFloat(preciounitario),
			(cantidad * parseFloat(preciounitario)) / cantidad,
			false
		);
	return presentacion_;
};
var eliminarAtributosDetalleEntrada = () => {
	listDetalleEntrada.forEach(function(obj) {
		delete obj['impuesto'];
		delete obj['selected_igv'];
		delete obj['subtotal'];
		delete obj['total'];
		delete obj['medida'];
		delete obj.presentacion['presentacionExis'];
		delete obj.presentacion['existencia_actual'];
		delete obj.presentacion['valor_total_actual'];
	});
};
