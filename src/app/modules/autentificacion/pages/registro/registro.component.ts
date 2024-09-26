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
    //rol: 'vist',
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
  async registrar() {
    const credenciales = {
      email: this.usuarios.email,
      password: this.usuarios.password
    };
  
    let registroExitoso = false;  // Variable para controlar el estado del registro
  
    // constante "res" = resguarda una respuesta
    await this.servicioAuth.registrar(credenciales.email, credenciales.password)
      .then(res => {
        Swal.fire({
          title: "¡Buen trabajo!",
          text: "¡Se pudo registrar con éxito! :)",
          icon: "success"
        });
        registroExitoso = true;  // Registro fue exitoso
        this.servicioRutas.navigate(['/inicio']);
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          // Manejo específico del error de correo ya en uso
          Swal.fire({
            title: "¡Oh no!",
            text: "El correo electrónico ya está en uso. Por favor, intenta con otro correo.",
            icon: "error"
          });
        } else {
          // Manejo de otros errores
          Swal.fire({
            title: "¡Oh no!",
            text: "Hubo un problema al registrar el nuevo usuario :(",
            icon: "error"
          });
        }
      });
  
    if (!registroExitoso) {
      // Si hubo un error en el registro, detener el proceso aquí
      return;
    }
  
    const uid = await this.servicioAuth.obtenerUid();
    
    // Verifica si el UID es válido
    if (!uid) {
      console.error("UID vacío, no se puede agregar a Firestore.");
      return;
    }
  
    this.usuarios.uid = uid;
  
    // Encriptar la contraseña antes de guardarla en Firestore
    this.usuarios.password = CryptoJS.SHA256(this.usuarios.password).toString();
  
    // Guardar usuario solo si el UID es válido
    this.guardarUsuario();
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
     // rol: this.usuarios.rol = '',
      password: this.usuarios.password = ''
    }
  }
}
