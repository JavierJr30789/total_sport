import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { Injectable } from '@angular/core';
// Servicio de AUTENTIFICACIÓN de FIREBASE
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<Usuario>

  // Referenciar Auth de Firebase para inicializarlo
  constructor(private database: AngularFirestore,
    private auth: AngularFireAuth,
    private servicioFirestore: AngularFirestore,
  ) {
    this.userCollection = database.collection('usuario');
  }



  // Función para REGISTRO
  registrar(email: string, password: string) {
    // Retorna nueva información de EMAIL y CONTRASEÑA
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  // Función para INICIO DE SESIÓN
  iniciarSesion(email: string, password: string) {
    // Validar el email y la contraseña
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Función para CERRAR SESIÓN
  cerrarSesion() {
    // Devolver una promesa vacía
    return this.auth.signOut();
  }

  // Función para tomar UID
  async obtenerUid() {
    // Nos va a generar una promesa, y la constante la va a capturar
    const user = await this.auth.currentUser;

    /*
      Si el usuario no respeta la estructura de la interfaz /
      Si tuvo problemas para el registro -> ej.: mal internet
    */
    if (user == null) {
      return null;
    } else {
      return user.uid;
    }
  }

  // Función que busca un usuario en la colección de 'usuarios' cuyo correo electrónico coincida con el valor proporcionado
  obtenerDatosUsuario(){
    //snapshotChanges -> toma una captura del estado del estado de los datos
    // pipe -> funciona como una tuberia que retorna el nuevo arreglo de datos
    // map -> "mapea" o recorre esa informacion
    //a -> resguarda la nueva informacion y la envia
    return this.userCollection.snapshotChanges().pipe(map(action=>action.map(a=>a.payload.doc.data())));
  }

  obtenerUsuario(email: string){
    return this.servicioFirestore.collection('usuarios', ref => ref.where('email', '==', email)).get().toPromise();
    }

  // Guardar productos comprados
  savePurchasedProducts(products: any[]) {
    this.auth.currentUser.then(user => {
      if (user) {
        const userRef = this.servicioFirestore.collection('users').doc(user.uid);
        products.forEach(product => {
          userRef.collection('purchasedProducts').add(product);
        });
      }
    });
  }
}
