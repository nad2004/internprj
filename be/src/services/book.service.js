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
