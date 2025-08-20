import Book from '../models/Book.js';
import BookInstance from '../models/BookInstance.js';
import redisClient from '../utils/redis.js';
import mongoose from 'mongoose';
export const getAllBooks = async (filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = '-createdAt',
    select = null,
    populate = true,
    collation = { locale: 'en', strength: 2 }, // sort chữ cái không phân biệt hoa/thường
  } = options;
  const _page = Math.max(1, Number(page));
  const _limit = Math.max(1, Number(limit));
  const skip = (_page - 1) * _limit;

  const q = Book.find(filter);
  if (select) q.select(select);
  if (populate) q.populate('categories', 'name');

  // chạy song song: danh sách + tổng số
  const [items, total] = await Promise.all([
    q.sort(sort).skip(skip).limit(_limit).collation(collation).lean(),
    Book.countDocuments(filter),
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
export const getBookBySlug = async (slug) => {
  return await Book.findOne({ slug }).populate('categories', 'name').lean();
};
export const getBookStats = async (bookId) => {
  const total = await BookInstance.countDocuments({ book_id: bookId });
  const available = await BookInstance.countDocuments({
    book_id: bookId,
    status: 'available',
  });
  return { total, available };
};
export const getBookTrending = async () => {
  const cacheKey = 'trending_books';
  const cachedBooks = await redisClient.get(cacheKey);
  if (cachedBooks) {
    return JSON.parse(cachedBooks);
  }

  const books = await Book.find({})
    .sort({ borrowedCount: -1 })
    .limit(4)
    .populate('categories', 'name')
    .lean();
  await redisClient.set(cacheKey, JSON.stringify(books), { EX: 3600 });
  return books;
};
export async function createBookSimple({ title, author, date, categories, description, cover }) {
  if (!title?.trim()) throw new Error('title is required');
  if (!author?.trim()) throw new Error('author is required');
  if (!categories?.trim()) throw new Error('category id is required');

  // validate ObjectId cho category id
  if (!mongoose.Types.ObjectId.isValid(categories)) {
    throw new Error('category id is not a valid ObjectId');
  }

  // Chuẩn hoá ngày → string YYYY-MM-DD (nếu parse được), nếu không thì giữ nguyên
  let publishedDate = (date || '').trim();
  if (publishedDate) {
    const parsed = new Date(publishedDate);
    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getFullYear();
      const m = String(parsed.getMonth() + 1).padStart(2, '0');
      const d = String(parsed.getDate()).padStart(2, '0');
      publishedDate = `${y}-${m}-${d}`;
    }
  }

  // Tạo book (slug sẽ do pre('validate') trong model tự sinh)
  const created = await Book.create({
    title: title.trim(),
    subtitle: '',
    authors: [author.trim()], // model của bạn dùng mảng authors
    publisher: '',
    publishedDate, // string
    description: description || '',
    isbn10: '',
    isbn13: '',
    imageLinks: {
      smallThumbnail: cover,
      thumbnail: cover,
    },
    pageCount: 0,
    categories: [categories], // nhận 1 id string -> đưa vào mảng
    averageRating: undefined,
    ratingsCount: undefined,
    language: 'en',
    previewLink: '',
    infoLink: '',
    canonicalVolumeLink: '',
    status: 'available',
    quantity: 0,
    createdBy: 'admin',
  });

  // Trả về kèm populate tên category cho tiện hiển thị
  const result = await Book.findById(created._id).populate('categories', 'name').lean();

  return result;
}
// thêm mới
export async function updateBookSimple(payload = {}) {
  const {
    id, // ưu tiên id
    slug, // hoặc slug
    name, // => title
    author, // => authors[0]
    date, // => publishedDate (YYYY-MM-DD)
    type, // => categories[0]
    description, // => description
    imageLinks, // string url hoặc object
  } = payload;

  if (!id && !slug) throw new Error('id hoặc slug là bắt buộc');

  const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : slug ? { slug } : { _id: id }; // fallback

  // chỉ set những trường có mặt trong payload
  const $set = {};

  if (Object.prototype.hasOwnProperty.call(payload, 'name')) {
    const v = (name || '').trim();
    if (!v) throw new Error('name không được rỗng');
    $set.title = v;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'author')) {
    const v = (author || '').trim();
    $set.authors = v ? [v] : [];
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'date')) {
    let publishedDate = (date || '').trim();
    if (publishedDate) {
      const t = new Date(publishedDate);
      if (!Number.isNaN(t.getTime())) {
        const y = t.getFullYear();
        const m = String(t.getMonth() + 1).padStart(2, '0');
        const d = String(t.getDate()).padStart(2, '0');
        publishedDate = `${y}-${m}-${d}`;
      }
    }
    $set.publishedDate = publishedDate;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'type')) {
    const cateId = String(type || '').trim();
    if (!mongoose.Types.ObjectId.isValid(cateId)) {
      throw new Error('category id không hợp lệ');
    }
    $set.categories = [cateId];
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'description')) {
    $set.description = description || '';
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'imageLinks')) {
    if (typeof imageLinks === 'string') {
      $set.imageLinks = {
        smallThumbnail: imageLinks,
        thumbnail: imageLinks,
      };
    } else if (imageLinks && typeof imageLinks === 'object') {
      // cho phép truyền thẳng object nếu đã đúng shape
      $set.imageLinks = imageLinks;
    } else {
      $set.imageLinks = undefined;
    }
  }

  if (!Object.keys($set).length) {
    // không có gì để sửa -> trả bản ghi hiện tại
    const current = await Book.findOne(filter).populate('categories', 'name');
    if (!current) throw new Error('Book not found');
    return current.toObject();
  }

  const updated = await Book.findOneAndUpdate(filter, { $set }, { new: true, runValidators: true });

  if (!updated) throw new Error('Book not found');

  await updated.populate('categories', 'name');
  return updated.toObject();
}
export async function deleteBookSimple({ id } = {}) {
    if (!id) throw new Error('Cần id');
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('id không hợp lệ');

  const now = new Date();

  // Tìm current
  const current = await Book.findById(id);
  if (!current) throw new Error('Book not found');

  // Helper: cập nhật toàn bộ instance về unavailable
  const syncInstances = async () => {
    await BookInstance.updateMany(
      { $or: [{ bookId: id }, { book_id: id }], status: { $ne: 'unavailable' } },
      { $set: { status: 'unavailable', deletedAt: now } },
      { runValidators: true }
    );
  };

  if (current.status === 'unavailable') {
    // Sách đã unavailable: vẫn đảm bảo instance được sync
    await syncInstances();
    await current.populate('categories', 'name');
    return current.toObject();
  }

  // Soft delete Book
  const updated = await Book.findByIdAndUpdate(
    id,
    { $set: { status: 'unavailable', deletedAt: now } },
    { new: true, runValidators: true }
  );

  // Sync BookInstance
  await syncInstances();

  await updated.populate('categories', 'name');
  return updated.toObject();
}
