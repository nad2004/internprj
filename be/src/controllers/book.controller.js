import { getAllBooks } from '../services/book.service.js';

export const getBooks = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
