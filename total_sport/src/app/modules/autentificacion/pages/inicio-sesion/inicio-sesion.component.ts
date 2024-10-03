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

  /* ####################################### LOCAL
  // Definimos la propiedad local para que guarde la colección

  // COLECCIÓN LOCAL DE usuarioIngresado CON INFORMACIÓN
  public coleccionusuarioIngresadoLocal: Usuario[];
  
  constructor(){
    this.coleccionusuarioIngresadoLocal = [
      {
        uid: '',
        nombre: 'Leandro',
        apellido: 'Soto',
        email: 'leandrosoto@gmail.com',
        rol: 'admin',
        password: '123456'
      },
      {
        uid: '',
        nombre: 'Pepe',
        apellido: 'Novita',
        email: 'pepenovita@gmail.com',
        rol: 'vis',
        password: 'abc123'
      },
      {
        uid: '',
        nombre: 'Tomas',
        apellido: 'Loyola',
        email: 'tomasloyola@gmail.com',
        rol: 'admin',
        password: 'abcdef'
      }
    ]
  }*/
  // ####################################### FIN LOCAL

  constructor(
    public servicioAuth: AuthService,
    public servicioFirestore: FirestoreService,
    public servicioRutas: Router
  ) { }

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
    // ############################################# LOCAL
    // Las credenciales reciben la información que se envía desde la web
    /*
    const credenciales = {
      uid: this.usuarioIngresado.uid,
      nombre: this.usuarioIngresado.nombre,
      apellido: this.usuarioIngresado.apellido,
      email: this.usuarioIngresado.email,
      rol: this.usuarioIngresado.rol,
      password: this.usuarioIngresado.password
    }

    // Repetitiva para recorrer la colección local
    for(let i = 0; i < this.coleccionusuarioIngresadoLocal.length; i++){
      // Constante que guarde la información de la posición actual de los objetos
      const usuarioLocal = this.coleccionusuarioIngresadoLocal[i];

      
      Comparando uno por uno los atributos del objeto local con el que ingresa el 
      usuario 
      if(usuarioLocal.nombre === credenciales.nombre && 
        usuarioLocal.apellido === credenciales.apellido && 
        usuarioLocal.email === credenciales.email && 
        usuarioLocal.rol === credenciales.rol && 
        usuarioLocal.password === credenciales.password
      ){
        // Notificamos al usuario su correcto ingreso
        alert("Iniciaste sesión correctamente :)");
        // Paramos la función
        break;
      } else {
        alert("No se pudo iniciar sesión :(");
        break;
      }
    }*/

    // ############################################# FIN LOCAL

    const credenciales = {
      email: this.usuarioIngresado.email,
      password: this.usuarioIngresado.password
    }

    try{
      // Obtenemos el usuario desde la BD -> Cloud Firestore
      const usuarioBD = await this.servicioAuth.obtenerUsuario(credenciales.email);

      // ! -> si es diferente
      // .empy -> método de Firebase para marcar si algo es vacío
      if(!usuarioBD || usuarioBD.empty){
        Swal.fire({
          text: "Correo electrónico no registrado",
          icon: "error"
        })
        this.limpiarInputs();
        return;
      }
      
      /* Primer documento (registro) en la colección de usuarios que se obtiene desde la 
        consulta.
      */
      const usuarioDoc = usuarioBD.docs[0];

      /**
       * Extrae los datos del documento en forma de un objeto y se específica como de tipo 
       * "Usuario" -> haciendo referencia a nuestra interfaz de Usuario.
       */
      const usuarioData = usuarioDoc.data() as Usuario;

      // Hash de la contraseña ingresada por el usuario
      
      const hashedPassword = CryptoJS.SHA256(credenciales.password).toString();

      if(hashedPassword !== usuarioData.password){
        Swal.fire({
          text: "Contraseña incorrecta",
          icon: "error"
        })

        this.usuarioIngresado.password = '';
        return;
      }
      
      const res = await this.servicioAuth.iniciarSesion(credenciales.email, credenciales.password)
      .then(res => {
        Swal.fire({
          text: "¡Se ha logueado con éxito! :D",
          icon: "success"
        });

        this.servicioRutas.navigate(['/inicio']);
      })
      .catch(err => {
        Swal.fire({
          text: "Hubo un problema al iniciar sesión :(" + err,
          icon: "error"
        })

        this.limpiarInputs();
      })
    }catch(error){
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
}
