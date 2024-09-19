import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Producto } from 'src/app/models/producto';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private productosCollection: AngularFirestoreCollection<Producto>

  constructor(private database: AngularFirestore){
    this.productosCollection = database.collection('producto');
  }

  //CREAR PRODUCTOS
  crearProducto(producto: Producto){
    return new Promise(async (resolve, reject) =>{
      try{
      const idProducto = this.database.createId();

      producto.idProducto= idProducto;

      const resultado = await this.productosCollection.doc(idProducto).set(producto);

      resolve(resultado);
      }catch(error){
        reject(error);
      }
    })
  }
  //OBTENER PRODUCTOS
  obtenerProducto(){
    //snapshotChanges -> tima una captura del estado del estado de los datos
    // pipe -> funciona como una tuberia que retorna el nuevo arreglo de datos
    // map -> "mapea" o recorre esa informacion
    //a -> resguarda la nueva informacion y la envia
    return this.productosCollection.snapshotChanges().pipe(map(Action=>Action.map(a=>a.payload.doc.data())));
  }
  //EDITAR PRODUCTOS
  modificarProducto(idProducto:string, nuevaData: Producto){
    //accedemos a la coleccion, buscamos por ID y actualizamos informacion
    return this.database.collection('producto').doc(idProducto).update(nuevaData);  
  }
  //ELIMININAR PRODUCTOS 
  eliminarProducto(idProducto: string){
    return new Promise((resolve, reject) =>{
      try{
        //accedo a la coleccion, busco su ID
        const respuesta = this.productosCollection.doc(idProducto).delete();
        resolve(respuesta);
      }
      catch(error){
        reject(error);
      }
    })
  }
}
