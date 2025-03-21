import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { ItemOrden } from '../../interfaces/item.interface';
import { CommonModule } from '@angular/common';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  itemsCarrito:ItemOrden[] = [];
  total:number = 0

  constructor(private carritoService:CarritoService){}

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

}
