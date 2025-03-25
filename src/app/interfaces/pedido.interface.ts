import { ItemPedido } from "./itemPedido.interface";
import { UsuarioDto } from "./usuario.interface";

export interface Pedido {
  id: number | null,
  numeroPedido: string,
  usuario: UsuarioDto,
  items: ItemPedido[],
  total: number,
  estado: string
}

export interface PedidoDTO {
  usuario: UsuarioDto;
  items: { productoId: number; cantidad: number }[];
}