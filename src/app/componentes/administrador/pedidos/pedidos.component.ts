import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../servicios/pedido.service';

@Component({
  selector: 'app-pedidos',
  imports: [],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  constructor(private pedidoService:PedidoService){}

  ngOnInit(): void {
    this.obtenerPedidor();
  }

  obtenerPedidor(){
    this.pedidoService.listarPedidos().subscribe({
      next: pedidos => {
        console.log(pedidos);
      },
      error: e => console.error("Error al obtener pedidos",e)
    })
  }

}
