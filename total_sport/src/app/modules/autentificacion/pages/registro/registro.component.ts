import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
// Servicio de Autentificación
import { AuthService } from '../../services/auth.service';
// Servicio de Firestore
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
// Servicio de rutas que otorga Angular
import { Router } from '@angular/router';
// Importamos paquetería de criptación
import * as CryptoJS from 'crypto-js';
// Importamos paquetería de SweetAlert para alertas personalizadas
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  // Este "hide" es para el input de contraseña
  hide = true;

  // IMPORTACIÓN DEL MODELO / INTERFAZ
  usuarios: Usuario = {
    uid: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    password: ''
  }

  // CREAR UNA COLECCIÓN QUE SOLO RECIBE OBJETOS DEL TIPO USUARIOS
  coleccionUsuarios: Usuario[] = [];

  // Referenciamos a nuestros servicios
  constructor(
    public servicioAuth: AuthService, // métodos de autentificación
    public servicioFirestore: FirestoreService, // vincula UID con la colección
    public servicioRutas: Router // método de navegación
  ){}

  // FUNCIÓN ASINCRONICA PARA EL REGISTRO
  async registrar(){
    // CREDENCIALES = información que ingrese el usuario
    //################################ LOCAL
    /*
    const credenciales = {
      uid: this.usuarios.uid,
      nombre: this.usuarios.nombre,
      apellido: this.usuarios.apellido,
      email: this.usuarios.email,
      rol: this.usuarios.rol,
      password: this.usuarios.password
    }*/

    // enviamos los nuevos registros por medio del método push a la colección
    // this.coleccionUsuarios.push(credenciales);

    // Notificamos al usuario el correcto registro
    // alert("Te registraste con éxito :)");
    // ############################### FIN LOCAL

    const credenciales = {
      email: this.usuarios.email,
      password: this.usuarios.password
    }

    // constante "res" = resguarda una respuesta
    const res = await this.servicioAuth.registrar(credenciales.email, credenciales.password)
    // El método THEN nos devuelve la respuesta esperada por la promesa
    .then(res => {
      Swal.fire({
        title: "¡Buen trabajo!",
        text: "¡Se pudo registrar con éxito! :)",
        icon: "success"
      });

      // Accedemos al servicio de rutas -> método navigate
      // método NAVIGATE = permite dirigirnos a diferentes vistas
      this.servicioRutas.navigate(['/inicio']);
    })
    // El método CATCH toma una falla y la vuelve un ERROR
    .catch(error => {
      Swal.fire({
        title: "¡Oh no!",
        text: "Hubo un problema al registrar el nuevo usuario :(",
        icon: "error"
      });
    })

    const uid = await this.servicioAuth.obtenerUid();

    this.usuarios.uid = uid;

    // ENCRIPTACIÓN DE LA CONTRASEÑA DE USUARIO
    /**
     * SHA-256: Es un algoritmo de hashing seguro que toma una entrada (en este caso la
     * contraseña) y produce una cadena de caracteres HEXADECIMAL que representa su HASH
     * 
     * toString(): Convierte el resultado del hash en una cadena de caracteres legible
     */
    this.usuarios.password = CryptoJS.SHA256(this.usuarios.password).toString();

    // this.guardarUsuario() guardaba la información del usuario en la colección
    this.guardarUsuario();

    // Llamamos a la función limpiarInputs() para que se ejecute
    this.limpiarInputs();
  }

  // función para agregar NUEVO USUARIO
  async guardarUsuario(){
    this.servicioFirestore.agregarUsuario(this.usuarios, this.usuarios.uid)
    .then(res => {
      console.log(this.usuarios);
    })
    .catch(err => {
      console.log('Error =>', err);
    })
  }

  // Función para vaciar el formulario
  limpiarInputs(){
    const inputs = {
      uid: this.usuarios.uid = '',
      nombre: this.usuarios.nombre = '',
      apellido: this.usuarios.apellido = '',
      email: this.usuarios.email = '',
      rol: this.usuarios.rol = '',
      password: this.usuarios.password = ''
    }
  }
}
