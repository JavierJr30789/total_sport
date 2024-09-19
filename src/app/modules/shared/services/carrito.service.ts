import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto } from 'src/app/models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Lista de productos en el carrito (usamos BehaviorSubject para poder suscribirnos a los cambios)
  private carrito = new BehaviorSubject<Producto[]>([]);
  carrito$ = this.carrito.asObservable(); // Observable que se puede suscribir

  constructor() { }

  // Método para agregar productos al carrito
  agregarProducto(producto: Producto) {
    const productosActuales = this.carrito.value;
    this.carrito.next([...productosActuales, producto]); // Actualizamos el carrito
  }
}