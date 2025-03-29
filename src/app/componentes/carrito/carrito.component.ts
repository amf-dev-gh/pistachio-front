import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { ItemPedido } from '../../interfaces/itemPedido.interface';
import { CommonModule } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhatsappService } from '../../servicios/whatsapp.service';
import { Router } from '@angular/router';
import { PedidoService } from '../../servicios/pedido.service';
import { PedidoDTO } from '../../interfaces/pedido.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  itemsCarrito: ItemPedido[] = [];
  total: number = 0
  formDatos: FormGroup;

  constructor(private carritoService: CarritoService, private whatsapService: WhatsappService, private router: Router, private pedidoService: PedidoService, private fb: FormBuilder) {
    this.formDatos = fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^3\d{9}$/)
      ]]
    });
    
  }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(() => {
      this.itemsCarrito = this.carritoService.obtenerItemsCarrito();
      this.total = this.carritoService.obtenerMontoTotal();
    })
  }

  vaciarCarrito() {
    Swal.fire({
      title: '¿Vaciar carrito?',
      text: 'Se eliminarán todos los productos del carrito. ¿Confirma?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00322B',
      cancelButtonColor: '#a72b2b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.vaciarCarrito();
        Swal.fire({
          title: '¡Carrito vaciado!',
          text: 'Todos los productos han sido eliminados.',
          icon: 'success',
          confirmButtonColor: '#00322B',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }

  eliminarDelCarro(producto: Producto) {
    Swal.fire({
      title: '¿Eliminar del carrito?',
      text: `Se eliminará ${producto.nombre} de tu lista. ¿Confirma?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#a72b2b',
      cancelButtonColor: '#00322B',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarDelCarrito(producto.id);
        Swal.fire({
          title: '¡Producto eliminado!',
          text: `${producto.nombre} ha sido eliminado del carrito.`,
          icon: 'success',
          confirmButtonColor: '#00322B',
          confirmButtonText: 'Aceptar',
        });
      }
    });
  }


  finalizarCompra() {
    if (this.formDatos.invalid) {
      console.error("Formulario inválido");
      return;
    }
  
    Swal.fire({
      title: '¿Confirmar pedido?',
      text: `Generará un pedido a nombre de ${this.formDatos.get("nombre")?.value} por un monto de $${this.carritoService.obtenerMontoTotal()}. ¿Son estos datos correctos?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#00322B',
      cancelButtonColor: '#a72b2b',
    }).then((result) => {
      if (result.isConfirmed) {
        const itemsCarrito = this.carritoService.obtenerItemsCarrito();
        const nuevoPedido: PedidoDTO = {
          items: itemsCarrito.map(item => ({
            productoId: item.producto.id,
            cantidad: item.cantidad
          })),
          usuario: {
            nombre: this.formDatos.get('nombre')?.value,
            apellido: this.formDatos.get('apellido')?.value,
            email: this.formDatos.get('email')?.value,
            telefono: this.formDatos.get('telefono')?.value
          }
        };
  
        this.pedidoService.crearPedido(nuevoPedido).subscribe({
          next: p => {
            this.whatsapService.enviarMensajeWhatsApp(this.formDatos.get("nombre")?.value, p.numeroPedido);
            this.carritoService.vaciarCarrito();
            this.router.navigate(['/inicio']);
            Swal.fire({
              title: '¡Pedido realizado!',
              text: `Tu pedido nº ${p.numeroPedido} ha sido generado con éxito.`,
              icon: 'success',
              confirmButtonColor: '#00322B',
              confirmButtonText: 'Aceptar',
            });
          },
          error: e => {
            console.error("Error al crear pedido", e);
            Swal.fire({
              title: 'Error',
              text: 'Hubo un problema al generar el pedido.',
              icon: 'error',
              confirmButtonColor: '#a72b2b',
              confirmButtonText: 'Aceptar',
            });
          }
        });
      }
    });
  }
}
