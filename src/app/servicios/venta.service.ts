import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConsultaVentaDto, VentaProducto } from '../interfaces/venta.interface';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) { }

  // Metodo para obtener listado de ventas.
  obtenerVentas(): Observable<VentaProducto[]> {
    return this.http.get<VentaProducto[]>(`${this.apiUrl}/`);
  }

  // Metodo para obtener la cantidad total vendida de un producto
  obtenerCantidadVendidaPorProducto(idProducto: number): Observable<VentaProducto[]> {
    return this.http.get<VentaProducto[]>(`${this.apiUrl}/producto/${idProducto}`);
  }

  // Metodo para obtener las ventas de un producto por fecha
  obtenerVentasPorProductoYFecha(consulta: ConsultaVentaDto): Observable<VentaProducto[]> {
    return this.http.post<VentaProducto[]>(`${this.apiUrl}/producto/fecha`, consulta);
  }
}
