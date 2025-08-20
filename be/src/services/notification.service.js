// services/notification.service.js
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';
const TTL_DAYS = 30;
const ttl = () => new Date(Date.now() + TTL_DAYS*24*60*60*1000);
const isObjectId = (s) => !!s && mongoose.Types.ObjectId.isValid(s);
export async function getAllNotifyByUser({ userId }) {
  if (!isObjectId(userId)) throw new Error('Invalid userId');

  // helper để reuse populate
  const populateAll = (q) =>
    q
      .populate({ path: 'userId', select: 'username email' })
      .populate({ path: 'resource.id', model: 'Loan', select: 'status pickupBy dueAt rejectedAt createdAt' })
      .populate({
        path: 'resource.bookInstanceId',
        model: 'BookInstance',
        select: 'code status currentHolder book_id',
        populate: { path: 'book_id', model: 'Book', select: 'title authors imageLinks slug' },
      })
      .populate({ path: 'resource.bookId', model: 'Book', select: 'title authors imageLinks slug' })
      .lean({ virtuals: true })
      .exec();

  const [unread, read, total] = await Promise.all([
    // Unread trước, sort theo createdAt ↓
    populateAll(
      Notification.find({ userId, readAt: null }).sort({ createdAt: -1 })
    ),
    // Read sau, sort theo createdAt ↓
    populateAll(
      Notification.find({ userId, readAt: { $ne: null } }).sort({ createdAt: -1 })
    ),
    // Tổng CHƯA đọc
    Notification.countDocuments({ userId, readAt: null }),
  ]);

  const data = [...unread, ...read];
  return { data, total }; // total = số chưa đọc
}

export async function notifyLoanApproved({ loan, book, bookInstance }) {
  const title = 'Yêu cầu mượn sách đã được duyệt';
  const msg = `“${book?.title || 'Sách'}”${bookInstance?.code ? ` (${bookInstance.code})` : ''} đã được chấp nhận.`;
  return Notification.create({
    userId: loan.userId,
    type: 'loan',
    action: 'approved',
    title, message: msg,
    resource: {
      id: loan._id,
      bookId: book?._id,
      bookInstanceId: bookInstance?._id,
    },
    expiresAt: ttl(),
  });
}

export async function notifyLoanRejected({ loan, book, bookInstance, reason }) {
  const title = 'Yêu cầu mượn sách bị từ chối';
  const msg = `“${book?.title || 'Sách'}”${bookInstance?.code ? ` (${bookInstance.code})` : ''} đã bị từ chối.${reason ? ` Lý do: ${reason}` : ''}`;
  return Notification.create({
    userId: loan.userId,
    type: 'loan',
    action: 'rejected',
    title, message: msg,
    resource: {
      id: loan._id,
      bookId: book?._id,
      bookInstanceId: bookInstance?._id,
      extra: { reason }
    },
    expiresAt: ttl(),
  });
}
export async function markRead({ id, userId }) {
  return Notification.findOneAndUpdate(
    { _id: id, userId },           // CHỐT QUYỀN: chỉ chủ sở hữu
    { $set: { readAt: new Date() } },
    { new: true }
  );
}

export async function markAllRead({ userId, before = new Date() }) {
  await Notification.updateMany(
    { userId, readAt: { $exists: false }, createdAt: { $lte: before } },
    { $set: { readAt: new Date() } }
  );
}