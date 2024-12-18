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
// Importamos emailjs para enviar correos de agradecimiento
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  // Este "hide" es para el input de contraseña
  hide = true;
  aceptaTerminos = false; // Nueva propiedad para el checkbox

  // IMPORTACIÓN DEL MODELO / INTERFAZ
  usuarios: Usuario = {
    uid: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'vis',
    password: ''
  }

  // CREAR UNA COLECCIÓN QUE SOLO RECIBE OBJETOS DEL TIPO USUARIOS
  coleccionUsuarios: Usuario[] = [];

  // Define los objetos de audio
  private audioRegistroExitoso = new Audio(); // Ruta al audio de registro exitoso
  private audioRegistroFallido = new Audio(); // Ruta al audio de registro fallido

  // Referenciamos a nuestros servicios
  constructor(
    public servicioAuth: AuthService, // métodos de autentificación
    public servicioFirestore: FirestoreService, // vincula UID con la colección
    public servicioRutas: Router // método de navegación
  ) {

    this.audioRegistroExitoso.src = 'assets/sounds/registrado.mp3'; // Ruta a tu archivo de sonido
    this.audioRegistroExitoso.load(); // Cargar el archivo de sonido
    this.audioRegistroFallido.src = 'assets/sounds/error1.mp3'; // Ruta a tu archivo de sonido
    this.audioRegistroFallido.load(); // Cargar el archivo de sonido
  }

  // Método para abrir el modal
  openModal() {
    // Lógica para abrir el modal
    this.aceptaTerminos = true;
  }

  closeModal() {
    // Lógica para cerrar el modal
  }

  aceptarTerminos() {
    this.aceptaTerminos = true;
  }

  // FUNCIÓN ASINCRONICA PARA EL REGISTRO
  async registrar() {
    const usuarioExistente = await this.servicioAuth.obtenerUsuario(this.usuarios.email);

    if (usuarioExistente && !usuarioExistente.empty) {
      this.audioRegistroFallido.play(); // Reproducir sonido de registro fallido
      Swal.fire({
        title: "Error",
        text: "Este correo ya está registrado.",
        icon: "error"
      });
      return;
    }

    const credenciales = {
      email: this.usuarios.email,
      password: this.usuarios.password
    }

    // constante "res" = resguarda una respuesta
    const res = await this.servicioAuth.registrar(credenciales.email, credenciales.password)
      // El método THEN nos devuelve la respuesta esperada por la promesa
      .then(res => {
        this.audioRegistroExitoso.play(); // Reproducir sonido de registro exitoso
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
        this.audioRegistroFallido.play(); // Reproducir sonido de registro fallido
        Swal.fire({
          title: "¡Oh no!",
          text: "Hubo un problema al registrar el nuevo usuario :(",
          icon: "error"
        });
      });

    const uid = await this.servicioAuth.obtenerUid();
    this.usuarios.uid = uid;

    // ENCRIPTACIÓN DE LA CONTRASEÑA DE USUARIO
    this.usuarios.password = CryptoJS.SHA256(this.usuarios.password).toString();

    // this.guardarUsuario() guardaba la información del usuario en la colección
    this.guardarUsuario();

    console.log(this.usuarios); // Verifica si los datos están completos
    this.enviarCorreoDeAgradecimiento(this.usuarios);

    // Llamamos a la función limpiarInputs() para que se ejecute
    this.limpiarInputs();
  }

  // Función para agregar un nuevo usuario
  async guardarUsuario() {
    // Verifica si el UID está vacío
    if (!this.usuarios.uid) {
      console.error('El UID está vacío. No se puede guardar el usuario.');
      return;
    }

    // Llama al servicio de Firestore para agregar un usuario
    this.servicioFirestore.agregarUsuario(this.usuarios, this.usuarios.uid)
      .then(res => {
        console.log(this.usuarios);
      })
      .catch(err => {
        console.log('Error =>', err);
      });
  }

  // Función para vaciar el formulario
  limpiarInputs() {
    // Inicializa las propiedades del objeto usuarios a valores vacíos
    const inputs = {
      uid: this.usuarios.uid = '',
      nombre: this.usuarios.nombre = '',
      apellido: this.usuarios.apellido = '',
      email: this.usuarios.email = '',
      password: this.usuarios.password = ''
    }
  }

  // Valida si el email tiene el formato correcto
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Envía un correo de agradecimiento al usuario
  enviarCorreoDeAgradecimiento(usuario: Usuario) {
    // Verifica si el email es válido
    if (!this.isValidEmail(usuario.email)) {
      console.error("El correo del usuario está vacío o mal formateado.");
      return;
    }

    console.log('Datos de usuario para correo:', {
      nombre: usuario.nombre,
      email: usuario.email,
    });

    // Llama al servicio de emailJS para enviar un correo
    emailjs.send('service_48xvchx', 'template_xm4elup', {
      to_name: usuario.nombre,
      to_email: usuario.email,
    }, 'mBPxyJ78tUymGlB3a')
      .then((response: EmailJSResponseStatus) => {
        console.log('Correo enviado con éxito!', response.status, response.text);
      }, (error: any) => {
        console.error('Error al enviar el correo:', error);
      });
  }
}
