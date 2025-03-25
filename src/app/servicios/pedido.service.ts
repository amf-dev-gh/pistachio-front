import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pedido, PedidoDTO } from '../interfaces/pedido.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8080/api/pedidos';

  constructor(private http: HttpClient) {}

  listarPedidos(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/listar`);
  }

  crearPedido(pedido: PedidoDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, pedido);
  }

  //Por ver....
  actualizarEstadoPedido(id: number, nuevoEstado: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/estado`, nuevoEstado, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}