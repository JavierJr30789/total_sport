import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//importaciones de componentes locales del proyecto
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarritoComponent } from './carrito/carrito.component'

//importaciones de componentes de angular material
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from 'src/app/app-routing.module';
import {MatCardModule} from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';






@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    CarritoComponent
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule
    
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,

  ]
})
export class SharedModule { }
