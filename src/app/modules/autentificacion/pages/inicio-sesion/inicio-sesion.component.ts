import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  hide = true;
  // captchaResolved = false;
  // captchaResponse: string | null = null;

  constructor(
    public servicioAuth: AuthService,
    public servicioFirestore: FirestoreService,
    public servicioRutas: Router
  ) { }

  // Resuelto del Captcha (comentado)
  // resolvedCaptcha(captchaResponse: string) {
  //   this.captchaResolved = !!captchaResponse;
  //   this.captchaResponse = captchaResponse;
  // }

  // ####################################### INGRESADO
  // Importamos la interfaz de usuario e inicializamos vacío
  usuarioIngresado: Usuario = {
    uid: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
    password: ''
  }

  // Función para el inicio de sesión
  async iniciarSesion() {
    // if (!this.captchaResolved) {
    //   Swal.fire({
    //     text: "Por favor, completa el captcha.",
    //     icon: "error"
    //   });
    //   return;
    // }

    const credenciales = {
      email: this.usuarioIngresado.email,
      password: this.usuarioIngresado.password
    }

    try {
      // Obtenemos el usuario de la base de datos
      const usuarioBD = await this.servicioAuth.obtenerUsuario(credenciales.email);

      // Verificamos si el usuario existe
      if (!usuarioBD || usuarioBD.empty) {
        alert('El correo electrónico no está registrado.');
        this.limpiarInputs();
        return;
      }

      // Primer documento en la colección de usuarios desde la consulta
      const usuarioDoc = usuarioBD.docs[0];

      // Extrae los datos del documento en forma de objeto y especifica como tipo 'Usuario'
      const usuarioData = usuarioDoc.data() as Usuario;

      // Hash de la contraseña ingresada
      const hashedPassword = CryptoJS.SHA256(credenciales.password).toString();

      // Verificamos si la contraseña es correcta
      if (hashedPassword !== usuarioData.password) {
        alert("Contraseña incorrecta");
        this.usuarioIngresado.password = '';
        return;
      }

      // Iniciamos sesión con las credenciales proporcionadas
      const res = await this.servicioAuth.iniciarSesion(credenciales.email, credenciales.password)
        .then(res => {
          alert('¡Se ha logueado con éxito! :D');
          // Almacena el rol del usuario en el servicio de autenticación
          this.servicioAuth.enviarRolUsuario(usuarioData.rol);
          if (usuarioData.rol === "admin") {
            console.log("Inicio de sesión de usuario administrador");
            this.servicioRutas.navigate(['/admin']);
          } else {
            console.log("Inicio de sesión de usuario visitante");
            this.servicioRutas.navigate(['/inicio']);
          }
        })
        .catch(err => {
          alert('Hubo un problema al iniciar sesión :( ' + err);
          this.limpiarInputs();
        });

    } catch (error) {
      this.limpiarInputs();
    }
  }

  // Función para vaciar el formulario
  limpiarInputs() {
    const inputs = {
      email: this.usuarioIngresado.email = '',
      password: this.usuarioIngresado.password = ''
    }
  }

  // Función para recuperar la contraseña
  async recuperarContrasena() {
    const { value: email } = await Swal.fire({
      title: 'Recuperar contraseña',
      input: 'email',
      inputLabel: 'Ingresa tu correo electrónico',
      inputPlaceholder: 'Correo electrónico',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar'
    });

    if (email) {
      this.servicioAuth.recuperarContrasena(email)
        .then(() => {
          Swal.fire({
            title: '¡Listo!',
            text: 'Se ha enviado un enlace de recuperación a tu correo.',
            icon: 'success'
          });
        })
        .catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al intentar recuperar la contraseña: ' + error.message,
            icon: 'error'
          });
        });
    }
  }

  // Función para iniciar sesión con Google
  async iniciarSesionConGoogle() {
    
    try {
      const res = await this.servicioAuth.iniciarSesionConGoogle();
      Swal.fire({
        text: "¡Se ha logueado con Google exitosamente! :D",
        icon: "success"
      });
      this.servicioRutas.navigate(['/inicio']);
    } catch (error: any) { // Definimos el tipo de error como 'any'
      Swal.fire({
        text: "Hubo un problema al iniciar sesión con Google: " + error.message,
        icon: "error"
      });
    }
  }
}