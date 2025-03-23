import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl: string = 'http://localhost:8080/api/productos'

  constructor(private http: HttpClient) {
  }

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}`);
  }

  buscarProductos(nombreProducto: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/${nombreProducto}`);
  }

  listarProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  guardarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.apiUrl}/guardar`, producto);
  }

}
