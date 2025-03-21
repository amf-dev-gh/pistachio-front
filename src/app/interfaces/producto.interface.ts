import { Categoria } from "./categoria.interface";

export interface Producto {
  id: number,
  nombre: string,
  categoria: Categoria,
  descripcion: string,
  cantidad: string,
  precio: number,
  urlImagen: string
  destacado: boolean
  stock: number,
}
