import { Component } from '@angular/core';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { CarritoService } from 'src/app/modules/shared/services/carrito.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  productosEnCarrito: ProductoItemCart[] = [];
  constructor(
    
    private carritoService: CarritoService,
    public servicioRutas: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.carritoService.cargarCarrito();
    
    this.carritoService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos;
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
    this.carritoService.actualizarCarrito(this.productosEnCarrito);
  }

  aumentarCantidad(producto: ProductoItemCart){
    producto.Cantidad++;


    this.carritoService.actualizarCarrito(this.productosEnCarrito);
  }




  //Disminuir la cantidad de un producto (no menor a 1)
  restarCantidad(producto: ProductoItemCart){
    if (producto.Cantidad >1){
      producto.Cantidad--;
    }
    this.carritoService.actualizarCarrito(this.productosEnCarrito);
  }
 
 
   // Método para calcular el total
   calcularTotal(): number {
    return this.productosEnCarrito.reduce((total, item) => total + (item.Producto.precio * item.Cantidad), 0);
  }




  eliminarProductoDelCarrito(idProducto: string) {
    this.carritoService.eliminarProducto(idProducto);

  }
  confirmarCompra() {
    const uid = this.authService.obtenerUid();
    
    if (!uid) {
      // Mostrar un mensaje o redirigir al usuario a iniciar sesión
      alert('Debes iniciar sesión para confirmar la compra.');
      this.servicioRutas.navigate(['/login']); // Redirigir a la página de inicio de sesión
    } else {
      // Lógica para confirmar la compra
      alert('Compra confirmada');
      // Navegar a otra vista si es necesario
      this.servicioRutas.navigate(['/']);
    }
  }

}
