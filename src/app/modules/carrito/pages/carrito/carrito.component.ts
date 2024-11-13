import { Component, OnInit } from '@angular/core';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { CarritoService } from 'src/app/modules/shared/services/carrito.service';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/models/pedido';
import { Timestamp } from 'firebase/firestore';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productosEnCarrito: ProductoItemCart[] = [];
  usuarioActual: any;
  private audio = new Audio(); // Define el audio aquí

  constructor(
    private database: AngularFirestore,
    private cartService: CarritoService,
    private firestoreService: FirestoreService,
    private carritoService: CarritoService,
    public servicioRutas: Router,
    private authService: AuthService
  ) {
    this.audio.src = 'assets/sounds/comprado.mp3'; // Ruta a tu archivo de sonido
    this.audio.load(); // Cargar el archivo de sonido
  }

  ngOnInit(): void {
    // Cargar el carrito desde el servicio
    this.carritoService.cargarCarrito();

    // Suscribirse al carrito de compras para recibir actualizaciones
    this.carritoService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos;
    });

    // Suscribirse al carrito de compras para recibir actualizaciones
    this.cartService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos; // No necesitas mapear nada, simplemente asigna el valor directamente
    });

    // Suscribirse al usuario actual
    this.authService.obtenerEstadoUsuario().subscribe(usuario => {
      this.usuarioActual = usuario;
      console.log('Usuario actual:', this.usuarioActual);
    });
  }

  // Agregar producto al carrito
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
    this.carritoService.actualizarCarrito(this.productosEnCarrito);
  }

  // Aumentar cantidad de un producto en el carrito
  aumentarCantidad(producto: ProductoItemCart) {
    producto.Cantidad++;
    this.carritoService.actualizarCarrito(this.productosEnCarrito);
  }

  // Disminuir la cantidad de un producto (no menor a 1)
  restarCantidad(producto: ProductoItemCart) {
    if (producto.Cantidad > 1) {
      producto.Cantidad--;
    }
    this.carritoService.actualizarCarrito(this.productosEnCarrito);
  }

  // Método para calcular el total del carrito
  calcularTotal(): number {
    return this.productosEnCarrito.reduce((total, item) => total + (item.Producto.precio * item.Cantidad), 0);
  }

  // Método para calcular el subtotal del carrito
  calcularSubtotal() {
    return this.productosEnCarrito.reduce((total, item) => total + item.Producto.precio * item.Cantidad, 0);
  }

  // Limpiar el carrito
  limpiarCarrito() {
    this.productosEnCarrito = [];
    this.cartService.actualizarCarrito(this.productosEnCarrito);
  }

  // Eliminar un producto del carrito
  eliminarProductoDelCarrito(idProducto: string) {
    this.carritoService.eliminarProducto(idProducto);
  }



  // Confirmar la compra
  confirmarCompra() {


    const uid = this.authService.obtenerUid();

    if (!uid) {
      // Mostrar una alerta con imagen personalizada cuando no se ha iniciado sesión
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes iniciar sesión para confirmar la compra.',
        imageUrl: 'assets/alertaImagen/noLogeado.jpg', // Cambia a la ruta de tu imagen personalizada
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: 'Inicio de sesión requerido',
        confirmButtonText: 'Ir a Login'
      }).then(() => {
        this.servicioRutas.navigate(['/login']); // Redirigir a la página de inicio de sesión
      });
    } else {
      // Lógica para confirmar la compra
      // Reproducir sonido
      this.audio.play();
      if (this.productosEnCarrito.length === 0 || !this.usuarioActual) {
        console.error("No hay productos en el carrito o no hay usuario autenticado");
        return;
      }

      // Obtener el usuario por su UID desde Firestore
      this.firestoreService.obtenerUsuarioPorUID(this.usuarioActual.uid).then(usuarioFirestore => {
        const usuarioSimplificado = {
          uid: this.usuarioActual.uid,
          nombre: usuarioFirestore?.nombre || 'Usuario',
          apellido: usuarioFirestore?.apellido || 'Desconocido',
          email: this.usuarioActual.email
        };
        const totalPrecio = this.calcularSubtotal();
        const pedidoId = this.firestoreService.generarId();
        const pedido: Pedido = {
          id: pedidoId,
          usuario: usuarioSimplificado,
          productos: this.productosEnCarrito,
          fecha: new Date(),
          totalprecio: totalPrecio,
          fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 7)),
        };

        // Guardamos el pedido en Firestore
        this.firestoreService.agregarPedido(pedido)
          .then(() => {
            console.log("Pedido guardado con éxito");
            this.limpiarCarrito();
            Swal.fire({
              title: 'Compra realizada',
              text: 'Se realizó la compra con éxito',
              imageUrl: 'assets/alertaImagen/comprado.jpg', // Imagen personalizada para éxito
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: 'Compra exitosa',
              confirmButtonText: 'Aceptar'
            });
          })
          .catch(err => {
            console.error("Error al guardar el pedido:", err);
            Swal.fire({
              title: 'Error',
              text: 'Algo salió mal :(',
              imageUrl: 'assets/alertaImagen/coprafallida.webp', // Imagen personalizada para error
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: 'Error al realizar la compra',
              confirmButtonText: 'Aceptar'
            });
          });
      });
    }
  }

}
