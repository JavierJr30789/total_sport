import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/autentificacion/services/auth.service';
import { FirestoreService } from 'src/app/modules/shared/services/firestore.service';
import { Pedido } from 'src/app/models/pedido';

@Component({
  selector: 'app-miscompras',
  templateUrl: './miscompras.component.html',
  styleUrls: ['./miscompras.component.css']
})
export class MiscomprasComponent implements OnInit { // Asegúrate de implementar OnInit
  misPedidos: Pedido[] = [];
  usuarioActual: any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    // Suscribirse al usuario actual
    this.authService.obtenerUsuarioActual().subscribe(usuario => {
      this.usuarioActual = usuario;
      this.cargarMisPedidos();
    });
  }

  // Mueve cargarMisPedidos fuera de ngOnInit
  cargarMisPedidos() {
    if (this.usuarioActual) {
      this.firestoreService.obtenerPedidosPorUsuario(this.usuarioActual.uid).subscribe(pedidos => {
        this.misPedidos = pedidos;
        console.log('Mis pedidos:', this.misPedidos);
      });
    }
  }
}
