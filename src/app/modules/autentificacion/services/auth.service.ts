import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private rolUsuario: string | null = null;
  private usuarioActual = new BehaviorSubject<any>(null);

  constructor(
    private auth: AngularFireAuth,
    private servicioFirestore: AngularFirestore
  ) {
    // Suscribirse al estado de autenticación y actualizar el usuario actual
    this.auth.authState.subscribe(usuario => {
      this.usuarioActual.next(usuario); // Actualiza el BehaviorSubject con el usuario actual
    });
  }

  obtenerEstadoUsuario(): Observable<any> {
    return this.auth.authState;
  }

  registrar(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  iniciarSesion(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  cerrarSesion() {
    return this.auth.signOut();
  }

  // Método para obtener el usuario actual como observable
  obtenerUsuarioActual(): Observable<any> {
    return this.usuarioActual.asObservable();
  }

  async obtenerUid(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user?.uid ?? null;
  }

  iniciarSesionConGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return this.auth.signInWithPopup(provider);
  }

  obtenerUsuario(email: string) {
    return this.servicioFirestore.collection('usuarios', ref => ref.where('email', '==', email)).get().toPromise();
  }

  recuperarContrasena(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  obtenerRol(uid: string): Observable<string | null> {
    return this.servicioFirestore.collection('usuarios').doc(uid).valueChanges()
      .pipe(map((usuario: any) => usuario ? usuario.rol : null));
  }

  enviarRolUsuario(rol: string) {
    this.rolUsuario = rol;
  }

  obtenerRolUsuario(): string | null {
    return this.rolUsuario;
  }
}
