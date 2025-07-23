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

export type BookStatus = 'available' | 'unavailable';

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
