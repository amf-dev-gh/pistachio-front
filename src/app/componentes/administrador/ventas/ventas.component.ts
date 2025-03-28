import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../servicios/venta.service';
import { ConsultaVentaDto, VentaProducto } from '../../../interfaces/venta.interface';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../interfaces/producto.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../servicios/producto.service';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {

  ventas:VentaProducto[] = [];
  productos:Producto[] = [];
  filtroForm: FormGroup;

  constructor(private ventaService:VentaService,private productoService: ProductoService, private fb: FormBuilder){
    this.filtroForm = this.fb.group({
      idProducto: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarVentas();
    this.listarProductos()
  }

  listarVentas(){
    this.ventaService.obtenerVentas().subscribe({
      next: v => this.ventas = v,
      error: e => console.error("Error al obtener ventas", e)
    })
  }

  listarProductos(){
    this.productoService.listarProductos().subscribe({
      next: prods => this.productos = prods,
      error: e => console.error("Error al listar productos del campo sellect", e)
    })
  }

    filtrarVentas(): void {
      const consulta:ConsultaVentaDto = {
        idProducto: this.filtroForm.get('idProducto')?.value,
        fehchaInicio: this.filtroForm.get('fechaInicio')?.value,
        fechaFin: this.filtroForm.get('fechaFin')?.value
      };
      console.log(consulta)
      // this.ventaService.obtenerVentasPorProductoYFecha(consulta).subscribe(
      //   ventas => {
      //     this.ventas = ventas;
      //   },
      //   error => {
      //     console.error('Error al obtener ventas filtradas', error);
      //   }
      // );
    }
  
    // Quitar el filtro y mostrar todas las ventas
    quitarFiltro() {
      this.filtroForm.reset();
      this.listarVentas();
    }
}
