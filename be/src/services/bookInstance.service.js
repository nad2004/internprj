import BookInstance from '../models/BookInstance.js';
import mongoose from 'mongoose';
export const createBookInstance = async (data = {}) => {
  const payload = { ...data };

  // Nếu frontend gửi "None" (string) thì chuyển về null
  if (
    payload.currentHolder === 'None' ||
    payload.currentHolder === '' ||
    payload.currentHolder === undefined
  ) {
    payload.currentHolder = null;
  } else if (typeof payload.currentHolder === 'string') {
    // (khuyến nghị) ép/cảnh báo ObjectId
    if (mongoose.Types.ObjectId.isValid(payload.currentHolder)) {
      payload.currentHolder = new mongoose.Types.ObjectId(payload.currentHolder);
    } else {
      throw new Error('currentHolder không hợp lệ');
    }
  }

  return await BookInstance.create(payload);
};

export const getAllBookInstances = async (filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    select = null,
    populate = true,
    collation = { locale: 'en', strength: 2 }, // sort không phân biệt hoa/thường
  } = options;
  const _page = Math.max(1, Number(page));
  const _limit = Math.max(1, Number(limit));
  const skip = (_page - 1) * _limit;

  const q = BookInstance.find(filter);
  if (select) q.select(select);
  if (populate) {
    q.populate('book_id') // thông tin sách
      .populate('currentHolder', 'username email'); // người đang giữ
  }

  // chạy song song: danh sách + tổng số
  const [items, total] = await Promise.all([
    q.sort(sort).skip(skip).limit(_limit).collation(collation).lean(),
    BookInstance.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      total,
      page: _page,
      limit: _limit,
      pages: Math.ceil(total / _limit) || 1,
    },
  };
};

export const getBookInstanceById = async (id) => {
  return await BookInstance.findById(id)
    .populate('book_id', 'title authors')
    .populate('currentHolder', 'username email');
};

export const updateBookInstance = async ({ id, changes } = {}) => {
  if (!id) throw new Error('Cần id');
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('id không hợp lệ');

  const payload = { ...changes };

  // Normalize currentHolder nếu được truyền vào
  if (Object.prototype.hasOwnProperty.call(payload, 'currentHolder')) {
    const v = payload.currentHolder;
    if (v === 'None' || v === '' || v === undefined || v === null) {
      payload.currentHolder = null;
    } else if (typeof v === 'string') {
      if (!mongoose.Types.ObjectId.isValid(v)) {
        throw new Error('currentHolder không hợp lệ');
      }
      payload.currentHolder = new mongoose.Types.ObjectId(v);
    }
  }

  const updated = await BookInstance.findByIdAndUpdate(
    id,
    { $set: payload }, // CHỈ set các field cần đổi
    { new: true, runValidators: true },
  ).populate([{ path: 'book_id' }, { path: 'currentHolder', select: 'username email' }]);

  return updated ? updated.toObject() : null;
};

export const deleteBookInstance = async ({ id } = {}) => {
  if (!id) throw new Error('Cần id');
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('id không hợp lệ');

  const current = await BookInstance.findById(id);
  if (!current) throw new Error('BookInstance not found');

  // Nếu đã unavailable thì trả về luôn sau khi populate
  if (current.status === 'unavailable') {
    await current.populate([
      { path: 'book_id', select: 'title authors' },
      { path: 'currentHolder', select: 'username email' },
    ]);
    return current.toObject();
  }

  // Soft delete
  const updated = await BookInstance.findByIdAndUpdate(
    id,
    { $set: { status: 'unavailable', deletedAt: new Date() } },
    { new: true, runValidators: true },
  );

  await updated.populate([
    { path: 'book_id', select: 'title authors' },
    { path: 'currentHolder', select: 'username email' },
  ]);

  return updated.toObject();
};
