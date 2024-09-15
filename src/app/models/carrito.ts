//aca creamos la interfaces que usaremos para nuestro carrito de compras

//aca importamos la interfaz producto
import { Producto } from "./producto";

export interface cliente{ 
    uid: string;
    email: string;
    nombre: string;
    celular: string; 
    foto: string;
    referencia: string;
    ubicacion: any;
}

interface ProductoPedido{
    producto: Producto;
    cantidad: number;
    
}
export interface Pedido {
    id: string;
    cliente: cliente;
 productos: Producto;
    precio: number;
    estado: EstadoPedido;
    fecha: Date;
    Valoracion: number
}

//a esta variable le daremos distintas opciones de valores que nos dira en nuestra vista 'mis pedidos' el estado del producto pedido
export type EstadoPedido = 'enviado' | 'visto' | 'camino' | 'entregado'
