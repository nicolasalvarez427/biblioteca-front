export interface Book {
  _id: string;
  titulo: string;
  autor: string;
  isbn?: string;
  disponible: boolean;
  imagenUrl?: string; // <-- Nuevo campo para la URL de la imagen
}