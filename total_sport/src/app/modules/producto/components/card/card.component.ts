import { Component, Output, Input, EventEmitter } from '@angular/core';
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

  productoSeleccionado!: Producto

  modalVisible: boolean = false;
  //Booleano para manejar la visibilidad de "Ultima Compra"
  compraVisible:boolean = false;
  //Directivas para comunicarse con el componente padre
  @Input() productoReciente: string = '';
  //Output sera definido como un nuevo evento
  @Output() productoAgregado = new EventEmitter<Producto>;

  constructor(
    public servicioCrud: CrudService,
    private carritoService: CarritoService
  ) { }

  
  ngOnInit(): void{
    this.servicioCrud.obtenerProducto().subscribe(producto => {
      this.coleccionProducto = producto;
    })
  }

 // Función para modal que muestre la información de un producto en específico
 mostrarVer(info: Producto){
  // Habilita visibilidad del modal
  this.modalVisible = true;

  // Guarda información de un producto elegido por el usuario
  this.productoSeleccionado = info;

 }


agregarProducto(producto: Producto) {
  // Crear un ProductoItemCart con el producto y una cantidad inicial de 1
  const productoItemCart = { Producto: producto, Cantidad: 1 };

  // Agregar producto al carrito
  this.carritoService.agregarProducto(productoItemCart); 
}

}