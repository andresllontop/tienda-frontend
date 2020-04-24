class Salida {
	constructor(idsalida, fecha = null, personal = null) {
		this.idsalida = idsalida;
		this.fecha = fecha;
		this.personal = { idpersona: personal };
		// this.personal = 1;
	}
}

class Detalle_Salida {
	constructor(
		iddetalle_salida,
		cantidad = 0,
		cantidad_maxima = 0,
		precio,
		descuento,
		descuento_minimo,
		impuesto,
		subtotal,
		total,
		salida = 1,
		presentacion = 1,
		medida = ''
	) {
		this.iddetalle_salida = iddetalle_salida;
		this.cantidad = cantidad;
		/*existencia de tabla presentacion reempzar con cantidad_maxima */
		this.cantidad_maxima = cantidad_maxima;
		this.precio = precio;
		this.descuento = descuento;
		this.descuento_minimo = descuento_minimo;
		this.impuesto = impuesto;
		this.subtotal = subtotal;
		this.total = total;
		this.salida = salida;
		this.presentacion = presentacion;
		this.medida = medida;
	}
}

class Presentacion {
	constructor(
		existencia,
		existencia_actual,
		tipo_producto,
		producto = null,
		detalle_producto_color = null,
		valor_unitario,
		valor_total,
		valor_total_actual,
		inventario_final,
		presentacionExis = false
	) {
		/* existencia_actual= lo que se encuentra en el kardex*/
		this.existencia_actual = existencia_actual;
		/* existencia= lo que se modificara en el kardex*/
		this.existencia = existencia;
		this.fecha_vencimiento = null;
		this.tipo_producto = tipo_producto;
		this.producto = producto;
		this.detalle_producto_color = detalle_producto_color;
		this.valor_unitario = valor_unitario;
		this.valor_total_actual = valor_total_actual;
		this.valor_total = valor_total;
		this.inventario_final = inventario_final;
		this.presentacionExis = presentacionExis;
	}
}

var listDetalleSalida = [];
