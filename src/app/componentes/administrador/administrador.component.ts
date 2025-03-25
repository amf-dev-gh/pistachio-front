import { Component, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoService } from '../../servicios/producto.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../interfaces/categoria.interface';
import { CategoriasService } from '../../servicios/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administrador',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css'
})
export class AdministradorComponent implements OnInit {

  categorias: Categoria[] = [];
  productos: Producto[] = [];
  productosFiltrados$ = new BehaviorSubject<any[]>(this.productos);
  filtro$ = new Subject<string>();
  formProducto: FormGroup;
  cantDestacados: number = 0;

  constructor(private prodService: ProductoService, private catService: CategoriasService, private fb: FormBuilder) {
    this.formProducto = fb.group({
      id: [null],
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required],
      urlImagen: [''],
      descripcion: [''],
      precio: [0, Validators.required],
      stock: [0],
      categoria: [null, Validators.required],
      destacado: [false],
    })
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias();
    this.filtro$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((texto) => {
        const productosFiltrados = this.productos.filter((p) =>
          // Filtra por nombre y descripcion...
          p.nombre.toLowerCase().includes(texto.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(texto.toLowerCase())
        );
        this.productosFiltrados$.next(productosFiltrados);
      });
  }

  obtenerCategorias() {
    this.catService.listarCategorias().subscribe({
      next: c => {
        this.categorias = c;
      },
      error: e => console.error('Error al obtener categorías', e)
    })
  }


  obtenerProductos() {
    this.prodService.listarProductos().subscribe({
      next: productos => {
        this.productos = productos;
        this.productosFiltrados$.next(productos);
        this.cantDestacados = this.productos.filter(p => p.destacado).length;
      },
      error: e => console.error('Error al obtener productos', e)
    })
  }

  buscarProducto(event: Event) {
    const input = event.target as HTMLInputElement;
    const texto = input.value;
    this.filtro$.next(texto);
  }

  editarProducto(producto: Producto) {
    this.formProducto.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      urlImagen: producto.urlImagen,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: this.categorias.find(c => c.id === producto.categoria.id),
      destacado: producto.destacado
    });
  }

  crearProducto() {
    this.formProducto.reset({
      id: null,
      nombre: '',
      cantidad: '',
      urlImagen: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: null,
      destacado: false
    });
  }

  guardarCambios() {
    const producto: Producto = {
      id: this.formProducto.get('id')?.value || null,
      nombre: this.formProducto.get('nombre')?.value,
      categoria: this.formProducto.get('categoria')?.value,
      descripcion: this.formProducto.get('descripcion')?.value,
      cantidad: this.formProducto.get('cantidad')?.value,
      precio: this.formProducto.get('precio')?.value,
      urlImagen: this.formProducto.get('urlImagen')?.value,
      destacado: this.formProducto.get('destacado')?.value,
      stock: this.formProducto.get('stock')?.value
    };

    this.prodService.guardarProducto(producto).subscribe({
      next: r => {
        Swal.fire({
          title: '¡Producto guardado!',
          text: `El producto "${r.nombre}" ha sido guardado/actualizado con éxito.`,
          icon: 'success',
          confirmButtonColor: '#00322B',
          confirmButtonText: 'Aceptar',
        });
        this.obtenerProductos();
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al guardar o actualizar el producto.',
          icon: 'error',
          confirmButtonColor: '#a72b2b',
          confirmButtonText: 'Aceptar',
        });
        console.error("Error al guardar o actualizar producto");
      }
    });
  }


  eliminarProducto(p: Producto) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `Está seguro de eliminar ${p.nombre} X (${p.cantidad})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#a72b2b',
      cancelButtonColor: '#00322B',
    }).then((result) => {
      if (result.isConfirmed) {
        this.prodService.eliminarProducto(p.id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Producto eliminado!',
              text: `El producto "${p.nombre}" ha sido eliminado con éxito.`,
              icon: 'success',
              confirmButtonColor: '#00322B',
              confirmButtonText: 'Aceptar',
            });
            this.obtenerProductos();
          },
          error: e => {
            Swal.fire({
              title: 'Error',
              text: 'El producto no existe en la BBDD o no se pudo eliminar.',
              icon: 'error',
              confirmButtonColor: '#a72b2b',
              confirmButtonText: 'Aceptar',
            });
            console.error("El producto no existe en la BBDD", e);
          }
        });
      }
    });
  }
}
