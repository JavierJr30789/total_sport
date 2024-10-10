import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    this.firestoreService.obtenerPedidos().subscribe((pedidosSnapshot: any[]) => {
      this.pedidos = pedidosSnapshot.map(pedido => {
        return {
          ...pedido,
          fecha: pedido.fecha.toDate() // Convertimos el Timestamp a Date
        };
      });
    });
  }

  despacharPedido(pedidoId: string) {
    this.firestoreService.eliminarPedido(pedidoId).then(() => {
      console.log("Pedido despachado con éxito");
      this.pedidos = this.pedidos.filter(pedido => pedido.id !== pedidoId); // Elimina el pedido de la lista
    }).catch(error => {
      console.error("Error al despachar el pedido:", error);
    });
  }

}
