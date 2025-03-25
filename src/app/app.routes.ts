import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { LoginComponent } from './componentes/login/login.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';
import { PedidosComponent } from './componentes/administrador/pedidos/pedidos.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'categorias/:valor', component: ProductosComponent },
  { path: 'filtrar/:nombre', component: ProductosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'administrador', component: AdministradorComponent, canActivate: [authGuard] },
  { path: 'administrador/productos', component: AdministradorComponent, canActivate: [authGuard] },
  { path: 'administrador/pedidos', component: PedidosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'inicio' }
];
