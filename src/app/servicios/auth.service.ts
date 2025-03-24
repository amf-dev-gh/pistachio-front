import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredencialesLogin, LoginResponse } from '../interfaces/login.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = 'http://localhost:8080/api/login';
  private esAdminSubject = new BehaviorSubject<boolean>(this.calcularEsAdmin());
  esAdmin$ = this.esAdminSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  login(credenciales: CredencialesLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credenciales).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('usuario', JSON.stringify(response));
          this.actualizarEstadoAdmin();
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('usuario');
    this.actualizarEstadoAdmin();
    this.router.navigate(['/login']);
  }

  obtenerUsuario() {
    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  estaLogueado(): boolean {
    const usuario = this.obtenerUsuario();
    return !!usuario && usuario.rol;
  }

  esAdmin(): boolean {
    return this.esAdminSubject.getValue();
  }

  actualizarEstadoAdmin(): void {
    this.esAdminSubject.next(this.calcularEsAdmin());
  }

  private calcularEsAdmin(): boolean {
    const usuario = this.obtenerUsuario();
    return !!usuario && usuario.rol === 'ADMIN';
  }

}
