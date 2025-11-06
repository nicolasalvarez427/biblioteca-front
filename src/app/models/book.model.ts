export interface Book {
  _id: string;
  titulo: string;
  autor: string;
  isbn?: string;
  disponible: boolean;
  imagenUrl?: string;
  stock?: number; // <-- Nuevo campo opcional (por si algún libro antiguo no lo tiene aún)
}