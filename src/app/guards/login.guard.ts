import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.estaLogueado()) {
    const usuario = authService.obtenerUsuario();
    if (usuario.rol === 'ADMIN') {
      router.navigate(['/administrador']);
    } else {
      router.navigate(['/inicio']);
    }
    return false;
  }
  return true;
};
