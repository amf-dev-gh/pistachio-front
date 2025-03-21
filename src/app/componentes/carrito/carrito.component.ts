import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { ItemOrden } from '../../interfaces/item.interface';
import { CommonModule } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WhatsappService } from '../../servicios/whatsapp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  itemsCarrito:ItemOrden[] = [];
  total:number = 0
  nombreCompleto = new FormControl('', [Validators.required, Validators.pattern(`^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9]+(?:\\s+[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9]+){1,4}$`)]);

  constructor(private carritoService:CarritoService, private whatsapService:WhatsappService, private router:Router){}

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(()=>{
      this.itemsCarrito = this.carritoService.obtenerItemsCarrito();
      this.total = this.carritoService.obtenerMontoTotal();
    })
  }

  vaciarCarrito(){
    const vaciar = confirm("Se eliminaran todos los productos del carrito. ¿Confirma?");
    if(vaciar){
      this.carritoService.vaciarCarrito();
    }
  }

  eliminarDelCarro(producto:Producto){
    const eliminar = confirm(`Se eliminara ${producto.nombre} de tu lista. ¿Confirma?`);
    if(eliminar){
      this.carritoService.eliminarDelCarrito(producto.id);
    }
  }

  finalizarCompra(){
    const nombre = this.nombreCompleto.value || '';
    if(nombre === ''){
      console.log("No ha ingresado el nombre")
      return;
    }
    const pedidoOK = confirm(`Generará un pedido a nombre de ${nombre} por un monto de $${this.carritoService.obtenerMontoTotal()}. ¿Son estos datos correctos?`)
    if(pedidoOK){
      this.whatsapService.enviarMensajeWhatsApp(nombre);
      this.carritoService.vaciarCarrito();
      this.router.navigate(['/inicio']);
    }
  }
}
