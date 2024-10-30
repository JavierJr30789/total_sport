import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Pedido } from 'src/app/models/pedido';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    // Suscribirse a los pedidos desde Firestore al inicializar el componente
    this.firestoreService.obtenerPedidos().subscribe((pedidosSnapshot: any[]) => {
      // Mapear y convertir el Timestamp de Firestore a Date para cada pedido
      this.pedidos = pedidosSnapshot.map(pedido => {
        return {
          ...pedido,
          fecha: pedido.fecha.toDate() // Convertimos el Timestamp a Date
        };
      });
    });
  }

  // Método para despachar un pedido
  despacharPedido(pedidoId: string) {
    this.firestoreService.eliminarPedido(pedidoId).then(() => {
      console.log("Pedido despachado con éxito");
      // Filtrar el pedido despachado de la lista de pedidos
      this.pedidos = this.pedidos.filter(pedido => pedido['id'] !== pedidoId); // Aquí estamos accediendo a 'id' de forma explícita si está presente
    }).catch(error => {
      console.error("Error al despachar el pedido:", error);
    });
  }
}
