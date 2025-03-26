import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemPedido } from '../interfaces/itemPedido.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private claveCarrito = 'carrito';
  private carrito = new BehaviorSubject<ItemPedido[]>(this.cargarCarritoDesdeStorage());
  carrito$ = this.carrito.asObservable();

  constructor() { }

  private cargarCarritoDesdeStorage(): ItemPedido[] {
    const carritoGuardado = localStorage.getItem(this.claveCarrito);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  private guardarCarritoEnStorage(): void {
    localStorage.setItem(this.claveCarrito, JSON.stringify(this.carrito.value));
  }

  agregarAlCarrito(item: ItemPedido): void {
    const carritoActual = this.carrito.value;
    const indice = carritoActual.findIndex(i => i.producto.id === item.producto.id);
  
    if (indice !== -1) {
      // Validar si al agregar la nueva cantidad supera el stock disponible
      const nuevaCantidad = carritoActual[indice].cantidad + item.cantidad;
      if (nuevaCantidad > item.producto.stock) {
        Swal.fire({
          title: 'Stock insuficiente',
          text: `Solo hay ${item.producto.stock} unidades disponibles de ${item.producto.nombre}.`,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
        return;
      }
      carritoActual[indice].cantidad = nuevaCantidad;
    } else {
      // Validar si la cantidad inicial supera el stock disponible
      if (item.cantidad > item.producto.stock) {
        Swal.fire({
          title: 'Stock insuficiente',
          text: `Solo hay ${item.producto.stock} unidades disponibles de ${item.producto.nombre}.`,
          icon: 'warning',
          confirmButtonText: 'Entendido'
        });
        return;
      }
      carritoActual.push(item);
    }
    this.carrito.next([...carritoActual]);
    this.guardarCarritoEnStorage();
    // Confirmación de producto agregado
    Swal.fire({
      title: '¡Producto agregado!',
      text: `${item.producto.nombre} ha sido agregado al carrito.`,
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  }
  

  eliminarDelCarrito(idProducto: number): void {
    const carritoActualizado = this.carrito.value.filter(item => item.producto.id !== idProducto);
    this.carrito.next(carritoActualizado);
    this.guardarCarritoEnStorage();
  }

  vaciarCarrito(): void {
    this.carrito.next([]);
    localStorage.removeItem(this.claveCarrito);
  }

  obtenerItemsCarrito(): ItemPedido[] {
    return this.carrito.value;
  }

  obtenerCantidadTotal(): number {
    return this.carrito.value.reduce((total, item) => total + item.cantidad, 0);
  }

  obtenerMontoTotal(): number {
    return this.carrito.value.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}