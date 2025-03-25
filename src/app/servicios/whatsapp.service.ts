import { Injectable } from '@angular/core';
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private numeroWhatsapPistachio: string = '5493515956333';

  constructor(private carritoService: CarritoService) { }

  enviarMensajeWhatsApp(nombre: String, numeroPedido: string): void {
    const items = this.carritoService.obtenerItemsCarrito();
    let mensaje = `🛒 Se ha generado el pedido nº: *${numeroPedido}* a nombre de ${nombre}:\n`;
    items.forEach(item => {
      mensaje += ` ✅ ${item.producto.nombre}-${item.producto.cantidad} (x${item.cantidad})\n`;
    });
    mensaje += `*Total: $${this.carritoService.obtenerMontoTotal()}*\n`;
    mensaje += `Efectue su pago y comparta su comprobante para gestionar su entrega. \n`
    mensaje += `✨ _¡Muchas gracias! *PISTACHIO*_ ✨`
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${this.numeroWhatsapPistachio}&text=${mensajeCodificado}`;

    window.open(urlWhatsApp, '_blank');
  }

}
