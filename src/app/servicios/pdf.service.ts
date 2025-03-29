import { Injectable } from '@angular/core';
import { VentaResponseDto } from '../interfaces/venta.interface';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generarPDF(ventas: VentaResponseDto[]) {
    const doc = new jsPDF();

    const logoUrl = '/logo-pistachio.png'; // URL del logo

    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      doc.addImage(img, 'PNG', 15, 11, 20, 20); // (imagen, tipo, x, y, ancho, alto)

      // Agregar título y fecha
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text('PISTACHIO - Ranking de Ventas', 80, 20);

      const fechaActual = new Date().toLocaleDateString('es-ES');
      doc.setFontSize(9);
      doc.text(`Fecha: ${fechaActual}`, 80, 30);

      // Agregar tabla con productos y cantidades
      const encabezados = [['Producto', 'Cantidad']];
      const datos = ventas.map(v => [v.nombreProducto, v.cantidad]);

      autoTable(doc, {
        head: encabezados,
        body: datos,
        startY: 40,
        columnStyles: {
          // Centrar la columna "Cantidad" (índice 1)
          1: { halign: 'center' }, // Centra los datos en la columna "Cantidad"
        }
      });

      // Agregar pie de página
      const pieTexto = 'PISTACHIO - Tu mix natural ';
      doc.setFontSize(10);
      doc.text(pieTexto, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });

      // Guardar PDF
      doc.save('Ranking_Ventas.pdf');
    };
  }
}