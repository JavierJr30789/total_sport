import { Injectable } from '@angular/core';
// Importamos Firestore y colecciones de la misma
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Usuario } from 'src/app/models/usuario';
import { Pedido } from 'src/app/models/pedido';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  /**
   * Definimos una colección de usuarios PRIVADA
   * Va a ser una colección de Firestore
   * Respetará la estructura de datos de la interfaz Usuario
   */
  private usuariosCollection: AngularFirestoreCollection<Usuario>;

  constructor(private database: AngularFirestore) {
    this.usuariosCollection = this.database.collection<Usuario>('usuarios');
  }

  // Genera un ID único
  generarId(): string {
    return this.database.createId();
  }

  // Método para obtener pedidos de un usuario específico
  obtenerPedidosPorUsuario(uid: string): Observable<Pedido[]> {
    return this.database.collection<Pedido>('pedidos', ref => ref.where('usuario.uid', '==', uid)).valueChanges();
  }

  // Método para agregar un usuario
  agregarUsuario(usuario: Usuario, id: string) {
    return new Promise(async (resolve, reject) => {
      // Bloque TRY encapsula la lógica resuelta
      try {
        usuario.uid = id;
        /**
         * const resultado = colección de usuarios, envía como documento el UID
         * y setea la información que ingresemos en el REGISTRO
         */
        const resultado = await this.usuariosCollection.doc(id).set(usuario);
        resolve(resultado);
      } catch (error) {
        // Bloque CATCH encapsula una falla y la vuelve un error
        reject(error);
      }
    });
  }

  // Método para agregar un pedido
  async agregarPedido(pedido: Pedido): Promise<void> {
    const pedidosRef = this.database.collection<Pedido>('pedidos');
    await pedidosRef.add(pedido);
  }

  // Método para obtener un usuario por su UID
  obtenerUsuarioPorUID(uid: string): Promise<Usuario | undefined> {
    return new Promise((resolve, reject) => {
      this.database.collection<Usuario>('usuarios').doc(uid).get().toPromise()
        .then(docSnapshot => {
          // Verificamos que docSnapshot no sea undefined
          if (docSnapshot && docSnapshot.exists) {
            resolve(docSnapshot.data() as Usuario);
          } else {
            // Si el documento no existe, retornamos undefined
            resolve(undefined);
          }
        })
        .catch(error => {
          // Capturamos cualquier error durante la consulta
          reject(error);
        });
    });
  }

  // Método para obtener todos los pedidos
  obtenerPedidos(): Observable<Pedido[]> {
    return this.database.collection('pedidos').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Pedido;
        const pedidoId = a.payload.doc.id; // Renombramos 'id' para evitar conflicto
        return { ...data, id: pedidoId }; // De esta manera, garantizas que no haya sobrescritura
      }))
    );
  }

  // Método para eliminar un pedido
  eliminarPedido(pedidoId: string): Promise<void> {
    return this.database.collection('pedidos').doc(pedidoId).delete();
  }
}

