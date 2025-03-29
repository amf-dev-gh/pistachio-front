import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../servicios/venta.service';
import { ConsultaVentaDto, VentaProducto } from '../../../interfaces/venta.interface';
import { CommonModule } from '@angular/common';
import { Producto } from '../../../interfaces/producto.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../../servicios/producto.service';
import { PdfService } from '../../../servicios/pdf.service';

@Component({
  selector: 'app-ventas',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit {

  ventas: VentaProducto[] = [];
  productos: Producto[] = [];
  filtroForm: FormGroup;
  fechaActual = new Date().toISOString().split('T')[0];

  constructor(private ventaService: VentaService, private productoService: ProductoService, private fb: FormBuilder, private pdfService: PdfService) {
    this.filtroForm = this.fb.group({
      idProducto: ['', Validators.required],
      fechaInicio: [''],
      fechaFin: [this.fechaActual, Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarVentas();
    this.listarProductos()
  }

  listarVentas() {
    this.ventaService.obtenerVentas().subscribe({
      next: v => this.ventas = v,
      error: e => console.error("Error al obtener ventas", e)
    })
  }

  listarProductos() {
    this.productoService.listarProductos().subscribe({
      next: prods => this.productos = prods.sort((a, b) => a.nombre.localeCompare(b.nombre)),
      error: e => console.error("Error al listar productos del campo sellect", e)
    })
  }

  filtrarVentas(): void {
    const consulta: ConsultaVentaDto = {
      idProducto: this.filtroForm.get('idProducto')?.value,
      fechaInicio: this.filtroForm.get('fechaInicio')?.value,
      fechaFin: this.filtroForm.get('fechaFin')?.value
    };
    if (consulta.fechaInicio) {
      console.log("filtrar por producto y fecha");
      this.listarVentaPorProductoYFecha(consulta);
    } else {
      console.log("filtrar por producto");
      this.listarVentasPorProducto(consulta.idProducto);
    }
  }

  listarVentaPorProductoYFecha(consulta: ConsultaVentaDto) {
    this.ventaService.obtenerVentasPorProductoYFecha(consulta).subscribe(
      {
        next: ventas => {
          this.ventas = ventas;
        },
        error: error => {
          console.error('Error al obtener ventas filtradas', error);
        }
      }
    );
  }

  listarVentasPorProducto(idProducto: number) {
    this.ventaService.obtenerVentasPorProducto(idProducto).subscribe(
      {
        next: ventas => {
          this.ventas = ventas;
        },
        error: error => {
          console.error('Error al obtener ventas filtradas', error);
        }
      }
    );
  }

  listarRanking() {
    this.ventaService.obtenerRankingDeVentas().subscribe({
      next: datos => {
        if (datos) {
          this.pdfService.generarPDF(datos);
          return;
        }
        alert("No hay productos vendidos para generar PDF")
      },
      error: e => console.error('Error al obtener RANKING', e)
    })
  }

  quitarFiltro() {
    this.filtroForm.reset();
    this.filtroForm.get('fechaFin')?.setValue(this.fechaActual);
    this.listarVentas();
  }
}
