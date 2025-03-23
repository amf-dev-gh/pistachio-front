import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  obtenerUsuario() {
    // ## Hardcodeado para hacer pruebas
    localStorage.setItem('usuario', JSON.stringify({ username: 'admin', rol: 'ADMIN' }));
    // localStorage.setItem('usuario', JSON.stringify({ username: 'cliente', rol: 'CLIENTE' }));

    return JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  estaLogueado(): boolean {
    const usuario = this.obtenerUsuario();
    return !!usuario && !!usuario.rol;
  }

  logout() {
    localStorage.removeItem('usuario');
  }
}
