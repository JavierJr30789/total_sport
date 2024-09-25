import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto, ProductoItemCart } from 'src/app/models/producto';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Lista de productos en el carrito (usamos BehaviorSubject para poder suscribirnos a los cambios)
  private carrito = new BehaviorSubject<ProductoItemCart[]>([]);
  carrito$ = this.carrito.asObservable(); // Observable que se puede suscribir


  constructor() { }


  // Método para agregar productos al carrito
  agregarProducto(productoItemCart: ProductoItemCart) {
    const productosActuales = this.carrito.value;
 


    const productoExistente = productosActuales.find(item => item.Producto.idProducto === productoItemCart.Producto.idProducto);
 
    if (productoExistente) {
      productoExistente.Cantidad += productoItemCart.Cantidad;
    } else {
      productosActuales.push(productoItemCart);
    }
 
    // Actualizar el carrito en ambos casos
    this.carrito.next(productosActuales);
  }


  actualizarCarrito(productos: ProductoItemCart[]) {
    this.carrito.next(productos);
  }




  obtenerCantidadTotalProductos(): number {
    return this.carrito.value.reduce((total: number, item: ProductoItemCart) => total + item.Cantidad, 0);
}


eliminarProducto(idProducto: string) {
  // No es necesario hacer la conversión a .toString() aquí porque idProducto ya es de tipo string
  const productosActualizados = this.carrito.value.filter(item => item.Producto.idProducto !== idProducto);


  // Actualizar el BehaviorSubject con los productos restantes
  this.carrito.next(productosActualizados);
}
}