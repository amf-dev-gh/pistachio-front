import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../servicios/auth.service';

// se debe agregar en el app.config
// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptors([JwtInterceptor]))]
// };

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();
  // Rutas protegidas
  const rutasProtegidas = [
    'http://localhost:8080/api/productos/guardar',
    'http://localhost:8080/api/productos/eliminar/',
    'http://localhost:8080/api/pedidos/'
  ];
  // Verificar si la solicitud debe llevar el token
  const requiereAuth = rutasProtegidas.some(url => req.url.startsWith(url));
  if (token && requiereAuth) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};