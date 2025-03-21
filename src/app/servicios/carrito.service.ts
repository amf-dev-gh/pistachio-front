import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemOrden } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private claveCarrito = 'carrito';
  private carrito = new BehaviorSubject<ItemOrden[]>(this.cargarCarritoDesdeStorage());
  carrito$ = this.carrito.asObservable();

  constructor() {}

  private cargarCarritoDesdeStorage(): ItemOrden[] {
    const carritoGuardado = localStorage.getItem(this.claveCarrito);
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  private guardarCarritoEnStorage(): void {
    localStorage.setItem(this.claveCarrito, JSON.stringify(this.carrito.value));
  }

  agregarAlCarrito(item: ItemOrden): void {
    const carritoActual = this.carrito.value;
    const indice = carritoActual.findIndex(i => i.producto.id === item.producto.id);

    if (indice !== -1) {
      // Si el producto ya está en el carrito solo actualiza la cantidad
      carritoActual[indice].cantidad += item.cantidad;
    } else {
      carritoActual.push(item);
    }

    this.carrito.next([...carritoActual]);
    this.guardarCarritoEnStorage();
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

  obtenerItemsCarrito(): ItemOrden[] {
    return this.carrito.value;
  }

  obtenerCantidadTotal(): number {
    return this.carrito.value.reduce((total, item) => total + item.cantidad, 0);
  }

  obtenerMontoTotal(): number {
    return this.carrito.value.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
  }
}