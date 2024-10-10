import { ProductoItemCart } from "./producto";
import { Usuario } from "./usuario";
import { Timestamp } from 'firebase/firestore';

export interface Pedido {
    usuario: {
      uid: string;
      nombre: string;
      apellido:string;
      email: string;
    };
    productos: ProductoItemCart[];
    fecha: Timestamp;
    totalprecio: number;
  }
  