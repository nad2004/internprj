import mongoose from 'mongoose';
const { Schema } = mongoose;

const loanSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'BookInstance',
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
  pickupAt: {
    type: Date,
    default: null,
  },
  cooldownUntil: {
    type: Date,
    default: null,
  },
  description: {
    type: String,
    default: '',
  },
  rejectReason: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'reserve', 'borrowed', 'returned', 'overdue', 'cooldown', 'rejected'],
    default: 'pending',
  },
  pickupScheduledAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model('Loan', loanSchema);
