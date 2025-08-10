import mongoose from 'mongoose';
const { Schema } = mongoose;

const loanSchema = new Schema({
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
    enum: ['borrowed', 'returned', 'overdue', 'cooldown'],
    default: 'borrowed',
  },
  pickupScheduledAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model('Loan', loanSchema);
