import type { User } from "./User";
import type { Loan } from "./Borrow";
import type { Book } from "./Books";
import type { BookInstance } from "./BookInstance";
export type typeNotification = 'loan' | 'system';
export type typeAction = 'approved' | 'rejected';
export type resource = {
    id: Loan;
    bookId?: Book;
    bookInstanceId?: BookInstance;
    extra?: { reason: string }
};

export interface Notification {
  _id?: string;
  userId?: User;
  type?: typeNotification;
  action?: typeAction;
  title?: string;
  message?: string;
resource?: resource;
readAt?: Date | null; 
}
