/* CLASE PRODUCTO*/
class Producto {
	constructor(
		idproducto,
		indice = 0,
		codigo = '',
		nombre = '',
		descripcion = '',
		estado = 0,
		cantidad_minima = 0,
		unidad_medida = 0,
		categoria = 0,
		marca = 0,
		cantidad = 0,
		precio_costo,
		ganancia_porcentaje,
		descuento_porcentaje,
		impuesto = 1
	) {
		this.idproducto = idproducto;
		this.indice = indice;
		this.codigo = codigo;
		this.nombre = nombre;
		this.descripcion = descripcion;
		this.estado = estado;
		this.cantidad_minima = cantidad_minima;
		this.unidad_medida = unidad_medida;
		this.categoria = categoria;
		this.marca = marca;
		this.cantidad = cantidad;
		this.precio_costo = precio_costo;
		this.ganancia_porcentaje = ganancia_porcentaje;
		this.descuento_porcentaje = descuento_porcentaje;
		this.impuesto = impuesto;
	}
}
class Color {
	constructor(idcolor, codigo, nombre) {
		this.idcolor = idcolor;
		this.codigo = codigo;
		this.nombre = nombre;
	}
}
/* CLASE DETALLE PRODUCTO*/
class Detalle_Producto {
	constructor(iddetalle_producto, longitud, producto) {
		this.iddetalle_producto = iddetalle_producto;
		this.longitud = longitud;
		this.producto = producto;
	}
}
/* PRODUCTO COLOR*/
class Detalle_Producto_Color {
	constructor(iddetalle_producto_color, idcolor, cantidad, detalle_producto) {
		this.iddetalle_producto_color = iddetalle_producto_color;
		this.idcolor = idcolor;
		this.cantidad = cantidad;
		this.detalle_producto = detalle_producto;
	}
}

class BeanDetalleProducto {
	constructor(detalle_producto) {
		this.detalle_producto = detalle_producto;
		this.list = new Array();
	}
}
var listBeanDetalleProducto = new Array();
var ObjectDetalleProducto = null;
var ObjectBeanDetalleProducto = null;
