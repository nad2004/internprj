import * as bookService from '../services/book.service.js';
import { respondSuccess } from '../utils/respond.js';
export const getBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    respondSuccess(res, { data: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getBookDetailWithStatsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const book = await bookService.getBookBySlug(slug);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    const stats = await bookService.getBookStats(book._id);
    respondSuccess(res, { data: { ...book, stats } });
  } catch (err) {
    next(err);
  }
};
export const getBookTrending = async (req, res) => {
  try {
    const books = await bookService.getBookTrending();
    respondSuccess(res, { data: books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
