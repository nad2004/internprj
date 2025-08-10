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
export const createSimpleController = async (req, res, next) => {
  try {
    const { title, author, date, categories, description } = req.body;
    const book = await bookService.createBookSimple({
      title,
      author,
      date,
      categories,
      description,
    });
    res.status(201).json({ message: 'Book created', data: book });
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key', detail: e?.keyValue });
    }
    next(e);
  }
};
