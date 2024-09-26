import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../autentificacion/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Lista de productos en el carrito (usamos BehaviorSubject para poder suscribirnos a los cambios)
  private carrito = new BehaviorSubject<ProductoItemCart[]>([]);
  carrito$ = this.carrito.asObservable(); // Observable que se puede suscribir


  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }


  // Método para agregar productos al carrito
  async agregarProducto(productoItemCart: ProductoItemCart) {
    const uid = await this.authService.obtenerUid();
    if (uid) {
      const cartRef = this.firestore.collection(`usuarios/${uid}/carrito`);
      try {
        const productoExistente = this.carrito.value.find(item => item.Producto.idProducto === productoItemCart.Producto.idProducto);
        if (productoExistente) {
          productoExistente.Cantidad += productoItemCart.Cantidad;
          await cartRef.doc(productoExistente.Producto.idProducto).update(productoExistente);
        } else {
          await cartRef.doc(productoItemCart.Producto.idProducto).set(productoItemCart);
          this.carrito.next([...this.carrito.value, productoItemCart]);
        }
      } catch (error) {
        console.error("Error al agregar producto al carrito: ", error);
        // Manejar el error (ej. mostrar un mensaje al usuario)
      }
    }
  }
  

  actualizarCarrito(productos: ProductoItemCart[]) {
    this.carrito.next(productos);
  }




  obtenerCantidadTotalProductos(): number {
    return this.carrito.value.reduce((total: number, item: ProductoItemCart) => total + item.Cantidad, 0);
}
async cargarCarrito() {
  const uid = await this.authService.obtenerUid();
  if (uid) {
    const cartRef = this.firestore.collection<ProductoItemCart>(`usuarios/${uid}/carrito`); // Especifica el tipo aquí
    cartRef.valueChanges().subscribe(productos => {
      this.carrito.next(productos);
    });
  }
}


async eliminarProducto(idProducto: string) {
  const uid = await this.authService.obtenerUid();
  if (uid) {
    const cartRef = this.firestore.collection(`usuarios/${uid}/carrito`);
    try {
      await cartRef.doc(idProducto).delete();
      this.carrito.next(this.carrito.value.filter(item => item.Producto.idProducto !== idProducto));
    } catch (error) {
      console.error("Error al eliminar producto del carrito: ", error);
      // Manejar el error
    }
  }
}
}