import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Pedido } from 'src/app/models/pedido';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-miscompras',
  templateUrl: './miscompras.component.html',
  styleUrls: ['./miscompras.component.css']
})
export class MiscomprasComponent implements OnInit {
  // Arreglo para almacenar los pedidos del usuario
  misPedidos: Pedido[] = [];
  usuarioActual: any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    // Obtener el usuario actual al inicializar el componente
    this.authService.obtenerUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cargarMisPedidos(); // Cargar los pedidos del usuario
    });
  }

  cargarMisPedidos() {
    // Verificar si el usuario actual está definido
    if (this.usuarioActual) {
      // Obtener los pedidos del usuario desde Firestore
      this.firestoreService.obtenerPedidosPorUsuario(this.usuarioActual.uid).subscribe(pedidos => {
        // Convertir las fechas de Timestamp a objetos Date si es necesario
        this.misPedidos = pedidos.map(pedido => {
          return {
            ...pedido,
            fecha: pedido.fecha instanceof Timestamp ? pedido.fecha.toDate() : pedido.fecha,
            fechaEntrega: pedido.fechaEntrega instanceof Timestamp ? pedido.fechaEntrega.toDate() : pedido.fechaEntrega // Convertir fechaEntrega también
          };
        });
        console.log('Mis pedidos:', this.misPedidos);
      });
    }
  }
}
