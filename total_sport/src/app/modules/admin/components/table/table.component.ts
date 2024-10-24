import { Component } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { CrudService } from '../../services/crud.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  coleccionProductos: Producto[]=[];
 //variable para manejar el estado de edicion y eliminacion de productos
  modalVisibleProducto: boolean = false;
 //variable va a tiner el producto que nosotros elijamos
  productoSeleccionado!: Producto;

  producto = new FormGroup({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl(0, Validators.required),
    descripcion: new FormControl('', Validators.required),
    categoria: new FormControl('', Validators.required),
    imagen: new FormControl('', Validators.required),
    alt: new FormControl('', Validators.required)
  })

  constructor(public servicioCrud: CrudService){}

  ngOnInit(): void{
    //suscribe -> notifica constantemente los cambios actuales del sistema
    this.servicioCrud.obtenerProducto().subscribe(producto => {
      this.coleccionProductos = producto;
    })
  }

async agregarProducto(){
  // validamos los valores del producto agregado
  if(this.producto.valid){
    let nuevoProducto: Producto ={
      // idProducto no se toma porque es generado por la BD y no por el usuario
      idProducto:'',
      // el resto es tomado con informacion ingresada por el usuario
      nombre: this.producto.value.nombre!,
      descripcion: this.producto.value.descripcion!,
      categoria:this.producto.value.categoria!,
      precio: this.producto.value.precio!,
      imagen: this.producto.value.imagen!,
      alt: this.producto.value.alt!
    }
    await this.servicioCrud.crearProducto(nuevoProducto)
    .then(producto => {
      alert("ha agreado un nuevo producto con existo :V");
      this.producto.reset();
    })
    .catch(error => {
      alert("hubo un problema al agregar un nuevo producto >:v");
      this.producto.reset();
    });
    
  }
}
mostrarBorrar(productoSeleccionado: Producto){
  this.modalVisibleProducto=true; //abre el modal
  this.productoSeleccionado=productoSeleccionado
}
//funcion para eliminar definitivamente al producto
borrarProducto(){
  this.servicioCrud.eliminarProducto(this.productoSeleccionado.idProducto)
  .then(respuesta =>{
    alert("El producto se ha eliminado correctamente")
  })
  .catch(error=>{
    alert("No se ha podido eliminar el producto\n"+error);
  });
  
}
mostrarEditar(productoSeleccionado: Producto){
  this.productoSeleccionado=productoSeleccionado;

  //Enviar o "setear" los nuevos valores y reasignarlos a las variables
  //el ID no se vuelve a enviar ni se modifica, por ende no lo llamamos
  this.producto.setValue({
    nombre: productoSeleccionado.nombre,
    precio: productoSeleccionado.precio,
    descripcion: productoSeleccionado.descripcion,
    imagen: productoSeleccionado.imagen,
    alt: productoSeleccionado.alt,
    categoria: productoSeleccionado.categoria
  })
}
editarProducto(){
  let datos: Producto={
    idProducto: this.productoSeleccionado.idProducto,
    nombre: this.producto.value.nombre!,
    precio: this.producto.value.precio!,
    descripcion: this.producto.value.descripcion!,
    categoria: this.producto.value.categoria!,
    imagen: this.producto.value.imagen!,
    alt: this.producto.value.alt!
  }

  this.servicioCrud.modificarProducto(this.productoSeleccionado.idProducto, datos)
  .then(producto => {
    alert("el producto se modifico exitosamente");
  })
  .catch(error=>{
    alert("Hubo un error al tratar de modificar el producto");
  })
}
}
