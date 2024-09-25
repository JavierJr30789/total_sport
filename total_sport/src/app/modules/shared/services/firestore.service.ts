import { Injectable } from '@angular/core';
// Importamos Firestore y colecciones de la misma
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  /**
   * Definimos una colección de usuarios PRIVADA
   * Va a ser una colección de Firestore
   * Respetará la estructura de datos de la interfaz Usuario
   */
  private usuariosCollection: AngularFirestoreCollection<Usuario>

  constructor(private database: AngularFirestore) {
    this.usuariosCollection = this.database.collection<Usuario>('usuarios');
  }

  agregarUsuario(usuario: Usuario, id: string){
    /* Generamos nueva PROMESA y utiliza los métodos:
      RESOLVE: promesa resuelta -> funciona correctamente
      REJECT: promesa rechaza -> ocurrió una falla
    */
    return new Promise(async (resolve, reject) => {
      // Bloque TRY encapsula la lógica resuelta
      try{
        usuario.uid = id;

        /**
         * const resultado = colección de usuarios, envía como documento el UID 
         * y setea la información que ingresemos en el REGISTRO
         */
        const resultado = await this.usuariosCollection.doc(id).set(usuario);
        resolve(resultado);
        // Bloque CATCH encapsula una falla y la vuelve un error
      }catch(error){
        reject (error);
      }
    })
  }
}
