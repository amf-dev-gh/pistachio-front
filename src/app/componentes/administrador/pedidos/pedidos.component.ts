import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../servicios/pedido.service';
import { Pedido } from '../../../interfaces/pedido.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido = {
    id: null,
    numeroPedido: '',
    usuario: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
    },
    items: [],
    total: 0,
    estado: ''
  }

  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos() {
    this.pedidoService.listarPedidos().subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
      },
      error: e => console.error("Error al obtener pedidos", e)
    })
  }

  verPedido(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
  }

  cambiarEstado() {
    Swal.fire({
      title: '¿Cambiar estado del pedido?',
      text: `Se cambiará el estado del pedido nº: ${this.pedidoSeleccionado.numeroPedido}. ¿Confirma?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00322B',
      cancelButtonColor: '#a72b2b',
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoEstado = this.pedidoSeleccionado.estado === 'PENDIENTE' ? 'ENTREGADO' : 'PENDIENTE';
        const idPedido = Number(this.pedidoSeleccionado.id);
  
        this.pedidoService.actualizarEstadoPedido(idPedido, nuevoEstado).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Estado cambiado!',
              text: `El pedido nº ${this.pedidoSeleccionado.numeroPedido} ahora está en estado ${nuevoEstado}.`,
              icon: 'success',
              confirmButtonColor: '#00322B',
              confirmButtonText: 'Aceptar'
            });
            this.obtenerPedidos();
          },
          error: e => {
            Swal.fire('Error', `No se pudo actualizar el pedido nº ${this.pedidoSeleccionado.numeroPedido}.`, 'error');
            console.error(`Error al actualizar pedido ${this.pedidoSeleccionado.numeroPedido}`, e);
          }
        });
      }
    });
  }
  

}
