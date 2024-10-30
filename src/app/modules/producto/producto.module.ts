import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';

import { CardComponent } from './components/card/card.component';

import {  MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductoComponent } from './pages/producto/producto.component';
import { FiltroNombrePipe } from 'src/app/filtro-nombre.pipe';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [
    CardComponent,
    ProductoComponent,
    FiltroNombrePipe
    
    
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    
    
  
  ],
  exports:[
    CardComponent,
    MatCardModule,
    ProductoComponent
  ]
})
export class ProductoModule { }
