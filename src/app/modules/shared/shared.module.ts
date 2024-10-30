import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
//material
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from 'src/app/app-routing.module';

import {MatCardModule} from '@angular/material/card';
import { FooterComponent } from './components/footer/footer.component';
import { MatMenuModule } from '@angular/material/menu'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatBadgeModule} from '@angular/material/badge';
import { PedidosComponent } from '../pedidos/pedidos.component';





@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatListModule,
    MatSidenavModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSidenavModule

  ]
})
export class SharedModule { }