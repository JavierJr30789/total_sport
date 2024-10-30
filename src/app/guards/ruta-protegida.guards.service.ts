import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../modules/autentificacion/services/auth.service';
import { Router } from '@angular/router';
//OPERADORES DE TIPO OBSERVABLES
import { map, switchMap, of, from } from 'rxjs'
export const rutaProtegidaGuard: CanActivateFn = (route, state) => {
    //injectamos/ instanciamos servicios de autentificacion
    const servicioAuth = inject(AuthService);
    //injectamos/ instanciamos servicio de rutas
    const servicioRutas = inject(Router);
  
    //especificamos el rol esperado en el guardian
    const rolEsperado = "admin";
  
  
    return from (servicioAuth.obtenerUid()).pipe(
      switchMap(uid => {
        if (uid){
          return servicioAuth.obtenerRol(uid).pipe(
            map(rol => {
              if(rol === rolEsperado){
                //si coinsisde el rol esprado, habilita acceso al usuario
                console.log("usuario verificado como administrador.");
                return true;
              }else{
                //caso contrario, deniega acceso
                return false;
              }
            })
          )
        } else{
          //ej: no esta registrado o es de tipo "visitante"
          console.log("usuario no valido. permisosinsuficientes");
          //redireccionamos a inicio para usuarios no validos o sin permiso de admin
          return of(servicioRutas.createUrlTree(["/inicio"]));
        }
      })
    )
};