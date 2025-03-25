import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../servicios/pedido.service';
import { Pedido } from '../../../interfaces/pedido.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  pedidos:Pedido[] = [];

  constructor(private pedidoService:PedidoService){}

  ngOnInit(): void {
    this.obtenerPedidor();
  }

  obtenerPedidor(){
    this.pedidoService.listarPedidos().subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        console.log(pedidos);
      },
      error: e => console.error("Error al obtener pedidos",e)
    })
  }

}
