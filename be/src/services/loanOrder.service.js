import LoanOrder from '../models/LoanOrder.js';

/** Tạo đơn mượn mới */
export const createLoanOrder = data =>
  new LoanOrder(data).save();

/** Lấy tất cả (có thể truyền filter) */
export const getAllLoanOrders = (filter = {}) =>
  LoanOrder.find(filter)
    .populate('bookId')
    .populate('userId')
    .exec();

/** Lấy chi tiết theo ID */
export const getLoanOrderById = id =>
  LoanOrder.findById(id)
    .populate('bookId')
    .populate('userId')
    .exec();

/** Cập nhật đơn (dueAt, status, v.v.) */
export const updateLoanOrder = (id, data) =>
  LoanOrder.findByIdAndUpdate(id, data, { new: true }).exec();

/** Xóa đơn */
export const deleteLoanOrder = id =>
  LoanOrder.findByIdAndDelete(id).exec();

/** Đánh dấu trả sách */
export const markReturned = async (id, returnedAt = new Date()) => {
  const loan = await getLoanOrderById(id);
  if (!loan) throw new Error('LoanOrder not found');
  const status = returnedAt > loan.dueAt ? 'overdue' : 'returned';
  return updateLoanOrder(id, { returnedAt, status });
};

/** Admin: xác nhận cho mượn */
export const confirmLoanOrder = id =>
  updateLoanOrder(id, { status: 'confirmed' });

/** Admin: bắt đầu giai đoạn cooldown (mặc định 3 ngày sau) */
export const startCooldown = (id, cooldownUntil = null) => {
  const until = cooldownUntil
    ? cooldownUntil
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  return updateLoanOrder(id, {
    cooldownUntil: until,
    status: 'cooldown'
  });
};
