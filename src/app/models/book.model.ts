export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  available: boolean;
  // Agrega más campos según tu backend
}