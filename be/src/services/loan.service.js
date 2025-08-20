import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import BookInstance from '../models/BookInstance.js';
import mongoose from 'mongoose';
const isObjectId = (s) => !!s && mongoose.Types.ObjectId.isValid(s);
import { notifyLoanApproved, notifyLoanRejected } from './notification.service.js';
export async function approveLoan({ id }) {
  // ví dụ: pending -> reserve
  const loan = await Loan.findOneAndUpdate(
    { _id: id, status: 'pending' },
    { $set: { status: 'reserve' } },
    { new: true, runValidators: true }
  );
  await loan.save();
  if (!loan) throw new Error('Loan is not approvable');

  const bookInstance = await BookInstance.findById(loan.bookId).lean();
  const book = bookInstance ? await Book.findById(bookInstance.book_id).lean() : null;
  
  // tạo notify
  await notifyLoanApproved({ loan, book, bookInstance });
  return loan;
}
export async function handleRejectLoan({ id, reason }) {
  const loan = await Loan.findOneAndUpdate(
    { _id: id, status: { $in: ['pending','reserve'] } },
    { $set: { status: 'rejected', rejectReason: reason} },
    { new: true, runValidators: true }
  );
  if (!loan) throw new Error('Loan is not rejectable');
  await loan.save();
  const bookInstance = await BookInstance.findById(loan.bookId).lean();
  const book = bookInstance ? await Book.findById(bookInstance.book_id).lean() : null;

  await notifyLoanRejected({ loan, book, bookInstance, reason });
  return loan;
}
const populateLoan = (q) =>
  q.populate({ path: 'userId', select: 'username email' }).populate({
    path: 'bookId', // BookInstance
    select: 'code status currentHolder book_id',
    populate: { path: 'book_id', select: 'title authors imageLinks' }, // Book
  });
export const createLoan = async ({
  userId,
  bookInstanceId,
  code,
  borrowedAt,
  dueAt,
  description,
}) => {
  if (!userId || !borrowedAt || !dueAt) throw new Error('Thiếu dữ liệu');
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('userId không hợp lệ');
  if (new Date(dueAt) <= new Date(borrowedAt)) throw new Error('dueAt phải > borrowedAt');

  const userOid = new mongoose.Types.ObjectId(userId);

  let match = { status: 'available' };
  if (bookInstanceId) {
    if (!mongoose.Types.ObjectId.isValid(bookInstanceId))
      throw new Error('bookInstanceId không hợp lệ');
    match._id = new mongoose.Types.ObjectId(bookInstanceId);
  } else if (code) {
    match.code = String(code).trim(); // hoặc toUpperCase() nếu cần
  } else {
    throw new Error('Cần bookInstanceId hoặc code');
  }

  const inst = await BookInstance.findOneAndUpdate(
    match,
    { $set: { status: 'borrowed', currentHolder: userOid } }, // cast holder chuẩn
    { new: true, runValidators: true },
  );
  if (!inst) throw new Error('Không còn bản sao available hoặc id/code sai');

  const loan = await Loan.create({
    bookId: inst._id,
    userId: userOid,
    borrowedAt: new Date(borrowedAt),
    dueAt: new Date(dueAt),
    description: description || '',
    status: 'pending',
    pickupAt: null,
    pickupScheduledAt: null,
    cooldownUntil: null,
  });

  return {
    loan: loan.toObject(),
    instance: inst.toObject(),
  };
};
export const getAllLoans = async (filter = {}) => {
  const { q, userId, bookId, status, ...rest } = filter || {};

  // filter cơ bản (không gồm q)
  const match = { ...rest };
  if (isObjectId(userId)) match.userId = new mongoose.Types.ObjectId(userId);
  if (isObjectId(bookId)) match.bookId = new mongoose.Types.ObjectId(bookId);
  if (status) match.status = status;

  const pipeline = [
    { $match: match },

    // Loan.bookId -> BookInstance
    { $lookup: { from: 'bookinstances', localField: 'bookId', foreignField: '_id', as: 'bookInstance' } },
    { $unwind: { path: '$bookInstance', preserveNullAndEmptyArrays: true } },

    // BookInstance.book_id -> Book
    { $lookup: { from: 'books', localField: 'bookInstance.book_id', foreignField: '_id', as: 'book' } },
    { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },

    // Loan.userId -> User
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
  ];
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // q: nếu có và không rỗng thì search theo các field liên quan
  if (q !== undefined) {
    const text = String(q).trim();
    if (text) {
      const re = new RegExp(text, 'i');
       const reExact = new RegExp(`^${escapeRegExp(text)}$`, 'i'); 
      pipeline.push({
        $match: {
          $or: [
            { 'user.username': reExact },
            { 'book.title': re },
            { 'bookInstance.code': re },
            { status: re },
          ],
        },
      });
    }
    // nếu q rỗng -> bỏ qua, dùng match cơ bản
  }

  // Shape kết quả gần giống populate cũ
  pipeline.push({
    $project: {
      _id: 1,
      status: 1,
      borrowedAt: 1,
      dueAt: 1,
      description: 1,
      userId: {
        _id: '$user._id',
        username: '$user.username',
        email: '$user.email',
      },
      bookId: {
        _id: '$bookInstance._id',
        code: '$bookInstance.code',
        status: '$bookInstance.status',
        currentHolder: '$bookInstance.currentHolder',
        book_id: {
          _id: '$book._id',
          title: '$book.title',
          authors: '$book.authors',
          imageLinks: '$book.imageLinks',
          slug: '$book.slug',
        },
      },
    },
  });

  return await Loan.aggregate(pipeline).exec();
};

export const nextStep = async (loanId, { cooldownUntil = null } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(loanId)) throw new Error('loanId không hợp lệ');

  // lấy loan + instance
  let loan = await Loan.findById(loanId).populate('bookId').exec();
  if (!loan) throw new Error('Loan not found');

  const now = new Date();

  switch (loan.status) {
 case 'pending': {
      approveLoan({ id: loan._id });
      break;
    }

    case 'reserve': {
      // chuyển sang borrowed, set pickupAt
      // đảm bảo instance ở trạng thái borrowed & holder = user
      await BookInstance.findByIdAndUpdate(
        loan.bookId._id,
        { $set: { status: 'borrowed', currentHolder: loan.userId, pickupAt: Date.now() } },
        { new: true, runValidators: true },
      );
      loan.status = 'borrowed';
      loan.pickupAt = now;
      await loan.save();
      break;
    }

    case 'borrowed': {
      // nếu đã quá hạn -> chuyển overdue, ngược lại không làm gì
      if (now > loan.dueAt) {
        loan.status = 'overdue';
        await loan.save();
      }
      break;
    }

    case 'overdue': {
      // bắt đầu cooldown
      const until = cooldownUntil
        ? new Date(cooldownUntil)
        : new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      loan.status = 'cooldown';
      loan.cooldownUntil = until;
      await loan.save();
      break;
    }

    default:
      // returned / cooldown: không có bước tiếp
      throw new Error('Trạng thái hiện tại không có bước tiếp theo');
  }

  // trả về loan đã populate đầy đủ
  return await populateLoan(Loan.findById(loan._id)).lean().exec();
};

export const getLoanById = (id) => Loan.findById(id).populate('bookId').populate('userId').exec();

export const deleteLoan = (id) => Loan.findByIdAndDelete(id).exec();

export const markReturned = async (loanId, returnedAt = new Date()) => {
  if (!mongoose.Types.ObjectId.isValid(loanId)) throw new Error('loanId không hợp lệ');

  const loan = await Loan.findById(loanId).populate('bookId').exec();
  if (!loan) throw new Error('Loan not found');

  // reset instance
  await BookInstance.findByIdAndUpdate(
    loan.bookId._id,
    { $set: { status: 'available', currentHolder: null } },
    { new: true, runValidators: true },
  );

  // cập nhật loan
  loan.returnedAt = returnedAt;
  loan.status = 'returned';
  await loan.save();

  return await populateLoan(Loan.findById(loan._id)).lean().exec();
};
export const rejectLoan = async (loanId, reason) => {
  if (!mongoose.Types.ObjectId.isValid(loanId)) throw new Error('loanId không hợp lệ');
  return await handleRejectLoan({ id: loanId, reason });
};
export const startCooldown = (id, cooldownUntil = null) => {
  const until = cooldownUntil ? cooldownUntil : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  return updateLoan(id, {
    cooldownUntil: until,
    status: 'cooldown',
  });
};
