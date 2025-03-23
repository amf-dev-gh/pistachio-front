import { Producto } from "./producto.interface";

export interface ItemPedido{
  producto: Producto,
  cantidad: number
}