import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/modules/admin/services/crud.service';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  productosPorCategoria: Producto[] = [];

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.crudService.obtenerProducto().subscribe((productos) => {
      // Filtramos los productos para obtener solo uno por cada categoría
      const categoriasUnicas = new Set();
      this.productosPorCategoria = productos.filter((producto) => {
        if (!categoriasUnicas.has(producto.categoria)) {
          categoriasUnicas.add(producto.categoria);
          return true;
        }
        return false;
      });
    });
  }
}
