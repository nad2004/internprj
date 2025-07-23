import Book from '../models/Book.js';
import BookInstance from '../models/BookInstance.js';
export const getAllBooks = async (filter = {}, options = {}) => {
  const books = await Book.find(filter, null, options);
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
