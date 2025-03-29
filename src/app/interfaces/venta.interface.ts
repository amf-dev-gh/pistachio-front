import { Producto } from "./producto.interface"

export interface VentaProducto {
  id: number,
  producto: Producto,
  cantidadVendida: number,
  fechaVenta: string
}

export interface ConsultaVentaDto {
  idProducto: number,
  fechaInicio: string,
  fechaFin: string
}

export interface VentaResponseDto {
  nombreProducto: string,
  cantidad: number
}