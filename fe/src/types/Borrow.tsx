import type { Book } from './Books';
import type { BookInstance } from './BookInstance';

import type { User } from './User';
export type LoanStatus =
  | 'pending'
  | 'reserve'
  | 'borrowed'
  | 'returned'
  | 'overdue'
  | 'cooldown'
  | 'rejected';

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
  rejectReason: string;
  dueAt: string;
  status: LoanStatus;
  description?: string;
  bookId?: BookInstance;
  userId?: User;
}
