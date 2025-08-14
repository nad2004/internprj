export interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
}
export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt: string;
  createdBy: string;
}
export interface GoogleItem {
  id: string;
  title: string;
  author: string;
  date: string;
  description: string;
  category?: string;
  thumbnail: string;
}
export type BookStatus = 'available' | 'unavailable';
export interface UpdateBookInput {
  _id?: string;
  name?: string;
  author?: string;
  type?: string;
  date?: string;
  imageLinks?: string;
  description?: string;
}
export interface Book {
  _id?: string;
  googleId?: string;
  title: string;
  subtitle?: string;
  slug: string;

  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;

  isbn10?: string;
  isbn13?: string;
  pageCount?: number;

  categories?: Category[];
  averageRating?: number;
  ratingsCount?: number;

  imageLinks?: ImageLinks;
  language?: string;

  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;

  status?: BookStatus;
  quantity?: number;

  createdBy?: string;
  createdAt?: string;
}
