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

  // Método para agregar un producto al carrito
  async agregarProducto(productoItemCart: ProductoItemCart) {
    const uid = await this.authService.obtenerUid(); // Obtiene el UID del usuario
    if (uid) {
      const cartRef = this.firestore.collection(`usuarios/${uid}/carrito`); // Referencia al carrito en Firestore
      try {
        const productoExistente = this.carrito.value.find(item => item.Producto.idProducto === productoItemCart.Producto.idProducto);
        if (productoExistente) {
          productoExistente.Cantidad += productoItemCart.Cantidad; // Aumenta la cantidad si el producto ya existe
          await cartRef.doc(productoExistente.Producto.idProducto).update(productoExistente); // Actualiza en Firestore
        } else {
          await cartRef.doc(productoItemCart.Producto.idProducto).set(productoItemCart); // Añade el nuevo producto
          this.carrito.next([...this.carrito.value, productoItemCart]); // Actualiza el BehaviorSubject
        }
      } catch (error) {
        console.error("Error al agregar producto al carrito: ", error);
      }
    }
  }

  // Método para actualizar el carrito
  actualizarCarrito(productos: ProductoItemCart[]) {
    this.carrito.next(productos);
  }

  // Método para obtener la cantidad total de productos en el carrito
  obtenerCantidadTotalProductos(): number {
    return this.carrito.value.reduce((total: number, item: ProductoItemCart) => total + item.Cantidad, 0);
  }

  // Método para cargar el carrito desde Firestore
  async cargarCarrito() {
    const uid = await this.authService.obtenerUid(); // Obtiene el UID del usuario
    if (uid) {
      const cartRef = this.firestore.collection<ProductoItemCart>(`usuarios/${uid}/carrito`);

      // Cargar el carrito de Firestore
      cartRef.valueChanges().subscribe(productos => {
        // Combinar productos de localStorage si existen
        let carritoLocal: ProductoItemCart[] = JSON.parse(localStorage.getItem('carrito') || '[]');

        // Fusionar los productos
        carritoLocal.forEach(item => {
          const productoExistente = productos.find(p => p.Producto.idProducto === item.Producto.idProducto);
          if (productoExistente) {
            productoExistente.Cantidad += item.Cantidad; // Combinar cantidades si existe
          } else {
            productos.push(item); // Agregar el nuevo producto si no existe
          }
        });

        // Evitar duplicados en el carrito
        const carritoSinDuplicados = Array.from(new Map(productos.map(item => [item.Producto.idProducto, item])).values());
        this.carrito.next(carritoSinDuplicados);

        // Limpiar localStorage si el carrito se ha sincronizado
        localStorage.removeItem('carrito');
      });
    }
  }

  // Método para eliminar un producto del carrito
  async eliminarProducto(idProducto: string) {
    const uid = await this.authService.obtenerUid(); // Obtiene el UID del usuario
    if (uid) {
      // Si el usuario está autenticado, eliminar del Firestore
      const cartRef = this.firestore.collection(`usuarios/${uid}/carrito`);
      try {
        await cartRef.doc(idProducto).delete();
        this.carrito.next(this.carrito.value.filter(item => item.Producto.idProducto !== idProducto)); // Actualiza el BehaviorSubject
      } catch (error) {
        console.error("Error al eliminar producto del carrito: ", error);
      }
    } else {
      // Si no está autenticado, eliminar del localStorage
      let carritoLocal: ProductoItemCart[] = JSON.parse(localStorage.getItem('carrito') || '[]');
      carritoLocal = carritoLocal.filter(item => item.Producto.idProducto !== idProducto);
      localStorage.setItem('carrito', JSON.stringify(carritoLocal));
      this.carrito.next(carritoLocal);
    }
  }
}
