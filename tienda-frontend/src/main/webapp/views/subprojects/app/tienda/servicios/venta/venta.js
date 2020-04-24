var beanPaginationVenta;
var ventaSelected;
var productoSelected;
var productoColorSelected;
var detalle_salidaSelected;
var metodo = false;
var beanRequestVenta = new BeanRequest();
var colorArray = [];
var contador = 0,
    sumaSubTotal = 0,
    sumaTotal = 0,
    descuentoMinimo = 0;
document.addEventListener("DOMContentLoaded", function() {
    //invocar funcion agregar
    //addVenta();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestVenta.entity_api = "api/salidas";
    beanRequestVenta.operation = "paginate";
    beanRequestVenta.type_request = "GET";
    $("#FrmVenta").submit(function(event) {
        beanRequestVenta.operation = "paginate";
        beanRequestVenta.type_request = "GET";
        processAjaxVenta();
        event.preventDefault();
        event.stopPropagation();
    });

    $("#FrmVentaModal").submit(function(event) {
        if (metodo) {
            beanRequestVenta.operation = "update";
            beanRequestVenta.type_request = "PUT";
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestVenta.operation = "add";
            beanRequestVenta.type_request = "POST";
        }
        event.preventDefault();
        event.stopPropagation();
        // if (validateFormVenta()) {
        processAjaxVenta();
        // }
    });

    $("#sizePageVenta").change(function() {
        $("#modalCargandoVenta").modal("show");
    });
    addEventsDescuento();
    $("#txtFechaVenta").datetimepicker({
        defaultDate: new Date(),
        format: "DD/MM/YYYY HH:mm:ss",
        icons: calIcons
    });
});
var newSelected = () => {
    /* VALIDAR PRODUCTO Y PRODUCTOCOLOR y PRESENTACION*/
    if (presentacionSelected == undefined)
        return showAlertTopEnd("info", "No cuenta con Stock este producto");
    else if (presentacionSelected.existencia == 0)
        return showAlertTopEnd("info", "No cuenta con Stock este producto");

    if (
        !(productoSelected != undefined || productoColorSelected != undefined)
    ) {
        return showAlertTopEnd("info", "Por favor ingrese Producto");
    }

    /* INGRESAR NULL A PRODUCTO Y PRODUCTOCOLOR*/
    if (productoSelected == undefined) productoSelected = null;
    if (productoColorSelected == undefined) productoColorSelected = null;
    /* OPERACION AGREGAR*/
    let precioUnitario = presentacionSelected.inventario_final;

    let precioVenta =
        precioUnitario *
        (1 +
            (productoSelected == null
                ? productoColorSelected.detalle_producto.producto
                      .ganancia_porcentaje
                : productoSelected.ganancia_porcentaje) /
                100);

    let impuesto = selectImpuestoProducto(
        productoSelected == null
            ? productoColorSelected.detalle_producto.producto.impuesto
            : productoSelected.impuesto
    );

    listDetalleSalida.push(
        new Detalle_Salida(
            contador++,
            1,
            presentacionSelected.existencia,
            precioVenta,
            document.getElementById("txtDescuentoVenta").value,
            productoSelected == null
                ? productoColorSelected.detalle_producto.producto
                      .descuento_porcentaje
                : productoSelected.descuento_porcentaje,
            impuesto,
            precioUnitario * (1 - impuesto / 100) -
                document.getElementById("txtDescuentoVenta").value,

            precioVenta - document.getElementById("txtDescuentoVenta").value,
            new Salida(1),
            objectPresentacion(
                precioVenta -
                    document.getElementById("txtDescuentoVenta").value,
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
    productoSelected = undefined;
    productoColorSelected = undefined;
    updateListDetalleSalida(
        document.getElementById("txtDescuentoVenta").value /
            listDetalleSalida.length
    );
};
var addVenta = () => {
    //LIMPIAR LOS CAMPOS
    document.querySelector("#txtFechaVenta").value = "";
    //SET TITLE MODAL
    document.querySelector("#TituloModalVenta").innerHTML = "REGISTRAR COMPRA";
};

var processAjaxVenta = () => {
    SwalProgress();
    showProgress(
        '<i class="text-primary font-weight-600 display-8" style="font-size: 16px;">Cargando Venta </i>'
    );
    let parameters_pagination = "";
    let json = "";
    if (
        beanRequestVenta.operation == "add" ||
        beanRequestVenta.operation == "update"
    ) {
        eliminarAtributosDetalleSalida();
        json = {
            salida: new Salida(
                parseInt(1),
                document.getElementsByClassName(
                    "datetimepicker-input"
                )[0].value,
                3
            ),
            list: listDetalleSalida
        };
    }
    switch (beanRequestVenta.operation) {
        case "delete":
            parameters_pagination = "/" + salidaSelected.idsalida;
            break;
        case "update":
            json.salida.idsalida = salidaSelected.idsalida;
            break;
        case "add":
            break;

        default:
            if (document.querySelector("#txtFilterVenta").value != "") {
                document.querySelector("#pageVenta").value = 1;
            }
            parameters_pagination +=
                "?nombre=" +
                limpiar_Campo(
                    document.querySelector("#txtFilterVenta").value
                ).toLowerCase();
            parameters_pagination +=
                "&page=" + document.querySelector("#pageVenta").value;
            parameters_pagination +=
                "&size=" + document.querySelector("#sizePageVenta").value;
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestVenta, json, parameters_pagination, "Venta");
    xhr.onload = () => {
        hideProgress();
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == "ok") {
                showAlertTopEnd("success", "Acción realizada exitosamente");
            } else {
                showAlertTopEnd("warning", beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationVenta = beanCrudResponse.beanPagination;
            toListVenta(beanPaginationVenta);
        }
    };
};

var toListVenta = beanPagination => {
    document.querySelector("#tbodyVenta").innerHTML = "";
    document.querySelector("#titleManagerVenta").innerHTML =
        "[ " + beanPagination.count_filter + " ] COMPRAS";
    if (beanPagination.count_filter == 0) {
        destroyPagination($("#paginationVenta"));
        showAlertTopEnd("warning", "No se encontraron resultados");
        document.querySelector("#txtFilterVenta").focus();
        return;
    }
    let row;
    document.querySelector("#tbodyVenta").innerHTML += row;
    beanPagination.list.forEach(venta => {
        row = `
		              <!-- Widget Item -->
				<div class="dt-widget__item">
				  <!-- Widget Info -->
				  <div class="dt-widget__info text-truncate">
					<p class="dt-widget__subtitle text-truncate">
					${venta.nombre}
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
					  idventa='${venta.idventa}'
						type="button"
						class="btn btn-default text-success dt-fab-btn editar-venta"
						data-toggle="tooltip"
						data-html="true"
						title=""
						data-original-title="<em>Editar</em>"
					  >
						<i class="icon icon-task-manager icon-1x"></i>
					  </button>
					  <button
						type="button"
						class="btn btn-default text-danger dt-fab-btn eliminar-venta" idventa='${venta.idventa}'
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
        document.querySelector("#tbodyVenta").innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector("#sizePageVenta").value),
        document.querySelector("#pageVenta"),
        processAjaxVenta,
        $("#paginationVenta")
    );
    addEventsVentas();
    if (beanRequestVenta.operation == "paginate")
        document.querySelector("#txtFilterVenta").focus();
};

var addEventsDescuento = () => {
    document
        .querySelectorAll(".btn-descuento-porcentaje-total-mas")
        .forEach(btn => {
            //AGREGANDO EVENTO CLICK
            btn.onclick = () => {
                if (
                    document.getElementById("txtDescuentoPorcentajeVenta")
                        .value == ""
                )
                    return;
                document.getElementById("txtDescuentoPorcentajeVenta").value++;
                let numero = numero_campo(
                    document.querySelector("#txtDescuentoPorcentajeVenta")
                );
                if (numero != undefined) {
                    if (numero.value != "") {
                        numero.focus();
                        numero.labels[0].style.fontWeight = "600";
                        addClass(numero.labels[0], "text-danger");
                        showAlertTopEnd(
                            "info",
                            "Por favor ingrese solo numeros al campo " +
                                numero.labels[0].innerText
                        );
                    }
                    return;
                }
                document.getElementById(
                    "txtDescuentoPorcentajeVenta"
                ).value = parseFloat(
                    document.getElementById("txtDescuentoPorcentajeVenta").value
                ).toFixed(2);
                document.getElementById("txtDescuentoVenta").value = (
                    (document.getElementById("txtDescuentoPorcentajeVenta")
                        .value *
                        sumaTotal) /
                    100
                ).toFixed(2);

                if (
                    parseFloat(
                        document.getElementById("txtDescuentoVenta").value
                    ).toFixed(2) >
                    descuentoMinimo * listDetalleSalida.length
                ) {
                    document.getElementById("txtDescuentoVenta").value = (
                        descuentoMinimo * listDetalleSalida.length
                    ).toFixed(2);
                    document.getElementById(
                        "txtDescuentoPorcentajeVenta"
                    ).value = (
                        (100 *
                            document.getElementById("txtDescuentoVenta")
                                .value) /
                        sumaTotal
                    ).toFixed(2);
                    showAlertTopEnd(
                        "info",
                        "El monto del descuento es superior al descuento mínimo de los Productos"
                    );
                }

                updateListDetalleSalida(
                    document.getElementById("txtDescuentoVenta").value /
                        listDetalleSalida.length
                );
            };
        });
    document
        .querySelectorAll(".btn-descuento-porcentaje-total-menos")
        .forEach(btn => {
            //AGREGANDO EVENTO CLICK
            btn.onclick = () => {
                if (
                    document.getElementById("txtDescuentoPorcentajeVenta")
                        .value == ""
                )
                    return;

                document.getElementById("txtDescuentoPorcentajeVenta").value--;

                if (
                    document.getElementById("txtDescuentoPorcentajeVenta")
                        .value < 0
                )
                    document.getElementById(
                        "txtDescuentoPorcentajeVenta"
                    ).value = 0;

                let numero = numero_campo(
                    document.querySelector("#txtDescuentoPorcentajeVenta")
                );
                if (numero != undefined) {
                    if (numero.value != "") {
                        numero.focus();
                        showAlertTopEnd(
                            "info",
                            "Por favor ingrese sólo números al al porcentaje"
                        );
                    }
                    return;
                }
                document.getElementById(
                    "txtDescuentoPorcentajeVenta"
                ).value = parseFloat(
                    document.getElementById("txtDescuentoPorcentajeVenta").value
                ).toFixed(2);

                document.getElementById("txtDescuentoVenta").value = (
                    (document.getElementById("txtDescuentoPorcentajeVenta")
                        .value *
                        sumaTotal) /
                    100
                ).toFixed(2);

                if (
                    parseFloat(
                        document.getElementById("txtDescuentoVenta").value
                    ).toFixed(2) >
                    descuentoMinimo * listDetalleSalida.length
                ) {
                    document.getElementById("txtDescuentoVenta").value = (
                        descuentoMinimo * listDetalleSalida.length
                    ).toFixed(2);
                    document.getElementById(
                        "txtDescuentoPorcentajeVenta"
                    ).value = (
                        (100 *
                            document.getElementById("txtDescuentoVenta")
                                .value) /
                        (sumaTotal +
                            parseFloat(
                                document.getElementById("txtDescuentoVenta")
                                    .value
                            ))
                    ).toFixed(2);
                    showAlertTopEnd(
                        "info",
                        "El monto del descuento es superior al descuento mínimo de los Productos"
                    );
                }

                updateListDetalleSalida(
                    document.getElementById("txtDescuentoVenta").value /
                        listDetalleSalida.length
                );
            };
        });
    document.querySelectorAll(".btn-descuento-total-mas").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            document.getElementById("txtDescuentoVenta").value++;
            let numero = numero_campo(
                document.querySelector("#txtDescuentoVenta")
            );
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    numero.labels[0].style.fontWeight = "600";
                    addClass(numero.labels[0], "text-danger");
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo numeros al campo " +
                            numero.labels[0].innerText
                    );
                }
                return;
            }
            document.getElementById("txtDescuentoVenta").value = parseFloat(
                document.getElementById("txtDescuentoVenta").value
            ).toFixed(2);
            document.getElementById("txtDescuentoPorcentajeVenta").value = (
                (document.getElementById("txtDescuentoVenta").value * 100) /
                sumaTotal
            ).toFixed(2);

            if (
                parseFloat(
                    document.getElementById("txtDescuentoVenta").value
                ).toFixed(2) >
                descuentoMinimo * listDetalleSalida.length
            ) {
                document.getElementById("txtDescuentoVenta").value = (
                    descuentoMinimo * listDetalleSalida.length
                ).toFixed(2);
                document.getElementById("txtDescuentoPorcentajeVenta").value = (
                    (100 * document.getElementById("txtDescuentoVenta").value) /
                    sumaTotal
                ).toFixed(2);
                showAlertTopEnd(
                    "info",
                    "El monto del descuento es superior al descuento mínimo de los Productos"
                );
            }

            updateListDetalleSalida(
                document.getElementById("txtDescuentoVenta").value /
                    listDetalleSalida.length
            );
        };
    });
    document.querySelectorAll(".btn-descuento-total-menos").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            document.getElementById("txtDescuentoVenta").value--;
            if (document.getElementById("txtDescuentoVenta").value < 0)
                document.getElementById("txtDescuentoVenta").value = 0;
            let numero = numero_campo(
                document.querySelector("#txtDescuentoVenta")
            );
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    numero.labels[0].style.fontWeight = "600";
                    addClass(numero.labels[0], "text-danger");
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo numeros al campo " +
                            numero.labels[0].innerText
                    );
                }
                return;
            }
            document.getElementById("txtDescuentoVenta").value = parseFloat(
                document.getElementById("txtDescuentoVenta").value
            ).toFixed(2);

            document.getElementById("txtDescuentoPorcentajeVenta").value = (
                (document.getElementById("txtDescuentoVenta").value * 100) /
                sumaTotal
            ).toFixed(2);
            if (
                parseFloat(
                    document.getElementById("txtDescuentoVenta").value
                ).toFixed(2) >
                descuentoMinimo * listDetalleSalida.length
            ) {
                document.getElementById("txtDescuentoVenta").value = (
                    descuentoMinimo * listDetalleSalida.length
                ).toFixed(2);
                document.getElementById("txtDescuentoPorcentajeVenta").value = (
                    (100 * document.getElementById("txtDescuentoVenta").value) /
                    sumaTotal
                ).toFixed(2);
                showAlertTopEnd(
                    "info",
                    "El monto del descuento es superior al descuento mínimo de los Productos"
                );
            }

            updateListDetalleSalida(
                document.getElementById("txtDescuentoVenta").value /
                    listDetalleSalida.length
            );
        };
    });

    document
        .querySelector("#txtDescuentoVenta")
        .addEventListener("keyup", () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (
                    document.getElementById("txtDescuentoVenta").value < 0 ||
                    document.getElementById("txtDescuentoVenta").value == ""
                )
                    return;

                let numero = numero_campo(
                    document.querySelector("#txtDescuentoVenta")
                );
                if (numero != undefined) {
                    if (numero.value != "") {
                        numero.focus();
                        numero.labels[0].style.fontWeight = "600";
                        addClass(numero.labels[0], "text-danger");
                        showAlertTopEnd(
                            "info",
                            "Por favor ingrese solo numeros al campo " +
                                numero.labels[0].innerText
                        );
                    }
                    return;
                }

                document.getElementById("txtDescuentoPorcentajeVenta").value = (
                    (document.getElementById("txtDescuentoVenta").value * 100) /
                    sumaTotal
                ).toFixed(2);

                if (
                    parseFloat(
                        document.getElementById("txtDescuentoVenta").value
                    ).toFixed(2) >
                    descuentoMinimo * listDetalleSalida.length
                ) {
                    document.getElementById("txtDescuentoVenta").value = (
                        descuentoMinimo * listDetalleSalida.length
                    ).toFixed(2);
                    document.getElementById(
                        "txtDescuentoPorcentajeVenta"
                    ).value = (
                        (100 *
                            document.getElementById("txtDescuentoVenta")
                                .value) /
                        (sumaTotal +
                            parseFloat(
                                document.getElementById("txtDescuentoVenta")
                                    .value
                            ))
                    ).toFixed(2);
                    showAlertTopEnd(
                        "info",
                        "El monto del descuento es superior al descuento mínimo de los Productos"
                    );
                }
                updateListDetalleSalida(
                    document.getElementById("txtDescuentoVenta").value /
                        listDetalleSalida.length
                );

                clearTimeout(timeout);
            }, 100);
        });

    document
        .querySelector("#txtDescuentoPorcentajeVenta")
        .addEventListener("keyup", () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (
                    document.getElementById("txtDescuentoPorcentajeVenta")
                        .value < 0 ||
                    document.getElementById("txtDescuentoPorcentajeVenta")
                        .value == ""
                )
                    return;

                let numero = numero_campo(
                    document.querySelector("#txtDescuentoPorcentajeVenta")
                );
                if (numero != undefined) {
                    if (numero.value != "") {
                        numero.focus();

                        showAlertTopEnd(
                            "info",
                            "Por favor ingrese solo números al Porcentaje del Descuento"
                        );
                    }
                    return;
                }

                document.getElementById("txtDescuentoVenta").value = (
                    (document.getElementById("txtDescuentoPorcentajeVenta")
                        .value *
                        sumaTotal) /
                    100
                ).toFixed(2);

                if (
                    document.getElementById("txtDescuentoVenta").value >
                    descuentoMinimo * listDetalleSalida.length
                ) {
                    document.getElementById("txtDescuentoVenta").value = (
                        descuentoMinimo * listDetalleSalida.length
                    ).toFixed(2);

                    document.getElementById(
                        "txtDescuentoPorcentajeVenta"
                    ).value = (
                        (100 *
                            document.getElementById("txtDescuentoVenta")
                                .value) /
                        sumaTotal
                    ).toFixed(2);

                    showAlertTopEnd(
                        "info",
                        "El monto del descuento es superior al descuento mínimo de los Productos"
                    );
                }
                console.log(
                    document.getElementById("txtDescuentoVenta").value,
                    document.getElementById("txtDescuentoPorcentajeVenta").value
                );
                updateListDetalleSalida(
                    document.getElementById("txtDescuentoVenta").value /
                        listDetalleSalida.length
                );

                clearTimeout(timeout);
            }, 100);
        });
};

var addEventsVentas = () => {
    document.querySelectorAll(".editar-venta").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function() {
            ventaSelected = findByVenta(btn.getAttribute("idventa"));
            if (ventaSelected != undefined) {
                metodo = true;
                document.querySelector("#txtNombreVenta").value =
                    ventaSelected.nombre;
                document.querySelector("#TituloModalVenta").innerHTML =
                    "EDITAR COMPRA";
                document.querySelector("#txtNombreVenta").focus();
            } else {
                showAlertTopEnd(
                    "warning",
                    "No se encontró la venta para poder editar"
                );
            }
        };
    });
    document.querySelectorAll(".eliminar-venta").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function() {
            ventaSelected = findByVenta(btn.getAttribute("idventa"));
            beanRequestVenta.operation = "delete";
            beanRequestVenta.type_request = "DELETE";
            processAjaxVenta();
        };
    });
    document.querySelectorAll(".tooltip").forEach(thisbtn => {
        removeClass(thisbtn, "show");
        thisbtn.innerHTML = "";
    });
};

var findByVenta = idventa => {
    let venta_;
    beanPaginationVenta.list.forEach(venta => {
        if (idventa == venta.idventa) {
            venta_ = venta;
            return;
        }
    });
    return venta_;
};

var validateFormVenta = () => {
    if (document.querySelector("#txtNombreVenta").value == "") {
        showAlertTopEnd("warning", "Por favor ingrese nombre");
        document.querySelector("#txtNombrenVenta").focus();
        return false;
    }
    return true;
};
/* DETALLE SALIDA*/
var descuentoSalida = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }
    ventaSelected = findByDetalleSalida(eleme.getAttribute("iddetalle_salida"));
    if (ventaSelected == undefined) return false;

    if (ventaSelected.descuento_minimo < btn.value) {
        showAlertTopEnd(
            "info",
            "El monto del descuento es superior al descuento mínimo del producto"
        );

        btn.value = ventaSelected.descuento_minimo.toFixed(2);
    }

    eliminarDetalleSalida(ventaSelected.iddetalle_salida);
    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                ventaSelected.iddetalle_salida,
                ventaSelected.cantidad,
                ventaSelected.cantidad_maxima,
                ventaSelected.precio,
                btn.value,
                ventaSelected.descuento_minimo,
                ventaSelected.impuesto,
                ventaSelected.cantidad * ventaSelected.precio -
                    btn.value -
                    ventaSelected.cantidad *
                        ventaSelected.precio *
                        ventaSelected.impuesto,
                ventaSelected.cantidad * ventaSelected.precio - btn.value,
                ventaSelected.salida,
                ventaSelected.presentacion,
                ventaSelected.medida
            )
        )
    );
    eleme.getElementsByTagName("input")[2].value = numeroConComas(
        ((btn.value * 100) / ventaSelected.precio).toFixed(2)
    );
    eleme.getElementsByTagName("a")[2].text =
        "S/." +
        numeroConComas(
            (
                ventaSelected.cantidad * ventaSelected.precio -
                btn.value -
                ventaSelected.cantidad *
                    ventaSelected.precio *
                    ventaSelected.impuesto
            ).toFixed(2)
        );
    eleme.getElementsByTagName("a")[3].text =
        "S/." +
        numeroConComas(
            (ventaSelected.cantidad * ventaSelected.precio - btn.value).toFixed(
                2
            )
        );
    preciosTotalesVenta();
    return true;
};

var cantidadSalida = (eleme, btn) => {
    if (numeroSepararDecimal(btn.value).length > 1)
        btn.value = parseInt(btn.value);

    if (btn.value < 1) {
        btn.value = 0;
        return false;
    }
    ventaSelected = findByDetalleSalida(eleme.getAttribute("iddetalle_salida"));
    if (ventaSelected == undefined) return false;
    eliminarDetalleSalida(ventaSelected.iddetalle_salida);
    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                ventaSelected.iddetalle_salida,
                btn.value,
                ventaSelected.cantidad_maxima,
                ventaSelected.precio,
                ventaSelected.descuento,
                ventaSelected.descuento_minimo,
                ventaSelected.impuesto,
                btn.value * ventaSelected.precio -
                    ventaSelected.descuento -
                    btn.value * ventaSelected.precio * ventaSelected.impuesto,
                btn.value * ventaSelected.precio - ventaSelected.descuento,
                ventaSelected.salida,
                ventaSelected.presentacion,
                ventaSelected.medida
            )
        )
    );
    eleme.getElementsByTagName("a")[2].text =
        "S/. " +
        numeroConComas(
            (
                btn.value * ventaSelected.precio -
                ventaSelected.descuento -
                btn.value * ventaSelected.precio * ventaSelected.impuesto
            ).toFixed(2)
        );
    eleme.getElementsByTagName("a")[3].text =
        "S/. " +
        numeroConComas(
            (
                btn.value * ventaSelected.precio -
                ventaSelected.descuento
            ).toFixed(2)
        );
    preciosTotalesVenta();
    return true;
};

var descuentoPorcentajeSalida = (eleme, btn) => {
    if (btn.value < 0) {
        if (numeroSepararDecimal(btn.value).length > 1) {
            btn.value = 0;
        } else {
            btn.value = -1;
            return false;
        }
    }

    ventaSelected = findByDetalleSalida(eleme.getAttribute("iddetalle_salida"));

    if (ventaSelected == undefined) return false;

    if (
        (ventaSelected.descuento_minimo * 100) / ventaSelected.precio <
        btn.value
    ) {
        showAlertTopEnd(
            "info",
            "El monto del descuento es superior al descuento mínimo del producto"
        );

        btn.value = (
            (ventaSelected.descuento_minimo * 100) /
            ventaSelected.precio
        ).toFixed(2);
    }

    eliminarDetalleSalida(ventaSelected.iddetalle_salida);
    listDetalleSalida.push(
        new Object(
            new Detalle_Salida(
                ventaSelected.iddetalle_salida,
                ventaSelected.cantidad,
                ventaSelected.cantidad_maxima,
                ventaSelected.precio,
                (btn.value * ventaSelected.precio) / 100,
                ventaSelected.descuento_minimo,
                ventaSelected.impuesto,
                ventaSelected.cantidad * ventaSelected.precio -
                    btn.value -
                    ventaSelected.cantidad *
                        ventaSelected.precio *
                        ventaSelected.impuesto,
                ventaSelected.cantidad * ventaSelected.precio - btn.value,
                ventaSelected.salida,
                ventaSelected.presentacion,
                ventaSelected.medida
            )
        )
    );
    eleme.getElementsByTagName("input")[1].value = numeroConComas(
        ((btn.value * ventaSelected.precio) / 100).toFixed(2)
    );
    eleme.getElementsByTagName("a")[2].text =
        "S/." +
        numeroConComas(
            (
                ventaSelected.cantidad * ventaSelected.precio -
                (btn.value * ventaSelected.precio) / 100 -
                ventaSelected.cantidad *
                    ventaSelected.precio *
                    ventaSelected.impuesto
            ).toFixed(2)
        );
    eleme.getElementsByTagName("a")[3].text =
        "S/." +
        numeroConComas(
            (
                ventaSelected.cantidad * ventaSelected.precio -
                (btn.value * ventaSelected.precio) / 100
            ).toFixed(2)
        );
    preciosTotalesVenta();

    return true;
};

var addEventsDetalleSalida = () => {
    /* mas y menos*/
    document.querySelectorAll(".btn-cantidad-menos").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[0].value--;
            if (eleme.getElementsByTagName("input")[0].value < 0)
                return eleme.getElementsByTagName("input")[0].value++;
            if (!cantidadSalida(eleme, eleme.getElementsByTagName("input")[0]))
                eleme.getElementsByTagName("input")[0].value++;
        };
    });
    document.querySelectorAll(".btn-cantidad-mas").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName("input")[0].value++;
            if (!cantidadSalida(eleme, eleme.getElementsByTagName("input")[0]))
                eleme.getElementsByTagName("input")[0].value--;
        };
    });
    document.querySelectorAll(".btn-descuento-menos").forEach(btn => {
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;

            eleme.getElementsByTagName("input")[1].value--;

            if (!descuentoSalida(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value++;

            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
            document.getElementById("txtDescuentoVenta").value = 0;
            document.getElementById("txtDescuentoPorcentajeVenta").value = 0;
        };
    });
    document.querySelectorAll(".btn-descuento-mas").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName("input")[1].value++;
            if (!descuentoSalida(eleme, eleme.getElementsByTagName("input")[1]))
                eleme.getElementsByTagName("input")[1].value--;
            eleme.getElementsByTagName("input")[1].value = parseFloat(
                eleme.getElementsByTagName("input")[1].value
            ).toFixed(2);
            document.getElementById("txtDescuentoVenta").value = 0;
            document.getElementById("txtDescuentoPorcentajeVenta").value = 0;
        };
    });
    document
        .querySelectorAll(".btn-descuento-porcentaje-menos")
        .forEach(btn => {
            btn.onclick = () => {
                let eleme =
                    btn.parentElement.parentElement.parentElement.parentElement;

                eleme.getElementsByTagName("input")[2].value--;

                if (
                    !descuentoPorcentajeSalida(
                        eleme,
                        eleme.getElementsByTagName("input")[2]
                    )
                )
                    eleme.getElementsByTagName("input")[2].value++;

                eleme.getElementsByTagName("input")[2].value = parseFloat(
                    eleme.getElementsByTagName("input")[2].value
                ).toFixed(2);
                document.getElementById("txtDescuentoVenta").value = 0;
                document.getElementById(
                    "txtDescuentoPorcentajeVenta"
                ).value = 0;
            };
        });
    document.querySelectorAll(".btn-descuento-porcentaje-mas").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = () => {
            let eleme =
                btn.parentElement.parentElement.parentElement.parentElement;
            eleme.getElementsByTagName("input")[2].value++;
            if (
                !descuentoPorcentajeSalida(
                    eleme,
                    eleme.getElementsByTagName("input")[2]
                )
            )
                eleme.getElementsByTagName("input")[2].value--;
            eleme.getElementsByTagName("input")[2].value = parseFloat(
                eleme.getElementsByTagName("input")[2].value
            ).toFixed(2);

            document.getElementById("txtDescuentoVenta").value = 0;
            document.getElementById("txtDescuentoPorcentajeVenta").value = 0;
        };
    });
    /* inputs teclado*/
    document.querySelectorAll(".cantidad-venta").forEach(btn => {
        btn.onkeyup = () => {
            if (btn.value == "") return;

            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo numeros al campo"
                    );
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (cantidadSalida(eleme, btn));
        };
    });
    document.querySelectorAll(".descuento-venta").forEach(btn => {
        btn.onkeyup = () => {
            if (btn.value == "") return;
            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();

                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo numeros al campo"
                    );
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (descuentoSalida(eleme, btn));
        };
    });
    document.querySelectorAll(".descuento-porcentaje-venta").forEach(btn => {
        btn.onkeyup = () => {
            if (btn.value == "") return;
            let numero = numero_campo(btn);
            if (numero != undefined) {
                if (numero.value != "") {
                    numero.focus();
                    showAlertTopEnd(
                        "info",
                        "Por favor ingrese solo números al campo"
                    );
                }
                return;
            }
            let eleme = btn.parentElement.parentElement.parentElement;
            if (descuentoPorcentajeSalida(eleme, btn));
        };
    });
    /* eliminar venta*/
    document.querySelectorAll(".eliminar-detalle-salida").forEach(btn => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function() {
            detalle_salidaSelected = findByDetalleSalida(
                btn.parentElement.parentElement.parentElement.parentElement.getAttribute(
                    "iddetalle_salida"
                )
            );
            eliminarDetalleSalida(detalle_salidaSelected.iddetalle_salida);
            toListDetalleSalida(listDetalleSalida);
        };
    });
    document.querySelectorAll(".tooltip").forEach(thisbtn => {
        removeClass(thisbtn, "show");
        thisbtn.innerHTML = "";
    });
};

var findByDetalleSalida = iddetalle_salida => {
    let detalle_salida_;
    listDetalleSalida.forEach(detalle_salida => {
        if (iddetalle_salida == detalle_salida.iddetalle_salida) {
            detalle_salida_ = detalle_salida;
            return;
        }
    });
    return detalle_salida_;
};

var eliminarDetalleSalida = idbusqueda => {
    listDetalleSalida = listDetalleSalida.filter(function(obj) {
        if (obj.iddetalle_salida == idbusqueda) {
            return undefined;
        }
        {
            return obj;
        }
    });
};

var updateListDetalleSalida = descuento => {
    listDetalleSalida.forEach(detalle_salida => {
        detalle_salida.descuento = descuento;
        detalle_salida.subtotal =
            detalle_salida.precio * detalle_salida.cantidad -
            descuento -
            detalle_salida.impuesto *
                detalle_salida.precio *
                detalle_salida.cantidad;
        detalle_salida.total =
            detalle_salida.precio * detalle_salida.cantidad - descuento;
    });
    toListDetalleSalida(listDetalleSalida);
};

var toListDetalleSalida = beanPagination => {
    let row = "";
    sumaSubTotal = 0;
    sumaTotal = 0;
    descuentoMinimo = 0;
    let con = 0;
    beanPagination.forEach(detalle_salida => {
        if (con > 0) {
            if (detalle_salida.descuento_minimo < descuentoMinimo) {
                descuentoMinimo = detalle_salida.descuento_minimo;
            }
        } else {
            descuentoMinimo = detalle_salida.descuento_minimo;
        }
        con++;

        descuentoMinimo = detalle_salida.descuento_minimo;
        sumaSubTotal += detalle_salida.subtotal + detalle_salida.descuento;
        sumaTotal += detalle_salida.total + detalle_salida.descuento;
        row += `
			<!-- Widget Item -->
			<div class="dt-widget__item pt-1 pb-1 pr-4" iddetalle_salida="${
                detalle_salida.iddetalle_salida
            }">

			<!-- Widget Extra -->
				<div class="dt-widget__extra">
					<!-- Hide Content -->
					<div class="hide-content">
						<!-- Action Button Group -->
						<div class="action-btn-group mr-2" style="margin-left: -30px;">
							<button  class="btn btn-default text-danger dt-fab-btn eliminar-detalle-salida"
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
                            detalle_salida.presentacion.producto == null
                                ? detalle_salida.presentacion
                                      .detalle_producto_color.detalle_producto
                                      .producto.nombre
                                : detalle_salida.presentacion.producto.nombre
                        }</a>
					</div>
					<span class="dt-widget__subtitle p-2 " style="color:transparent;background-color:${
                        detalle_salida.presentacion.producto == null
                            ? detalle_salida.presentacion.detalle_producto_color
                                  .idcolor.codigo
                            : ""
                    }">...</span>
					<span class="dt-widget__subtitle">
					${
                        detalle_salida.presentacion.producto == null
                            ? detalle_salida.presentacion.detalle_producto_color
                                  .detalle_producto.producto.codigo
                            : detalle_salida.presentacion.producto.codigo
                    }</span>

					<span class="dt-widget__subtitle">
					${
                        detalle_salida.presentacion.producto == null
                            ? detalle_salida.presentacion.detalle_producto_color
                                  .detalle_producto.longitud
                            : ""
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

						<input class="form-control form-control-xs cantidad-venta p-1"
						value="${numeroConComas(detalle_salida.cantidad)}" type="text" >

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-primary btn-cantidad-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
							<span class="btn p-1 btn-dark m-0" >${detalle_salida.medida}
							</span>
						</div>
					</div>

				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left pl-2 pr-2" style=" max-width: 94px;">
					<div class="dt-widget__title text-center">
						<a class="f-12" href="javascript:void(0)">S/. ${numeroConComas(
                            detalle_salida.precio.toFixed(2)
                        )}</a>
					</div>
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-right form-row pl-2 pr-2" style=" max-width: 280px;min-width: 240px;">
					<div class="input-group search-box left-side-icon col-6">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-secondary btn-descuento-menos tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>

						<input class="form-control form-control-xs pl-6 descuento-venta pr-0"
						value="${numeroConComas(detalle_salida.descuento.toFixed(2))}" type="text" >

						<span class="search-icon ml-6">s/.</span>

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-secondary btn-descuento-mas tienda-cursor-mano" >
								<i class="icon icon-plus icon-2x"></i>
							</span>
						</div>
					</div>
					<div class="input-group search-box right-side-icon col-6">
						<div class="input-group-prepend" style="height: 27px;">
							<span class="btn p-0 btn-dark btn-descuento-porcentaje-menos tienda-cursor-mano"> <i
							class="icon icon-minus icon-2x"></i></span>
						</div>

						<input class="form-control form-control-xs descuento-porcentaje-venta pl-1"
						value="${numeroConComas(
                            (
                                (detalle_salida.descuento * 100) /
                                detalle_salida.precio
                            ).toFixed(2)
                        )}"type="text">

						<span class="search-icon mr-7" >%</span>

						<div class="input-group-append" style="height: 27px;">
							<span class="btn p-0 btn-dark btn-descuento-porcentaje-mas tienda-cursor-mano" style="width: 30px; ">
								<i class="icon icon-plus icon-2x"></i>
							</span>
						</div>
					</div>

				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-center pl-2 pr-2" style=" max-width: 100px;">
					<div class="dt-widget__title text-center">
						<a class="precio-subtotal-venta f-12" href="javascript:void(0)">S/. ${numeroConComas(
                            detalle_salida.subtotal.toFixed(2)
                        )}</a>
					</div>
				</div>
				<!-- /widget info -->
				<!-- Widget Info -->
				<div class="dt-widget__info border-left text-center pl-2 pr-2" style=" max-width: 100px;">
					<div class="dt-widget__title text-center">
						<a class="precio-total-venta f-12" href="javascript:void(0)">S/. ${numeroConComas(
                            detalle_salida.total.toFixed(2)
                        )}</a>
					</div>
				</div>
				<!-- /widget info -->

			</div>
			<!-- /widgets item -->
			`;

        $('[data-toggle="tooltip"]').tooltip();
    });

    document.getElementById("tbodySalidaDetalle").innerHTML = row;
    document.getElementById("txtSubTotal").innerHTML =
        "S/. " +
        numeroConComas(
            (
                sumaSubTotal -
                document.getElementById("txtDescuentoVenta").value
            ).toFixed(2)
        );
    document.getElementById("txtImpuesto").innerHTML =
        "S/. " +
        numeroConComas(
            (
                sumaTotal -
                sumaSubTotal -
                document.getElementById("txtDescuentoVenta").value
            ).toFixed(2)
        );
    document.getElementById("txtTotal").innerHTML =
        "S/. " +
        numeroConComas(
            (
                sumaTotal - document.getElementById("txtDescuentoVenta").value
            ).toFixed(2)
        );
    document.getElementById("txtImporteTotal").innerHTML =
        "S/. " +
        numeroConComas(
            (
                sumaTotal - document.getElementById("txtDescuentoVenta").value
            ).toFixed(2)
        );
    addEventsDetalleSalida();
};

var preciosTotalesVenta = () => {
    sumaSubTotal = 0;
    sumaTotal = 0;
    listDetalleSalida.forEach(detalle_salida => {
        sumaSubTotal += detalle_salida.subtotal;
        sumaTotal += detalle_salida.total;
    });
    document.getElementById("txtSubTotal").innerHTML =
        "S/. " + numeroConComas(sumaSubTotal.toFixed(2));
    document.getElementById("txtImpuesto").innerHTML =
        "S/. " + numeroConComas((sumaTotal - sumaSubTotal).toFixed(2));
    document.getElementById("txtTotal").innerHTML =
        "S/. " + numeroConComas(sumaTotal.toFixed(2));
    document.getElementById("txtImporteTotal").innerHTML =
        "S/. " + numeroConComas(sumaTotal.toFixed(2));
};

var selectImpuestoProducto = valor => {
    if (1 > parseInt(valor) || parseInt(valor) > 11) {
        showAlertTopEnd("warning", "No se encuentra Impuestos");
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
            parseInt(
                presentacionS.presentacionExis == undefined
                    ? presentacionS.existencia
                    : presentacionS.existencia_actual
            ) - parseInt(cantidad),
            parseInt(
                presentacionS.presentacionExis == undefined
                    ? presentacionS.existencia
                    : presentacionS.existencia_actual
            ),
            1,
            presentacionS.producto,
            presentacionS.detalle_producto_color,
            parseFloat(preciounitario),
            parseFloat(
                presentacionS.presentacionExis == undefined
                    ? presentacionS.valor_total
                    : presentacionS.valor_total_actual
            ) -
                cantidad * parseFloat(presentacionS.inventario_final),
            parseInt(
                presentacionS.presentacionExis == undefined
                    ? presentacionS.valor_total
                    : presentacionS.valor_total_actual
            ),
            presentacionS.inventario_final,
            true
        );
    else presentacion_ = new Presentacion(0);
    return presentacion_;
};
var eliminarAtributosDetalleSalida = () => {
    listDetalleSalida.forEach(function(obj) {
        delete obj["impuesto"];
        delete obj["cantidad_maxima"];
        delete obj["descuento"];
        delete obj["descuento_minimo"];
        delete obj["subtotal"];
        delete obj["total"];
        delete obj["medida"];
    });
};
