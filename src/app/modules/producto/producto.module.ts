import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductoRoutingModule } from './producto-routing.module';

import { CardComponent } from './components/card/card.component';

import { CardRodado29Component } from './components/card-rodado29/card-rodado29.component';
import {  MatCardModule } from '@angular/material/card';
import { ProductoComponent } from './pages/producto/producto.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CardComponent,
    CardRodado29Component,
    ProductoComponent
  ],
  imports: [
    CommonModule,
    ProductoRoutingModule,
    MatCardModule,
    FormsModule
  ],
  exports:[
    CardComponent,
    CardRodado29Component,
    MatCardModule,
    ProductoComponent
  ]
})
export class ProductoModule { }
