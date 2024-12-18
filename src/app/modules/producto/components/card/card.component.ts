import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { CrudService } from 'src/app/modules/admin/services/crud.service';
import { CarritoService } from 'src/app/modules/shared/services/carrito.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  coleccionProducto: Producto[] = [];
  productoSeleccionado!: Producto;
  filtroNombre: string = ''; // Variable de búsqueda

  usuarioRegistrado: Usuario = {
    uid: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    password: ''
  };
  modalVisible: boolean = false;
  compraVisible: boolean = false;

  private audio = new Audio(); // Define el audio aquí

  private audio2 = new Audio(); // Define el audio aquí

  @Input() productoReciente: string = ''; // Entrada para producto reciente
  @Output() productoAgregado = new EventEmitter<Producto>(); // Salida para producto agregado

  constructor(
    public servicioCrud: CrudService,
    private carritoService: CarritoService,
    public servicioRutas: Router,
    private authService: AuthService
  ) {
    this.audio.src = 'assets/sounds/agregarCarrito.mp3'; // Ruta a tu archivo de sonido
    this.audio.load(); // Cargar el archivo de sonido
    this.audio2.src = 'assets/sounds/logeate.mp3';
    this.audio2.load()
  }

  ngOnInit(): void {
    // Cargamos los productos desde el servicio al iniciar el componente.
    this.servicioCrud.obtenerProducto().subscribe(producto => {
      this.coleccionProducto = producto;
    });

    // Observamos el estado del usuario
    this.authService.obtenerEstadoUsuario().subscribe(user => {
      if (user) {
        // Si hay un usuario autenticado, asignamos el UID al usuario registrado
        this.usuarioRegistrado.uid = user.uid;
        this.usuarioRegistrado.email = user.email || ''; // También podrías capturar el email si es necesario
      } else {
        // Si no hay usuario autenticado, aseguramos que el uid esté vacío
        this.usuarioRegistrado.uid = '';
      }
    });
  }

  // Método para agregar un producto al carrito
  agregarProducto(producto: Producto) {
    const productoItemCart = { Producto: producto, Cantidad: 1 };
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    if (this.usuarioRegistrado.uid) {
      // Si el usuario está autenticado, agregar el producto al carrito
      this.carritoService.agregarProducto(productoItemCart);
      this.audio.play(); // Reproducir sonido al agregar el producto

      Swal.fire({
        title: "Producto agregado",
        text: "El producto ha sido añadido al carrito.",
        imageUrl: "assets/alertaImagen/agregandoCarrito.jpg", // Imagen personalizada para éxito
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Producto agregado",
        confirmButtonText: "Aceptar"
      });
    } else {
      this.audio2.play(); // Reproducir sonido al intentar agregar sin estar registrado
      // Si el usuario no está autenticado, mostrar un mensaje para que inicie sesión
      swalWithBootstrapButtons.fire({
        title: "Operación fallida",
        text: "No puedes realizar compras sin registrarte previamente. Asi que Logueate capo",
        imageUrl: "assets/alertaImagen/logeate.jpg", // Imagen personalizada para advertencia
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Registro requerido",
        showCancelButton: true,
        confirmButtonText: "Iniciar Sesión",
        cancelButtonText: "Cancelar Operación",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir a la página de inicio de sesión si el usuario confirma
          this.servicioRutas.navigate(['/inicio-sesion']);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Mostrar mensaje de operación cancelada
          swalWithBootstrapButtons.fire({
            title: "Operación cancelada",
            imageUrl: "assets/alertaImagen/error.jpg", // Imagen para operación cancelada
            imageWidth: 300,
            imageHeight: 300,
            imageAlt: "Operación cancelada",
            confirmButtonText: "Aceptar"
          });
        }
      });
    }
  }

}
