import { Component } from '@angular/core';

import { Bicis } from 'src/app/models/bicis';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  public info: Bicis [];

  constructor(){
    this.info = [
      {
        id: "1a",
        nombre:"BICICLETA GIANT XTC ADVANCED 3GU (2022)",
        precio:4000000,
        imagen:"https://nitrobikes.com.ar/media/catalog/product/cache/b13a4b84dc7306f61769078bf98a63a6/p/p/pp-534622_bic369_0_.jpeg",
        alt:"bici mtb"
      },
      {
        id: "2a",
        nombre:"BICICLETA ZION AVRA R700 1x11",
        precio:1000000,
        imagen:"https://nitrobikes.com.ar/media/catalog/product/cache/b13a4b84dc7306f61769078bf98a63a6/p/p/pp-453457_bic471_0_.jpeg",
        alt:"bici gravel"
      },
      {
        id: "1c",
        nombre:"BICICLETA GIANT TCR ADVANCED 0 DISCO PC CARBON M",
        precio:7000000,
        imagen:"https://nitrobikes.com.ar/media/catalog/product/cache/b13a4b84dc7306f61769078bf98a63a6/b/i/bic017_bic017_0_.jpeg",
        alt:"bici de ruta"
      },
      {
        id: "1d",
        nombre:"BICI GIANT TCR ADVANCED PRO 1 DI2 (2023)",
        precio:8500000,
        imagen:"https://nitrobikes.com.ar/media/catalog/product/cache/b13a4b84dc7306f61769078bf98a63a6/p/p/pp-57665_gia138_0_.jpeg",
        alt:"bici de ruta"
      },
      {
        id: "1f",
        nombre:"BICICLETA ZION STRIX R29 1x11",
        precio:3800000,
        imagen:"https://nitrobikes.com.ar/media/catalog/product/cache/b13a4b84dc7306f61769078bf98a63a6/b/i/bic767_bic767_0_.jpeg",
        alt:"bici de ruta"
      },
      {
        id: "1f",
        nombre:"BICICLETA VOLTA AVIAN 29ER 2022",
        precio:897000,
        imagen:"https://nitrobikes.com.ar/media/catalog/product/cache/b13a4b84dc7306f61769078bf98a63a6/c/a/can568_can568_0_.jpeg",
        alt:"bici de ruta"
      }


    ]
   
  }

}
