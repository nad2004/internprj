import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true, required: true },

    type: { type: String, enum: ['loan', 'system'], required: true },
    action: { type: String, enum: ['approved', 'rejected'] },

    title: String,
    message: String,

    resource: {
      kind: String, // 'Loan'
      id: { type: Schema.Types.ObjectId }, // loanId
      bookId: { type: Schema.Types.ObjectId },
      bookInstanceId: { type: Schema.Types.ObjectId },
      extra: Schema.Types.Mixed,
    },

    readAt: Date,
    expiresAt: Date, // TTL optional (vd auto xoá sau 30 ngày)
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL theo expiresAt

export default mongoose.model('Notification', notificationSchema);
