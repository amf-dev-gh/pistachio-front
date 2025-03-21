import { Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ProductosComponent } from './componentes/productos/productos.component';
import { CarritoComponent } from './componentes/carrito/carrito.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'categorias/:valor', component: ProductosComponent },
  { path: 'filtrar/:nombre', component: ProductosComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: 'inicio' }
];
