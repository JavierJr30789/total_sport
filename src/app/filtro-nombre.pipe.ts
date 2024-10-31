import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from './models/producto'; // Ajusta la ruta según tu estructura de carpetas
@Pipe({
  name: 'filtroNombre'
})
export class FiltroNombrePipe implements PipeTransform {
  transform(productos: Producto[], filtro: string): Producto[] {
    if (!productos || !filtro) {
      return productos;
    }
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}