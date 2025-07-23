import Loan from '../models/Loan.js';

/** Tạo đơn mượn mới */
export const createLoan = (data) => new Loan(data).save();

/** Lấy tất cả (có thể truyền filter) */
export const getAllLoans = (filter = {}) =>
  Loan.find(filter).populate('bookId').populate('userId').exec();

/** Lấy chi tiết theo ID */
export const getLoanById = (id) => Loan.findById(id).populate('bookId').populate('userId').exec();

/** Cập nhật đơn (dueAt, status, v.v.) */
export const updateLoan = (id, data) => Loan.findByIdAndUpdate(id, data, { new: true }).exec();

/** Xóa đơn */
export const deleteLoan = (id) => Loan.findByIdAndDelete(id).exec();

/** Đánh dấu trả sách */
export const markReturned = async (id, returnedAt = new Date()) => {
  const loan = await getLoanById(id);
  if (!loan) throw new Error('Loan not found');
  const status = returnedAt > loan.dueAt ? 'overdue' : 'returned';
  return updateLoan(id, { returnedAt, status });
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
