class Entrada {
	constructor(identrada, fecha = null, personal = null) {
		this.identrada = identrada;
		this.fecha = fecha;
		this.personal = { idpersona: personal };
		// this.personal = 1;
	}
}

class Detalle_Entrada {
	constructor(
		iddetalle_entrada,
		cantidad = 0,
		precio,
		impuesto,
		selected_igv,
		subtotal,
		total,
		entrada = 1,
		presentacion = 1,
		medida
	) {
		this.iddetalle_entrada = iddetalle_entrada;
		this.cantidad = cantidad;
		this.precio = precio;
		this.impuesto = impuesto;
		this.selected_igv = selected_igv;
		this.subtotal = subtotal;
		this.total = total;
		this.entrada = entrada;
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

var listDetalleEntrada = [];
