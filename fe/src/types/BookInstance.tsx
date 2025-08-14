import type { Book } from './Books';
import type { User } from './User';
export const BookInstanceStatus = [
  'available',
  'borrowed',
  'reserved',
  'lost',
  'damaged',
  'unavailable',
];
export interface BookInstance {
  _id?: string;
  book_id?: Book;
  code?: string;
  status?: string;
  currentHolder?: User;
}
export interface BookInstanceInput {
  _id?: string;
  book_id: string;
  code: string;
  status: string;
  currentHolder?: string;
}
