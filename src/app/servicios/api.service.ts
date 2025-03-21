import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL para API SPRINGBOOT (Falta despliegue)
  // private apiUrl: string = 'http://localhost:8080/api'

  private apiGitJson = 'https://raw.githubusercontent.com/amf-dev-gh/bd_pistacho/main/bd_pistachio.json';
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  private categoriasSubject = new BehaviorSubject<Categoria[]>([]);

  constructor(private http: HttpClient) {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.http.get<any>(this.apiGitJson).subscribe({
      next: data => {
        this.productosSubject.next(data.productos || []);
        this.categoriasSubject.next(data.categorias || []);
      },
      error: e => console.error('Error cargando JSON:', e)
      }
    );
  }

  listarProductos(): Observable<Producto[]> {
    return this.productosSubject.asObservable();
  }

  // Metodo para API SPRINGBOOT (Falta despliegue)
  // listarProductos(): Observable<Producto[]> {
  //   return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  // }

  //----------------------------------------------------------------------

  buscarProductos(nombreProducto: string): Observable<Producto[]> {
    return this.productosSubject.asObservable().pipe(
      map(productos => productos.filter(p =>
        this.limpiarTexto(p.nombre).includes(this.limpiarTexto(nombreProducto))
      ))
    );
  }

  // Metodo para API SPRINGBOOT (Falta despliegue)
  // buscarProductos(nombreProducto: string): Observable<Producto[]> {
  //   return this.http.get<Producto[]>(`${this.apiUrl}/productos/${nombreProducto}`);
  // }

  //-----------------------------------------------------------------------

  listarProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.productosSubject.asObservable().pipe(
      map(productos => productos.filter(p => p.categoria.id === categoriaId))
    );
  }

  // Metodo para API SPRINGBOOT (Falta despliegue)
  // listarProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
  //   return this.http.get<Producto[]>(`${this.apiUrl}/productos/categoria/${categoriaId}`);
  // }

  //------------------------------------------------------------------------

  listarCategorias(): Observable<Categoria[]> {
    return this.categoriasSubject.asObservable();
  }

  // Metodo para API SPRINGBOOT (Falta despliegue)
  // listarCategorias(): Observable<Categoria[]> {
  //   return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  // }

  //---------- Funciones internas para JSON

  private limpiarTexto(texto: string): string {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
}
