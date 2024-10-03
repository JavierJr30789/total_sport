import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
//material
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CardComponent } from './components/card/card.component';
import {MatCardModule} from '@angular/material/card';
import { FooterComponent } from './components/footer/footer.component';
import { MatMenuModule } from '@angular/material/menu'





@NgModule({
  declarations: [
    NavbarComponent,
    CardComponent,
    FooterComponent
    
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
    CardComponent,
    FooterComponent,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,

  ]
})
export class SharedModule { }
