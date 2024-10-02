import { Component } from '@angular/core';
import { Producto, ProductoItemCart } from 'src/app/models/producto';
import { CrudService } from 'src/app/modules/admin/services/crud.service';
import { CarritoService } from 'src/app/modules/shared/services/carrito.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent {
  coleccionProducto: Producto[] = [];
  filteredProductos: Producto[] = [];
  productoSeleccionado!: Producto;
  modalVisible: boolean = false;
  searchQuery: string = '';

  /*en este connstructor llamamos como parametros a al CrudService para usar la logica del crud y
   tambien llamamos al CarritoService  para usar la logica del servicio carrito*/
  constructor(public servicioCrud: CrudService, public carritoService: CarritoService) { }

  ngOnInit(): void {
    this.servicioCrud.obtenerProducto().subscribe(producto => {
      this.coleccionProducto = producto;
      this.filteredProductos = producto; // Inicialmente, todos los productos están filtrados
    });
  }

  mostrarVer(info: Producto) {
    this.modalVisible = true;
    this.productoSeleccionado = info;
  }

  agregarProducto(producto: Producto) {
    // Crear un ProductoItemCart con el producto y una cantidad inicial de 1
    const productoItemCart = { Producto: producto, Cantidad: 1 };
    // Agregar producto al carrito
    this.carritoService.agregarProducto(productoItemCart); 
  }

  filterProducts() {
    this.filteredProductos = this.coleccionProducto.filter(producto =>
      producto.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || producto.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
