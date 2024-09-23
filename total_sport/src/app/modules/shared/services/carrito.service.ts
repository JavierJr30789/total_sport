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
  
    // Busca si el producto ya está en el carrito
    const productoExistente = productosActuales.find(item => item.Producto.idProducto === productoItemCart.Producto.idProducto);
  
    if (productoExistente) {
      // Si ya existe, actualiza la cantidad
      productoExistente.Cantidad += productoItemCart.Cantidad;
    } else {
      // Si no existe, lo agrega al carrito
      this.carrito.next([...productosActuales, productoItemCart]);
    }
  }

  actualizarCarrito(productos: ProductoItemCart[]) {
    this.carrito.next(productos);
  }
}