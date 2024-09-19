import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/modules/admin/services/crud.service';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { CarritoService } from '../../services/carrito.service';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  productosEnCarrito: ProductoItemCart[] = [];
  logueado = true; // variable booleana para el botón de Registro e Inicio de Sesión
  deslogueado = false; // variable booleana para el botón de Cerrar Sesión

  constructor(
    public servicioAuth: AuthService,
    public servicioRutas: Router,
    private carritoService: CarritoService
  ){}

  // Cambia los valores de logueado y deslogueado para ocultar los primeros y mostrar el último
  iniciar(){
    this.logueado = false;
    this.deslogueado = true;
  }

  cerrarSesion(){
    this.deslogueado = false;
    // va a eliminar el "token" actual del usuario
    // token: estado actual del usuario en el navegador para mantener la sesión abierta
    this.servicioAuth.cerrarSesion();

    this.servicioRutas.navigate(['/']); // redigirimos a la raíz de la página
    this.logueado = true;
  }


  


  ngOnInit(): void {
    // Suscribirse al carrito de compras para recibir actualizaciones
    this.carritoService.carrito$.subscribe(productos => {
      this.productosEnCarrito = productos.map(producto => ({
        Producto: producto,
        Cantidad: 1
      }));
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
  }





}

