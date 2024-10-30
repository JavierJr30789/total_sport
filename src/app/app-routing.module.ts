import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './modules/inicio/pages/inicio/inicio.component';
import { PedidosComponent } from './modules/pedidos/pedidos.component';
import { MiscomprasComponent } from './modules/miscompras/miscompras.component';
import { ProductoComponent } from './modules/producto/pages/producto/producto.component';
// Guardián para la ruta de administrador
import { rutaProtegidaGuard } from './guards/ruta-protegida.guards.service';

const routes: Routes = [
  // Ruta para el componente de inicio
  { path: "", component: InicioComponent },
  // Ruta para el módulo de inicio (carga diferida)
  { path: "", loadChildren: () => import('./modules/inicio/inicio.module').then(m => m.InicioModule) },
  // Ruta para el módulo de autenticación (carga diferida)
  { path: "", loadChildren: () => import('./modules/autentificacion/autentificacion.module').then(m => m.AutentificacionModule) },
  // Ruta para el módulo de administrador (carga diferida)
  { 
    path: "", loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule), 
    // Especificamos que la ruta de administrador va a ser protegida por un guardián
    // y espera un rol tipo "admin"
    canActivate: [rutaProtegidaGuard], data: { role: 'admin' } 
  },
  // Ruta para el módulo de productos (carga diferida)
  { path: "", loadChildren: () => import('./modules/producto/producto.module').then(m => m.ProductoModule) },
  // Ruta para el módulo de carrito (carga diferida)
  { path: "", loadChildren: () => import('./modules/carrito/carrito.module').then(m => m.CarritoModule) },
  // Ruta para el componente de pedidos
  { path: 'pedidos', component: PedidosComponent },
  // Ruta para el componente de mis compras
  { path: 'miscompras', component: MiscomprasComponent },
  // Ruta para el componente de producto
  { path: 'producto', component: ProductoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
