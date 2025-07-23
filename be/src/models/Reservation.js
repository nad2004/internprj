import mongoose from 'mongoose';
const { Schema } = mongoose;
const ReservationSchema = new mongoose.Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  status: {
    type: String,
    enum: ['Pending', 'ReadyForPickup', 'Fulfilled', 'Expired', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
  readyAt: { type: Date, default: null },
  pickupExpireAt: {
    type: Date,
    default: null,
  },
  fulfilledAt: {
    type: Date,
    default: null,
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  note: {
    type: String,
  },
});
export default mongoose.model('Reservation', ReservationSchema);
