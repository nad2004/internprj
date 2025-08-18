import type { Book } from './Books';
import type { BookInstance } from './BookInstance';

import type { User } from './User';
export type LoanStatus = 'reserve' | 'borrowed' | 'returned' | 'overdue' | 'cooldown';

export type BorrowPayload = {
  from: { d: string; m: string; y: string };
  to: { d: string; m: string; y: string };
  serial: string;
  description: string;
  userId: string;
  bookInstanceId: string;
};
export interface Loan {
  _id: string;
  borrowedAt: string;
  dueAt: string;
  status: LoanStatus;
  description?: string;
  bookId?: BookInstance;
  userId?: User;
}
