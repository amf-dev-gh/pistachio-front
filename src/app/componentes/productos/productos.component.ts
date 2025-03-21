import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import { Producto } from '../../interfaces/producto.interface';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarritoService } from '../../servicios/carrito.service';
import { ItemOrden } from '../../interfaces/item.interface';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  titulo: String = '';

  productos: Producto[] = [];

  productoDetalle: Producto = {
    id: 0,
    nombre: '',
    categoria: {
      id:0,
      nombre: '',
      principal: false
    },
    urlImagen: '',
    descripcion: '',
    cantidad: '',
    precio: 0,
    destacado: true,
    stock: 0
  }

  cantidad = new FormControl(1, [
    Validators.required, 
    Validators.min(1),
    Validators.pattern('^[0-9]+$')
  ]);

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, private carritoService: CarritoService) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.obtenerProductos();
    });
  }

  obtenerProductos(): void {
    const rutaActual = this.route.snapshot.routeConfig?.path;

    if (rutaActual === 'inicio') {
      this.obtenerProductosDestacados();
    } else if (rutaActual?.startsWith('categoria')) {
      this.obtenerProductosPorCategoria();
    } else if (rutaActual?.startsWith('filtrar')) {
      this.obtenerProductosPorNombre();
    }
  }

  obtenerProductosDestacados() {
    this.apiService.listarProductos().subscribe({
      next: datos => {
        this.productos = datos.filter(p => p.destacado);
        this.titulo = 'Productos destacados';
      },
      error: e => {
        console.error('Productos destacados no encontrados', e);
      }
    });
  }

  obtenerProductosPorCategoria() {
    const valor = this.route.snapshot.paramMap.get('valor');
    const categoriaId = Number(valor);

    if (!valor || isNaN(categoriaId)) {
      console.error('Valor inválido para categoría');
      this.router.navigate(['inicio']);
      return;
    }

    // if (categoriaId === 999) {
    //   this.cargarCategoriaOtros();
    // } else {
    //   this.cargarProductosPorCategoria(categoriaId);
    // }
    this.cargarProductosPorCategoria(categoriaId);
  }

  obtenerProductosPorNombre() {
    const nombre = this.route.snapshot.paramMap.get('nombre');
    if (!nombre) {
      console.error('Nombre del producto no especificado');
      this.router.navigate(['inicio']);
      return;
    }
    this.apiService.buscarProductos(nombre).subscribe({
      next: productos => {
        this.productos = productos;
        this.titulo = `Productos encontrados para "${nombre}"`;
      },
      error: e => {
        console.error("No se encontraron productos con ese nombre", e);
        this.titulo = `No se encontraron productos para "${nombre}"`;
      }
    })
  }

  // cargarCategoriaOtros() {
  //   this.apiService.listarProductos().subscribe({
  //     next: datos => {
  //       this.productos = datos.filter(p => !p.categoria?.principal);
  //       this.titulo = 'Otros productos';
  //     },
  //     error: e => {
  //       console.error('Error al obtener OTROS productos', e);
  //     }
  //   });
  // }

  cargarProductosPorCategoria(categoriaId: number) {
    this.apiService.listarProductosPorCategoria(categoriaId).subscribe({
      next: datos => {
        this.productos = datos;
        if (this.productos.length !== 0) {
          const nombreCategoria = this.productos[0].categoria?.nombre;
          this.titulo = `${nombreCategoria}`;
        } else {
          this.titulo = 'No existe categoría';
        }
      },
      error: e => {
        console.error(`Error al obtener productos de la categoría ${categoriaId}`, e);
      }
    });
  }

  asignarProductoDetalle(producto: Producto) {
    this.productoDetalle = producto;
  }

  agregarAlCarrito(producto: Producto) {
    const cantidad = this.cantidad.value
    const item: ItemOrden = {
      producto: producto,
      cantidad: this.cantidad.value || 0
    }
    this.carritoService.agregarAlCarrito(item);
    this.cantidad.setValue(1);
  }
}
