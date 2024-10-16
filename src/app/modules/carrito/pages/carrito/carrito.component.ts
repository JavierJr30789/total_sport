import { Component } from '@angular/core';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { CarritoService } from 'src/app/modules/shared/services/carrito.service';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/models/pedido';
import { Timestamp } from 'firebase/firestore';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  productosEnCarrito: ProductoItemCart[] = [];
  constructor(
    private database: AngularFirestore,
    private cartService: CarritoService,
    public servicioRutas: Router,
    private authService: AuthService,
  private firestoreService: FirestoreService
  ){}

  usuarioActual: any; 

  ngOnInit(): void {
    // Suscribirse al carrito de compras para recibir actualizaciones
    this.cartService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos; // No necesitas mapear nada, simplemente asigna el valor directamente
    });

        // Suscribirse al usuario actual
        this.authService.obtenerUsuarioActual().subscribe(usuario => {
          this.usuarioActual = usuario;
          console.log('Usuario actual:', this.usuarioActual);
        });
    
  }

  agregarProductoAlCarrito(producto: Producto) {
    const productoExistente = this.productosEnCarrito.find(item => item.Producto.idProducto === producto.idProducto);
    

    if (productoExistente) {
      // Si ya existe el producto, aumentar la cantidad
      productoExistente.Cantidad++;
    } else {
      // Si no existe, agregar el producto con cantidad 1
      this.productosEnCarrito.push({ Producto: producto, Cantidad: 1 });
    }
  
    // Actualizar el carrito
    this.cartService.actualizarCarrito(this.productosEnCarrito);
  }

  calcularSubtotal() {
    return this.productosEnCarrito.reduce((total, item) => total + item.Producto.precio * item.Cantidad, 0);
  }

  limpiarCarrito() {
    this.productosEnCarrito = [];
    this.cartService.actualizarCarrito(this.productosEnCarrito);
  }
  


  confirmarCompra() {
    if (this.productosEnCarrito.length === 0 || !this.usuarioActual) {
        console.error("No hay productos en el carrito o no hay usuario autenticado");
        return;
    }

    

    // Obtener el usuario por su uid desde Firestore
    this.firestoreService.obtenerUsuarioPorUID(this.usuarioActual.uid).then(usuarioFirestore => {
        // Verificamos si el usuario existe en Firestore y si tiene nombre y apellido
        const usuarioSimplificado = {
            uid: this.usuarioActual.uid,
            nombre: usuarioFirestore?.nombre || 'Usuario',
            apellido: usuarioFirestore?.apellido || 'Desconocido',
            email: this.usuarioActual.email
        };

        const totalPrecio = this.calcularSubtotal(); // Calcula el total aquí

       
        const pedidoId = this.firestoreService.generarId(); // Generar un ID único

        const pedido: Pedido = {
          id: pedidoId,
            usuario: usuarioSimplificado, // Incluimos nombre y apellido
            productos: this.productosEnCarrito,
            fecha: new Date(),
            totalprecio: totalPrecio // Agrega el precio total aquí
        };

        // Guardamos el pedido en Firestore
        this.firestoreService.agregarPedido(pedido)
            .then(() => {
                console.log("Pedido guardado con éxito");
                this.limpiarCarrito();
                alert("Se realizó la compra con éxito");
            })
            .catch(err => {
                console.error("Error al guardar el pedido:", err);
                alert("Algo salió mal :(");
            });
    });
}

  


}