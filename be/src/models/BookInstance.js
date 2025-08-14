import mongoose from 'mongoose';
const { Schema } = mongoose;
const BookInstanceSchema = new mongoose.Schema({
  book_id: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'reserved', 'lost', 'damaged', 'unavailable'],
    default: 'available',
  },
  currentHolder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('BookInstance', BookInstanceSchema);
