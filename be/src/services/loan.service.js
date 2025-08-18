import Loan from '../models/Loan.js';
import BookInstance from '../models/BookInstance.js';
import mongoose from 'mongoose';
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
    status: 'reserve',
    pickupAt: null,
    pickupScheduledAt: null,
    cooldownUntil: null,
  });

  return {
    loan: loan.toObject(),
    instance: inst.toObject(),
  };
};

export const getAllLoans = (filter = {}) => {
  return Loan.find(filter)
    .populate({ path: 'userId', select: 'username email' })
    .populate({
      path: 'bookId', // BookInstance
      select: 'code status currentHolder book_id', // chọn field cần
      populate: {
        path: 'book_id', // bên trong BookInstance
        model: 'Book',
        select: 'title authors imageLinks', // field của Book
      },
    })
    .lean()
    .exec();
};

export const nextStep = async (loanId, { cooldownUntil = null } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(loanId)) throw new Error('loanId không hợp lệ');

  // lấy loan + instance
  let loan = await Loan.findById(loanId).populate('bookId').exec();
  if (!loan) throw new Error('Loan not found');

  const now = new Date();

  switch (loan.status) {
    case 'reserve': {
      // chuyển sang borrowed, set pickupAt
      // đảm bảo instance ở trạng thái borrowed & holder = user
      await BookInstance.findByIdAndUpdate(
        loan.bookId._id,
        { $set: { status: 'borrowed', currentHolder: loan.userId } },
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

/** Lấy chi tiết theo ID */
export const getLoanById = (id) => Loan.findById(id).populate('bookId').populate('userId').exec();

/** Cập nhật đơn (dueAt, status, v.v.) */
export const updateLoan = (id, data) => Loan.findByIdAndUpdate(id, data, { new: true }).exec();

/** Xóa đơn */
export const deleteLoan = (id) => Loan.findByIdAndDelete(id).exec();

/** Đánh dấu trả sách */
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

/** Admin: xác nhận cho mượn */
export const confirmLoan = (id) => updateLoan(id, { status: 'confirmed' });

/** Admin: bắt đầu giai đoạn cooldown (mặc định 3 ngày sau) */
export const startCooldown = (id, cooldownUntil = null) => {
  const until = cooldownUntil ? cooldownUntil : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  return updateLoan(id, {
    cooldownUntil: until,
    status: 'cooldown',
  });
};
