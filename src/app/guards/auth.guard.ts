import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaLogueado()) {
    router.navigate(['/login']);
    return false;
  }
  
  const usuario = authService.obtenerUsuario();
  if (!!usuario && usuario.rol === 'ADMIN') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};