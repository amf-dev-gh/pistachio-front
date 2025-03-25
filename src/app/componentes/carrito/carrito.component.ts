import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { ItemPedido } from '../../interfaces/itemPedido.interface';
import { CommonModule } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhatsappService } from '../../servicios/whatsapp.service';
import { Router } from '@angular/router';
import { PedidoService } from '../../servicios/pedido.service';
import { PedidoDTO } from '../../interfaces/pedido.interface';

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
      email: ['', Validators.required],
      telefono: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(() => {
      this.itemsCarrito = this.carritoService.obtenerItemsCarrito();
      this.total = this.carritoService.obtenerMontoTotal();
    })
  }

  vaciarCarrito() {
    const vaciar = confirm("Se eliminaran todos los productos del carrito. ¿Confirma?");
    if (vaciar) {
      this.carritoService.vaciarCarrito();
    }
  }

  eliminarDelCarro(producto: Producto) {
    const eliminar = confirm(`Se eliminara ${producto.nombre} de tu lista. ¿Confirma?`);
    if (eliminar) {
      this.carritoService.eliminarDelCarrito(producto.id);
    }
  }

  finalizarCompra() {
    if (this.formDatos.invalid) {
      console.log("Formulario inválido")
      return;
    }
    const pedidoOK = confirm(`Generará un pedido a nombre de ${this.formDatos.get("nombre")?.value} por un monto de $${this.carritoService.obtenerMontoTotal()}. ¿Son estos datos correctos?`)
    const itemsCarrito = this.carritoService.obtenerItemsCarrito();
    if (pedidoOK) {
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
      console.log(nuevoPedido)
      this.pedidoService.crearPedido(nuevoPedido).subscribe({
        next: p => {
          console.log("pedido generado", p);
          this.whatsapService.enviarMensajeWhatsApp(this.formDatos.get("nombre")?.value);
          this.carritoService.vaciarCarrito();
          this.router.navigate(['/inicio']);
        },
        error: e => console.error("Error al crear pedido", e)
      })
    }
  }
}
