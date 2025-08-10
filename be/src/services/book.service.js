import Book from '../models/Book.js';
import BookInstance from '../models/BookInstance.js';
import redisClient from '../utils/redis.js';
export const getAllBooks = async (filter = {}, options = {}) => {
  const books = await Book.find(filter, null, options).populate('categories', 'name').lean();
  return books;
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
export async function createBookSimple({ title, author, date, categories, description }) {
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
    pageCount: 0,
    categories: [categories], // nhận 1 id string -> đưa vào mảng
    averageRating: undefined,
    ratingsCount: undefined,
    language: '',
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
