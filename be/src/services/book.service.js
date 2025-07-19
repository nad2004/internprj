import Book from '../models/Book.js';

export const getAllBooks = async (filter = {}, options = {}) => {
  const books = await Book.find(filter, null, options);
  return books;
};
