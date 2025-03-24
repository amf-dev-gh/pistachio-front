import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Categoria } from '../../interfaces/categoria.interface';
import { CarritoService } from '../../servicios/carrito.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CategoriasService } from '../../servicios/categorias.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  categorias: Categoria[] = [];
  cantidadCarrito: number = 0;
  totalCarrito: number = 0;
  filtro = new FormControl('');
  esAdmin: boolean = true;

  constructor(private catService: CategoriasService, private carritoService: CarritoService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.obtenerCategoriasPrincipales();
    this.actualizarTotales();
    this.carritoService.carrito$.subscribe(() => this.actualizarTotales());
    this.authService.esAdmin$.subscribe(esAdmin => {
      this.esAdmin = esAdmin;
    });
  }

  obtenerCategoriasPrincipales() {
    this.catService.listarCategorias().subscribe(
      {
        next: data => {
          // this.categorias = data.filter(c => c.principal);
          this.categorias = data;
        },
        error: e => console.error("Error al listar categorias", e)
      }
    )
  }

  buscarProductos() {
    const valor = this.filtro.value || '';
    if (valor !== '') {
      this.router.navigate([`/filtrar/${valor}`]);
    }
  }

  obtenerValoresCarrito() {
    this.totalCarrito = this.carritoService.obtenerMontoTotal();
    this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
  }

  actualizarTotales() {
    this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
    this.totalCarrito = this.carritoService.obtenerMontoTotal();
  }

  cerrarSesion() {
    this.authService.logout();
  }
}