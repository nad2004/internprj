import * as bookInstanceService from '../services/bookInstance.service.js';
import { respondSuccess } from '../utils/respond.js';
import Book from '../models/Book.js';

export const create = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.createBookInstance(req.body);
    respondSuccess(res, { data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const {
      // lọc
      search, // tìm theo code hoặc theo book.title / book.subtitle / book.authors
      code, // lọc theo code (regex, không phân biệt hoa/thường)

      // phân trang + sort
      page = '1',
      limit = '20',
      sort = '-createdAt',
    } = req.query;

    const filter = {};
    const ors = [];

    // code riêng
    if (code) {
      const rxCode = new RegExp(code, 'i');
      ors.push({ code: rxCode });
    }

    if (search) {
      const rx = new RegExp(search, 'i');

      // tìm theo code
      ors.push({ code: rx });

      // tìm theo Book liên kết (title/subtitle/authors)
      const bookIds = await Book.find({
        $or: [{ title: rx }, { subtitle: rx }, { authors: { $elemMatch: { $regex: rx } } }],
      })
        .select('_id')
        .lean();

      if (bookIds.length) {
        ors.push({ book_id: { $in: bookIds.map((b) => b._id) } });
      }
    }

    if (ors.length) filter.$or = ors;

    const data = await bookInstanceService.getAllBookInstances(filter, {
      page: Number(page),
      limit: Number(limit),
      sort,
      populate: true,
    });
    return respondSuccess(res, { data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.getBookInstanceById(req.params.id);
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const { _id, ...changes } = req.body;
    const bookInstance = await bookInstanceService.updateBookInstance({ id: _id, changes });
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error('Cần id');

    const book = await bookInstanceService.deleteBookInstance({ id });
    res.json({ message: 'Book deleted', data: book });
  } catch (e) {
    next(e);
  }
};
export const getAvailableByBook = async (req, res, next) => {
  try {
    const { bookId } = req.query;

    const inst = await bookInstanceService.getOneAvailableInstanceByBook(bookId);
    if (!inst) {
      return res.status(404).json({ success: false, message: 'No available copy' });
    }

    return respondSuccess(res, { data: inst });
  } catch (err) {
    next(err);
  }
};
