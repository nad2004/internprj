import mongoose from 'mongoose';
const { Schema } = mongoose;

const loanOrderSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  borrowedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dueAt: {
    type: Date,
    required: true,
  },
  returnedAt: {
    type: Date,
    default: null,
  },
  pickupScheduledAt: {
    type: Date,
    default: null,
  },
  cooldownUntil: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['requested', 'waiting_pickup', 'borrowed', 'returned', 'overdue', 'cooldown'],
    default: 'requested',
  },
});

export default mongoose.model('LoanOrder', loanOrderSchema);
