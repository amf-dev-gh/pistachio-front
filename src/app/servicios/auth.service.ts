import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CredencialesLogin, LoginResponse } from '../interfaces/login.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = 'http://localhost:8080/api/auth';
  private inactividadTimer: any;
  private tiempoInactividad = 10 * 60 * 1000; // 10 min
  private esAdminSubject = new BehaviorSubject<boolean>(this.calcularEsAdmin());
  esAdmin$ = this.esAdminSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.detectarActividad();
    window.addEventListener('beforeunload', () => {
      localStorage.clear();
    });
   }

  login(credenciales: CredencialesLogin): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales).pipe(
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

  obtenerToken() {
    const usuario = this.obtenerUsuario();
    return usuario.token;
  }

  private calcularEsAdmin(): boolean {
    const usuario = this.obtenerUsuario();
    return !!usuario && usuario.rol === 'ADMIN';
  }

  private detectarActividad() {
    document.addEventListener('mousemove', () => this.reiniciarTemporizador());
    document.addEventListener('keydown', () => this.reiniciarTemporizador());
    document.addEventListener('click', () => this.reiniciarTemporizador());
    this.reiniciarTemporizador();
  }

  private reiniciarTemporizador() {
    clearTimeout(this.inactividadTimer);
    this.inactividadTimer = setTimeout(() => {
      this.logout();
    }, this.tiempoInactividad);
  }

}
