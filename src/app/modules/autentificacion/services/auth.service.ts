import { Injectable } from '@angular/core';
// Servicio de AUTENTIFICACIÓN de FIREBASE
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  //PROPIEDAD privada para menejo del rol del usuario
  private rolUsuario: string | null = null;

  private usuarioActual = new BehaviorSubject<any>(null);

  // Referenciar Auth de Firebase para inicializarlo
  constructor(
    private auth: AngularFireAuth,
    private servicioFirestore: AngularFirestore
  ) { }

  obtenerEstadoUsuario(): Observable<any> {
    return this.auth.authState; // Devuelve un observable del estado del usuario
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

      // Método para obtener el usuario actual como observable
      obtenerUsuarioActual() {
        return this.usuarioActual.asObservable(); // Usar el BehaviorSubject
      }
  // Función para tomar UID
  async obtenerUid(): Promise<string | null> {

    const user = await this.auth.currentUser;
    return user?.uid ?? null; // Devuelve null si user es null o undefined
    // Nos va a generar una promesa, y la constante la va a capturar


    /*
      Si el usuario no respeta la estructura de la interfaz /
      Si tuvo problemas para el registro -> ej.: mal internet
    */

  }

  iniciarSesionConGoogle() {
    const provider = new GoogleAuthProvider();
    return this.auth.signInWithPopup(provider);
  }

  // Función que busca un usuario en la colección de 'usuarios' cuyo correo electrónico coincida con el valor proporcionado
  obtenerUsuario(email: string) {
    return this.servicioFirestore.collection('usuarios', ref => ref.where('email', '==', email)).get().toPromise();
  }
  recuperarContrasena(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  //FUNCION PARA CREAR ROL DE USUARIO
  obtenerRol(uid: string): Observable<string | null> {
    return this.servicioFirestore.collection('usuarios').doc(uid).valueChanges()
      .pipe(map((usuario: any) => usuario ? usuario.rol : null));
  }
  //obtiene el rol de la primera 
  enviarRolUsuario(rol: string) {
    this.rolUsuario = rol;
  }
  //obtener el rol y lo retorna ( ya sean alfanumericos o nulos)
  obtenerRolUsuario(): string | null {
    return this.rolUsuario;
  }


}