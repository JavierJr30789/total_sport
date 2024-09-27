import { Component } from '@angular/core';
import { Producto } from 'src/app/models/producto';
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

  addCarrito(){
    //esta funcion va a usar un metodo del carritoService, como funcion del metodo addCarrito
    this.carritoService.addProducto(this.productoSeleccionado);
  }

  filterProducts() {
    this.filteredProductos = this.coleccionProducto.filter(producto =>
      producto.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || producto.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
