var categoriaSelected;
var colorSelected;
var marcaSelected;
var beanRequestColor = new BeanRequest();
var unidadMedidaSelected;
var colorArray = new Array();
var contador = -1,
	contadorMedida = 0,
	sumaCantidad = 0,
	precioCompra = 0,
	precioGanancia = 0,
	precioVenta = 0,
	precioDescuento = 0;
document.addEventListener('DOMContentLoaded', () => {
	//INICIALIZANDO VARIABLES DE SOLICITUD
	beanRequestColor.entity_api = 'api/colores';
	beanRequestColor.operation = 'paginate';
	beanRequestColor.type_request = 'GET';
	processAjaxColor();
	/* ADD PRODUCTO */
	$('#txtColorProducto').spectrum({
		color: '#512DA8',
		showPaletteOnly: true,
		showPalette: true,
		change: function(color) {
			this.value = color.toHexString();
		},

		palette: [
			['#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff'],
			['#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f'],
			[
				'#f4cccc',
				'#fce5cd',
				'#fff2cc',
				'#d9ead3',
				'#d0e0e3',
				'#cfe2f3',
				'#d9d2e9',
				'#ead1dc'
			],
			[
				'#ea9999',
				'#f9cb9c',
				'#ffe599',
				'#b6d7a8',
				'#a2c4c9',
				'#9fc5e8',
				'#b4a7d6',
				'#d5a6bd'
			],
			[
				'#e06666',
				'#f6b26b',
				'#ffd966',
				'#93c47d',
				'#76a5af',
				'#6fa8dc',
				'#8e7cc3',
				'#c27ba0'
			],
			[
				'#c00',
				'#e69138',
				'#f1c232',
				'#6aa84f',
				'#45818e',
				'#3d85c6',
				'#674ea7',
				'#a64d79'
			],
			[
				'#900',
				'#b45f06',
				'#bf9000',
				'#38761d',
				'#134f5c',
				'#0b5394',
				'#351c75',
				'#741b47'
			],
			[
				'#600',
				'#783f04',
				'#7f6000',
				'#274e13',
				'#0c343d',
				'#073763',
				'#20124d',
				'#4c1130'
			]
		]
	});

	document.getElementById('btnAgregarDetalleProducto').onclick = () => {
		let letra_numero = letra_numero_campo(
			document.querySelector('#txtLongitudProducto')
		);
		if (validateFormProducto()) {
			if (letra_numero != undefined) {
				letra_numero.focus();
				letra_numero.labels[0].style.fontWeight = '600';
				addClass(letra_numero.labels[0], 'text-danger');
				if (letra_numero.value == '')
					showAlertTopEnd(
						'info',
						'Por favor ingrese ' + letra_numero.labels[0].innerText
					);
				else
					showAlertTopEnd(
						'info',
						'Por favor ingrese sólo texto ' + letra_numero.labels[0].innerText
					);

				return;
			} else if (
				isNaN(parseInt(document.querySelector('#txtCantidadProducto').value))
			) {
				showAlertTopEnd('warning', 'Por favor Ingrese Sólo Números');
				document.querySelector('#txtCantidadProducto').focus();
				return;
			} else {
				document.querySelector('#txtCantidadProducto').value = parseInt(
					document.querySelector('#txtCantidadProducto').value
				);
				if (
					(document.getElementById('txtColorProducto').value.charAt(0) == '#'
						? document.getElementById('txtColorProducto').value
						: '') != ''
				) {
					let objectcolor;
					colorSelected = findColor(
						document.getElementById('txtColorProducto').value
					);

					/*
					 */

					if (colorSelected == undefined) {
						let contadorColor = colorArray.length + 1;
						let ObjectColor = new Color(
							contadorColor++,
							document.getElementById('txtColorProducto').value,
							null
						);
						colorArray.push(ObjectColor);
						objectcolor = ObjectColor;
					} else {
						objectcolor = colorSelected;
					}

					/*
					 */
					if (
						findDetalleProducto(
							document.getElementById('txtLongitudProducto').value,
							objectcolor.idcolor
						) == undefined
					) {
						//

						ObjectDetalleProducto = new Detalle_Producto(
							contador,
							document.querySelector('#txtLongitudProducto').value,
							new Producto(parseInt(0))
						);

						if (
							findDetalleProducto(
								document.querySelector('#txtLongitudProducto').value
							) == undefined
						) {
							ObjectBeanDetalleProducto = new BeanDetalleProducto(
								ObjectDetalleProducto
							);
							ObjectBeanDetalleProducto.list.push(
								new Detalle_Producto_Color(
									contadorMedida++,
									objectcolor,
									document.querySelector('#txtCantidadProducto').value,
									ObjectDetalleProducto
								)
							);
							listBeanDetalleProducto.push(ObjectBeanDetalleProducto);
						} else {
							listBeanDetalleProducto.forEach((BeanDetalleProducto) => {
								if (
									BeanDetalleProducto.detalle_producto.longitud ==
									document.getElementById('txtLongitudProducto').value
								) {
									BeanDetalleProducto.list.push(
										new Detalle_Producto_Color(
											contadorMedida++,
											objectcolor,
											document.querySelector('#txtCantidadProducto').value,
											ObjectDetalleProducto
										)
									);
								}
							});
						}

						toListDetalleProducto(listBeanDetalleProducto);
						document.getElementById('txtCantidadTotalProducto').disabled = true;
						//
					} else {
						showAlertTopEnd(
							'info',
							'El color y la Longitud ya fueron ingresados'
						);
					}
				}
			}
		}
	};

	document.getElementById('buttonCollapseDetalleProducto').onclick = () => {
		if (
			document.getElementById('collapseDetalleProducto').classList[1] ==
			undefined
		) {
			addClass(document.getElementById('collapseDetalleProducto'), 'show');

			removeClass(
				document.getElementById('buttonCollapseDetalleProducto').lastChild
					.previousElementSibling,
				'icon-arrow-long-right'
			);
			addClass(
				document.getElementById('buttonCollapseDetalleProducto').lastChild
					.previousElementSibling,
				'icon-arrow-long-left'
			);
			if (listBeanDetalleProducto == 0) {
				if (beanRequestProducto.operation == 'update') {
					if (productoSelected != undefined) {
						beanRequestProducto.operation = 'detalles/properties/paginate';
						beanRequestProducto.type_request = 'GET';
						processAjaxProducto();
					} else {
						showAlertTopEnd('warning', 'No se encontró el producto');
					}
				}
			}
		} else {
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
		}
	};

	/* FLECHA MAS Y MENOS DE PORCENTAJE*/
	document.querySelectorAll('.btn-impuesto-menos').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtImpuestoProducto').value--;
			eventoIGV(
				'precio-compra',
				document.getElementById('txtPrecioCompraProducto').value
			);
		};
	});
	document.querySelectorAll('.btn-impuesto-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtImpuestoProducto').value++;
			eventoIGV(
				'precio-compra',
				document.getElementById('txtPrecioCompraProducto').value
			);
		};
	});

	document.querySelectorAll('.btn-descuento-menos').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtDescuentoPorcentajeProducto').value--;
			eventoInputDescuento();
		};
	});
	document.querySelectorAll('.btn-descuento-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtDescuentoPorcentajeProducto').value++;
			eventoInputDescuento();
		};
	});

	document.querySelectorAll('.btn-ganancia-menos').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtPrecioGananciaPorcentajeProducto').value--;
			eventoInputGanancia();
		};
	});
	document.querySelectorAll('.btn-ganancia-mas').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = () => {
			document.getElementById('txtPrecioGananciaPorcentajeProducto').value++;
			eventoInputGanancia();
		};
	});

	/* cambiar valores de precios ganancia y descuento*/
	document.getElementById('checkImpuestoCompra').onchange = () => {
		if (precioCompra != null) {
			eventoInptCompra();
		}
	};
	document.getElementById('checkImpuestoVenta').onchange = () => {
		eventoIGV(
			'precio-venta',
			parseFloat(
				document.getElementById('txtPrecioVentaProducto').value == ''
					? '0'
					: document.getElementById('txtPrecioVentaProducto').value
			),
			document.getElementById('checkImpuestoVenta').checked
		);
	};

	document.getElementById('radioConStockProducto').onchange = () => {
		removeClass(
			document.getElementById('txtPrecioCompraProducto').parentElement
				.parentElement,
			'col-12'
		);
		addClass(
			document.getElementById('txtPrecioCompraProducto').parentElement
				.parentElement,
			'col-9'
		);

		removeClass(
			document.getElementById('txtCantidadTotalProducto').parentElement,
			'd-none'
		);
		addClass(
			document.getElementById('txtCantidadTotalProducto').parentElement,
			'd-block'
		);
		removeClass(document.getElementById('txtCantidadProducto'), 'd-none');
		addClass(document.getElementById('txtCantidadProducto'), 'd-block');
		if (listBeanDetalleProducto.length > 0)
			document.getElementById('txtCantidadTotalProducto').disabled = true;
		else document.getElementById('txtCantidadTotalProducto').disabled = false;
	};
	document.getElementById('radioSinStockProducto').onchange = () => {
		document.getElementById('txtCantidadProducto').value = 0;
		removeClass(
			document.getElementById('txtPrecioCompraProducto').parentElement
				.parentElement,
			'col-9'
		);
		addClass(
			document.getElementById('txtPrecioCompraProducto').parentElement
				.parentElement,
			'col-12'
		);

		removeClass(
			document.getElementById('txtCantidadTotalProducto').parentElement,
			'd-block'
		);
		addClass(
			document.getElementById('txtCantidadTotalProducto').parentElement,
			'd-none'
		);
		document.querySelector('#txtCantidadTotalProducto').disabled = true;
		removeClass(document.getElementById('txtCantidadProducto'), 'd-block');
		addClass(document.getElementById('txtCantidadProducto'), 'd-none');
	};

	document.querySelector('#txtPrecioCompraProducto').onkeyup = () => {
		eventoInptCompra();
	};
	document.querySelector('#txtPrecioVentaProducto').onkeyup = () => {
		if (
			!validarPrecios(document.getElementById('txtPrecioVentaProducto').value)
		)
			return;
		/*precio ganancia evento */
		precioDescuento = eliminarCaracteres(
			document.getElementById('txtDescuentoProducto').value,
			','
		);
		precioVenta = eliminarCaracteres(
			document.getElementById('txtPrecioVentaProducto').value,
			','
		);
		precioGanancia =
			parseFloat(precioVenta).toFixed(2) - parseFloat(precioCompra).toFixed(2);

		document.getElementById('txtPrecioGananciaProducto').value = numeroConComas(
			precioGanancia
		);

		document.getElementById('txtPrecioGananciaPorcentajeProducto').value = (
			(precioGanancia * 100) /
			precioVenta
		).toFixed(2);
		/* evento Descuento*/
		document.getElementById('txtDescuentoPorcentajeProducto').value = parseInt(
			(precioDescuento * 100) / precioVenta
		);
		/*precio venta evento */

		eventoIGV(
			'precio-venta',
			precioVenta,
			document.getElementById('checkImpuestoVenta').checked
		);
		eventoDetalleDescuento();
	};
	document.querySelector('#txtPrecioGananciaProducto').onkeyup = () => {
		if (
			!validarPrecios(
				document.getElementById('txtPrecioGananciaProducto').value
			)
		)
			return;
		precioGanancia = eliminarCaracteres(
			document.getElementById('txtPrecioGananciaProducto').value,
			','
		);
		/*precio venta evento */
		precioVenta =
			parseFloat(precioGanancia).toFixed(2) +
			parseFloat(precioCompra).toFixed(2);
		precioVenta = precioVenta == 'NaN' ? '0' : precioVenta;

		document.getElementById('txtPrecioVentaProducto').value = numeroConComas(
			precioVenta
		);

		/*precio ganancia evento */

		document.getElementById('txtPrecioGananciaPorcentajeProducto').value = (
			(precioGanancia * 100) /
			precioCompra
		).toFixed(2);

		// document.getElementById('txtPrecioGananciaPorcentajeProducto').value =
		// document.getElementById('txtPrecioGananciaPorcentajeProducto').value ==
		// 'NaN' || 'Infinity'
		// ? '0'
		// : document.getElementById('txtPrecioGananciaPorcentajeProducto').value;
		precioDescuento = document.getElementById('txtDescuentoProducto').value;
		document.getElementById('txtDescuentoPorcentajeProducto').value = parseInt(
			(precioDescuento * 100) / precioVenta
		);

		document.getElementById('txtDescuentoPorcentajeProducto').value =
			document.getElementById('txtDescuentoPorcentajeProducto').value ==
				'NaN' || 'Infinity'
				? '0'
				: document.getElementById('txtDescuentoPorcentajeProducto').value;
		/*precio descuento evento */
		eventoDetalleDescuento();
	};
	document.querySelector('#txtDescuentoProducto').onkeyup = () => {
		if (!validarPrecios(document.getElementById('txtDescuentoProducto').value))
			return;
		precioDescuento = eliminarCaracteres(
			document.getElementById('txtDescuentoProducto').value,
			','
		);
		precioVenta = eliminarCaracteres(
			document.getElementById('txtPrecioVentaProducto').value,
			','
		);
		precioGanancia = eliminarCaracteres(
			document.getElementById('txtPrecioGananciaProducto').value,
			','
		);
		document.getElementById(
			'txtDescuentoPorcentajeProducto'
		).value = parseFloat((precioDescuento * 100) / precioVenta).toFixed(2);

		document.getElementById('txtDescuentoPorcentajeProducto').value =
			document.getElementById('txtDescuentoPorcentajeProducto').value == 'NaN'
				? '0'
				: document.getElementById('txtDescuentoPorcentajeProducto').value;

		eventoDetalleDescuento();
		eventoIGV(
			'precio-ganacia',
			precioGanancia *
				document.getElementById('txtCantidadTotalProducto').value,
			false,
			'<span class="text-primary">GANANCIA TOTAL  : </span>'
		);
	};

	document.querySelector('#txtDescuentoPorcentajeProducto').onkeyup = () => {
		if (
			!validarPrecios(
				document.getElementById('txtDescuentoPorcentajeProducto').value
			)
		)
			return;
		eventoInputDescuento();
	};
	document.querySelector(
		'#txtPrecioGananciaPorcentajeProducto'
	).onkeyup = () => {
		if (
			!validarPrecios(
				document.getElementById('txtPrecioGananciaPorcentajeProducto').value
			)
		)
			return;
		eventoInputGanancia();
	};

	/* SELECTED MONEDA*/
	document.getElementById('txtMonedaCompraProducto').onchange = () => {
		document.getElementById(
			'txtMonedaCompraProducto'
		).nextElementSibling.nextElementSibling.innerHTML = selectMoneda(
			parseInt(document.getElementById('txtMonedaCompraProducto').value)
		);
	};
	document.getElementById('txtMonedaVentaProducto').onchange = () => {
		let moneda = selectMoneda(
			parseInt(document.getElementById('txtMonedaVentaProducto').value)
		);
		document.getElementById(
			'txtMonedaVentaProducto'
		).nextElementSibling.nextElementSibling.innerHTML = moneda;
		document.getElementById(
			'txtPrecioGananciaProducto'
		).nextElementSibling.innerHTML = moneda;
		document.getElementById(
			'txtDescuentoProducto'
		).nextElementSibling.innerHTML = moneda;
	};
});
/* EVENTO PRECIOS*/
function eventoInptCompra() {
	if (!validarPrecios(document.getElementById('txtPrecioCompraProducto').value))
		return;

	document.getElementById('checkImpuestoCompra').checked == true
		? (precioCompra = eliminarCaracteres(
				document.getElementById('txtPrecioCompraProducto').value,
				','
		  ))
		: (precioCompra =
				parseFloat(
					eliminarCaracteres(
						document.getElementById('txtPrecioCompraProducto').value,
						','
					)
				).toFixed(2) +
				parseFloat(
					(selectImpuestoProducto(
						document.getElementById('selectImpuestoProducto').value
					) /
						100) *
						eliminarCaracteres(
							document.getElementById('txtPrecioCompraProducto').value,
							','
						)
				).toFixed(2));

	if (precioCompra == null) precioCompra = 0;

	eventoIGV(
		'precio-compra',
		parseFloat(precioCompra == '' ? '0' : precioCompra),
		document.getElementById('checkImpuestoCompra').checked,
		selectMoneda(
			parseInt(document.getElementById('txtMonedaCompraProducto').value)
		)
	);
	/* evento ganancia */
	precioGanancia = parseFloat(
		(precioCompra == ''
			? '0'
			: precioCompra *
			  document.getElementById('txtPrecioGananciaPorcentajeProducto').value) /
			100
	).toFixed(2);
	document.getElementById('txtPrecioGananciaPorcentajeProducto').value =
		parseFloat(
			(parseFloat(precioGanancia) * 100) /
				parseFloat(precioCompra == '' ? '0' : precioCompra)
		).toFixed(2) == 'NaN'
			? '0'
			: parseFloat(
					(parseFloat(precioGanancia) * 100) /
						parseFloat(precioCompra == '' ? '0' : precioCompra)
			  ).toFixed(2);

	document.getElementById('txtPrecioGananciaProducto').value = numeroConComas(
		precioGanancia
	);
	/* evento venta*/
	precioVenta = (
		parseFloat(precioCompra) +
		parseFloat(
			(precioCompra *
				document.getElementById('txtPrecioGananciaPorcentajeProducto').value) /
				100
		)
	).toFixed(2);

	document.getElementById('txtPrecioVentaProducto').value = numeroConComas(
		precioVenta
	);

	eventoIGV(
		'precio-venta',
		parseFloat(precioVenta == '' ? '0' : precioVenta),
		document.getElementById('checkImpuestoVenta').checked,
		selectMoneda(
			parseInt(document.getElementById('txtMonedaVentaProducto').value)
		)
	);

	/* evento Descuento*/
	precioDescuento = eliminarCaracteres(
		document.getElementById('txtDescuentoProducto').value,
		','
	);
	document.getElementById('txtDescuentoPorcentajeProducto').value = parseInt(
		(precioDescuento * 100) / precioVenta
	);

	document.getElementById('txtDescuentoPorcentajeProducto').value =
		document.getElementById('txtDescuentoPorcentajeProducto').value == 'NaN'
			? '0'
			: document.getElementById('txtDescuentoPorcentajeProducto').value;
	eventoDetalleDescuento();
}
function eventoInputGanancia() {
	precioGanancia = parseFloat(
		(precioCompra *
			document.getElementById('txtPrecioGananciaPorcentajeProducto').value) /
			100
	);
	precioVenta = (parseFloat(precioCompra) + parseFloat(precioGanancia)).toFixed(
		2
	);
	document.getElementById('txtPrecioGananciaProducto').value = numeroConComas(
		precioGanancia
	);
	document.getElementById('txtPrecioVentaProducto').value = numeroConComas(
		precioVenta
	);
	eventoDetalleDescuento();
}
function eventoInputDescuento() {
	precioDescuento = parseFloat(
		(precioVenta *
			document.getElementById('txtDescuentoPorcentajeProducto').value) /
			100
	).toFixed(2);
	document.getElementById('txtDescuentoProducto').value = numeroConComas(
		precioDescuento
	);
	eventoDetalleDescuento();
}
function eventoDetalleDescuento() {
	eventoIGV(
		'precio-ganancia-descuento',
		parseFloat(precioGanancia).toFixed(2) -
			parseFloat(precioDescuento).toFixed(2),
		false,
		'<span class="text-primary">Ganancia </span> (Ganancia - Descuento) <span class="text-primary">==> </span> Incluye IGV : ' +
			selectMoneda(
				parseInt(document.getElementById('txtMonedaVentaProducto').value)
			) +
			' '
	);
	eventoIGV(
		'precio-venta-descuento',
		parseFloat(precioVenta).toFixed(2) - parseFloat(precioDescuento).toFixed(2),
		false,
		'<span class="text-primary">Precio de Venta Total </span>(Precio de Venta - Descuento)  <span class="text-primary">==> </span> Incluye IGV : ' +
			selectMoneda(
				parseInt(document.getElementById('txtMonedaVentaProducto').value)
			) +
			' '
	);
}
function eventoIGV(Class, Elemento, ElementoCheck = false, texto2 = '') {
	document.querySelectorAll('.' + Class + '-opcionaligv').forEach((btn) => {
		if (Elemento == '') addClass(btn.parentElement, 'sr-only');
		else removeClass(btn.parentElement, 'sr-only');

		if (ElementoCheck)
			return (btn.innerHTML =
				'Precio sin IGV : ' +
				texto2 +
				' ' +
				numeroConComas(
					(
						Elemento -
						(selectImpuestoProducto(
							document.getElementById('selectImpuestoProducto').value
						) /
							100) *
							Elemento
					).toFixed(2)
				));

		precioCompra = (
			parseFloat(Elemento) +
			(selectImpuestoProducto(
				document.getElementById('selectImpuestoProducto').value
			) /
				100) *
				Elemento
		).toFixed(2);
		btn.innerHTML =
			'Precio Incluye IGV : ' + texto2 + ' ' + numeroConComas(precioCompra);
	});
	document.querySelectorAll('.' + Class + '-conigv').forEach((btn) => {
		if (Elemento == '') addClass(btn.parentElement, 'sr-only');
		else removeClass(btn.parentElement, 'sr-only');

		btn.innerHTML = texto2 + numeroConComas(Elemento.toFixed(2));
	});
	document.querySelectorAll('.' + Class + '-igv').forEach((btn) => {
		if (Elemento == '') addClass(btn.parentElement, 'sr-only');
		else removeClass(btn.parentElement, 'sr-only');
		if (texto2.includes('GANANCIA TOTAL'))
			texto2 = '<span class="text-primary">IGV : </span> S/.';
		else texto2 = 'IGV : ' + texto2;

		btn.innerHTML =
			texto2 +
			' ' +
			numeroConComas(
				(
					(selectImpuestoProducto(
						document.getElementById('selectImpuestoProducto').value
					) /
						100) *
					Elemento
				).toFixed(2)
			);
	});
}
var validarPrecios = (numero) => {
	let numeroReg = /^[0-9.,]*$/;
	return numeroReg.test(numero);
};
var selectMoneda = (valor) => {
	switch (valor) {
		case 1:
			return 'S/.';
		case 2:
			return '\u0024';
		case 3:
			return '\u00a5';
		case 4:
			return '\u20ac';

		default:
			return '';
	}
};
var selectImpuestoProducto = (valor) => {
	if (1 > parseInt(valor) || parseInt(valor) > 11) {
		showAlertTopEnd('warning', 'No se encuentra Impuestos');
		return;
	}
	switch (parseInt(valor)) {
		case 1:
			return 18.0;
		default:
			return 0;
	}
};
function validateFormPrecios() {
	if (precioCompra == null) {
		showAlertTopEnd('info', 'Por favor ingrese Precio de Compra');
		document.querySelector('#txtPrecioCompraProducto').focus();
		return false;
	} else if (precioGanancia == null || precioGanancia == 0) {
		showAlertTopEnd('info', 'Por favor ingrese Ganancia');
		document.querySelector('#txtPrecioGananciaProducto').focus();
		return false;
	} else if (precioDescuento == null || precioDescuento == 0) {
		showAlertTopEnd('info', 'Por favor ingrese Descuento');
		document.querySelector('#txtDescuentoProducto').focus();
		return false;
	} else if (precioVenta == null || precioVenta == 0) {
		showAlertTopEnd('info', 'Por favor ingrese Precio de Venta');
		document.querySelector('#txtPrecioVentaProducto').focus();
		return false;
	}

	return true;
}
/* EVENTO DETALLE PRODUCTO(LONGITUD-COLOR)*/
function addEventsDetalleMedida() {
	document.querySelectorAll('.btn-detalle-medida-producto').forEach((btn) => {
		//AGREGANDO EVENTO CLICK
		btn.onclick = function() {
			eliminarlistBeanDetalleProducto(
				btn.getAttribute('iddetalle-medida-producto')
			);
			toListDetalleProducto(listBeanDetalleProducto);
		};
	});
	document.querySelectorAll('.tooltip').forEach((thisbtn) => {
		removeClass(thisbtn, 'show');
		thisbtn.innerHTML = '';
	});
}
function eliminarlistBeanDetalleProducto(idbusqueda) {
	listBeanDetalleProducto = listBeanDetalleProducto.filter(
		(beanDetalleProducto) => {
			beanDetalleProducto.list = elimina(beanDetalleProducto, idbusqueda);
			if (beanDetalleProducto.list.length > 0) {
				return beanDetalleProducto;
			} else {
				return undefined;
			}
		}
	);
}
function elimina(beanDetalleProducto, idbusqueda) {
	return beanDetalleProducto.list.filter((detalleProductoColor) => {
		if (detalleProductoColor.iddetalle_producto_color == idbusqueda) {
			return undefined;
		} else {
			return detalleProductoColor;
		}
	});
}
function findDetalleProducto(longitud, idcolor = '') {
	let producto_;
	let x = false;
	listBeanDetalleProducto.forEach((medidaDetalleProducto) => {
		if (longitud == medidaDetalleProducto.detalle_producto.longitud) {
			if (idcolor == '') {
				producto_ = medidaDetalleProducto;
				return;
			} else {
				medidaDetalleProducto.list.forEach((detalle_producto_color) => {
					if (detalle_producto_color.idcolor.idcolor == idcolor) {
						x = true;
						return;
					}
				});

				if (x) {
					producto_ = medidaDetalleProducto;
					return;
				}
			}
		}
	});
	return producto_;
}
var toListDetalleProducto = (beanPagination) => {
	document.querySelector('#tbodyDetalleProducto').innerHTML = '';
	if (beanPagination.length == 0) {
		removeClass(
			document.getElementById('collapseDetalleProducto').lastChild
				.previousElementSibling,
			'p-1'
		);
		sumaCantidad = 0;
		document.querySelector('#txtLongitudProducto').value = '';
		document.querySelector('#txtCantidadProducto').value = '';
		document.querySelector('#txtCantidadTotalProducto').value = sumaCantidad;
		document.querySelector('#txtCantidadTotalProducto').disabled = false;
		document.getElementById('txtCantidadTotalProducto').focus();
		return;
	}
	let row = '';
	sumaCantidad = 0;
	document.querySelector('#tbodyDetalleProducto').innerHTML += row;
	beanPagination.forEach((beanDetalleProducto) => {
		row = `
			<!-- Widget Item -->
		  <div class="dt-widget__item mb-0 pb-0 pt-0 border-top" >

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

		beanDetalleProducto.list.forEach((detalleProductoColor) => {
			sumaCantidad =
				parseInt(sumaCantidad) + parseInt(detalleProductoColor.cantidad);
			row += `
					<button type="button" class="btn btn-primary m-1 p-2 border-0 btn-detalle-medida-producto"
					data-toggle="tooltip"
					data-html="true" title="" data-original-title="<em>Eliminar</em>"
					iddetalle-medida-producto="${detalleProductoColor.iddetalle_producto_color}"
					style="background:${detalleProductoColor.idcolor.codigo};">
						<span class="badge badge-pill badge-light p-1" style="color:black;">${detalleProductoColor.cantidad}</span>
                    </button>
					`;
		});

		row += `    </div>
					<!-- /show content -->
					  </div>
		 		 <!-- /widget extra -->

		 		 </div>
	  		<!-- /widgets item -->
		`;

		document.querySelector('#tbodyDetalleProducto').innerHTML += row;
		$('[data-toggle="tooltip"]').tooltip();
	});
	addClass(
		document.getElementById('collapseDetalleProducto').lastChild
			.previousElementSibling,
		'p-1'
	);
	document.querySelector('#txtCantidadTotalProducto').value = sumaCantidad;
	eventoIGV(
		'precio-ganacia',
		document.getElementById('txtPrecioGananciaProducto').value *
			document.getElementById('txtCantidadTotalProducto').value,
		'<span class="text-primary">GANANCIA SUBTOTAL : </span>',
		'<span class="text-primary">GANANCIA TOTAL  : </span>'
	);
	addEventsDetalleMedida();
};
function tolistUpdateDetalleProducto(beanPagination) {
	listBeanDetalleProducto.length = 0;
	let longitudTemporal = '';
	let contadorTemporal = 0;
	let ultimo = beanPagination.list.length;
	beanPagination.list.forEach((detallecolorproducto) => {
		contadorTemporal++;
		if (detallecolorproducto.detalle_producto.longitud != longitudTemporal) {
			if (contadorTemporal !== 1) {
				listBeanDetalleProducto.push(ObjectBeanDetalleProducto);
			}
			longitudTemporal = detallecolorproducto.detalle_producto.longitud;
			ObjectBeanDetalleProducto = ObjectBeanDetalleProducto = new BeanDetalleProducto(
				detallecolorproducto.detalle_producto
			);
			ObjectBeanDetalleProducto.list.push(detallecolorproducto);
		} else {
			ObjectBeanDetalleProducto.list.push(detallecolorproducto);
		}
		if (contadorTemporal == ultimo)
			listBeanDetalleProducto.push(ObjectBeanDetalleProducto);
	});

	toListDetalleProducto(listBeanDetalleProducto);
}
/* ACCIONES DEL  PRODUCTO*/
function validateFormProducto() {
	let letra_numero = letra_numero_campo(
		document.querySelector('#txtCodigoProducto'),
		document.querySelector('#txtCategoriaProducto'),
		document.querySelector('#txtUnidadMedidaProducto'),
		document.querySelector('#txtNombreProducto')
	);
	if (letra_numero != undefined) {
		letra_numero.focus();
		addClass(letra_numero.labels[0], 'text-danger font-weight-400');
		if (letra_numero.value == '')
			showAlertTopEnd(
				'info',
				'Por favor ingrese ' + letra_numero.labels[0].innerText
			);
		else
			showAlertTopEnd(
				'info',
				'Por favor ingrese solo Letras al campo ' +
					letra_numero.labels[0].innerText
			);

		return false;
	}

	if (categoriaSelected == undefined) {
		showAlertTopEnd('warning', 'Por favor seleccione categoria');
		return false;
	}
	if (unidadMedidaSelected == undefined) {
		showAlertTopEnd('warning', 'Por favor seleccione Unidad de Medida');
		return false;
	}
	if (marcaSelected == undefined) {
		showAlertTopEnd('warning', 'Por favor seleccione Marca');
		return false;
	}
	if (isNaN(parseInt(document.querySelector('#txtEstadoProducto').value))) {
		showAlertTopEnd('warning', 'Por favor Seleccione un Estado');
		document.querySelector('#txtEstadoProducto').value.focus();
		return false;
	}
	if (
		isNaN(parseInt(document.querySelector('#txtCantidadMinimaProducto').value))
	) {
		showAlertTopEnd(
			'warning',
			'Por favor Ingrese Sólo Números a la cantidad mínima'
		);
		document.querySelector('#txtCantidadMinimaProducto').focus();
		return false;
	}

	document.querySelector('#txtCantidadMinimaProducto').value = parseInt(
		document.querySelector('#txtCantidadMinimaProducto').value
	);

	return true;
}
function addProducto(productoselected = undefined) {
	//LIMPIAR LOS CAMPOS
	document.querySelector('#txtCodigoProducto').value =
		productoselected == undefined ? '' : productoselected.codigo;
	document.querySelector('#txtNombreProducto').value =
		productoselected == undefined ? '' : productoselected.nombre;
	document.querySelector('#txtPrecioCompraProducto').value =
		productoselected == undefined ? '0' : productoselected.precio_costo;
	document.querySelector('#txtPrecioVentaProducto').value =
		productoselected == undefined
			? '0'
			: productoselected.precio_costo *
			  (1 - productoselected.ganancia_porcentaje / 100);
	document.querySelector('#txtDescuentoProducto').value =
		productoselected == undefined
			? '0'
			: (productoselected.precio_costo *
					(1 + productoselected.ganancia_porcentaje / 100) *
					productoselected.descuento_porcentaje) /
			  100;
	document.querySelector('#txtEstadoProducto').value =
		productoselected == undefined ? '1' : productoselected.estado;
	document.querySelector('#txtDescripcionProducto').value =
		productoselected == undefined ? '' : productoselected.descripcion;
	categoriaSelected =
		productoselected == undefined ? undefined : productoselected.categoria;
	document.querySelector('#txtCategoriaProducto').value =
		categoriaSelected == undefined ? '' : categoriaSelected.nombre;
	unidadMedidaSelected =
		productoselected == undefined ? undefined : productoselected.unidad_medida;
	document.querySelector('#txtUnidadMedidaProducto').value =
		unidadMedidaSelected == undefined ? '' : unidadMedidaSelected.nombre;
	marcaSelected =
		productoselected == undefined ? undefined : productoselected.marca;
	document.querySelector('#txtMarcaProducto').value =
		marcaSelected == undefined ? '' : marcaSelected.nombre;
	document.querySelector('#txtCantidadTotalProducto').value =
		productoselected == undefined ? '' : productoselected.cantidad;
	if (productoselected != undefined) {
		document.getElementById('txtPrecioGananciaPorcentajeProducto').value =
			productoselected.ganancia_porcentaje;
		eventoInptCompra();
	}
}
/* ACCIONES DEL COLOR*/
function processAjaxColor() {
	let parameters_pagination = '';
	let json = '';
	let url_request =
		getHostAPI() +
		beanRequestColor.entity_api +
		'/' +
		beanRequestColor.operation;
	switch (beanRequestColor.operation) {
		case 'add':
			break;

		default:
			parameters_pagination += '?nombre=';

			url_request += parameters_pagination;
			break;
	}
	$.ajax({
		url: url_request,
		type: beanRequestColor.type_request,
		headers: {
			Authorization: 'Bearer ' + Cookies.get('tienda_token')
		},
		data: JSON.stringify(json),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json'
	})
		.done(function(beanCrudResponse) {
			colorArray = beanCrudResponse.beanPagination.list;
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			console.log('FALLA DE API COLORES');
			$('#modalCargandoSelectedProductoC').modal('hide');
			showAlertErrorRequest();
		});
}
function findColor(colorCodigo) {
	let color_;
	colorArray.forEach((color) => {
		if (colorCodigo == color.codigo) {
			color_ = color;
			return;
		}
	});
	return color_;
}
