import { Injectable } from '@angular/core';
import { Pedido } from 'src/app/models/carrito';
import { Producto } from 'src/app/models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

 private pedido! : Pedido;

  constructor() {

    this.loadCarrito();
    
   }

 
loadCarrito(){

}

  //esta funcion sirve para que nos devuelva lo que tengamos en el carrito de compras
  getCarrito(){
    return this.pedido;
       }

  //esta funcion se encarga de añadir un producto al carrito de compras
  addProducto(producto: Producto){

  }

  removeProducto(productos: Producto){
    
  }

  realizarPedido(){

  }

  clearCarrito(){

  }
}
