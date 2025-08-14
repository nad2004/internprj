import * as bookService from '../services/book.service.js';
import { respondSuccess } from '../utils/respond.js';
const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
};
export const getBooks = async (req, res) => {
  try {
    const {
      // lọc
      search, // tìm theo title/subtitle/authors
      author, // lọc chính xác theo author (regex, không phân biệt hoa/thường)
      category, // 1 id (string)
      categories, // nhiều id: "id1,id2,id3"
      status, // 'available' | 'unavailable'
      minRating, // số (>=)
      createdFrom, // ISO date string
      createdTo, // ISO date string

      // phân trang + sort
      page = '1',
      limit = '20',
      sort = '-createdAt',
    } = req.query;

    const filter = {};

    // category: ObjectId[]
    if (categories) {
      const ids = categories
        .split(',')
        .map((x) => x.trim())
        .map(toObjectId)
        .filter(Boolean);
      if (ids.length) filter.categories = { $in: ids };
    } else if (category) {
      const oid = toObjectId(category);
      if (oid) filter.categories = { $in: [oid] };
    }

    // search theo title/subtitle/authors
    if (search) {
      const rx = new RegExp(search, 'i');
      filter.$or = [{ title: rx }, { subtitle: rx }, { authors: { $elemMatch: { $regex: rx } } }];
    }

    // lọc author riêng
    if (author) {
      const rx = new RegExp(author, 'i');
      filter.authors = { $elemMatch: { $regex: rx } };
    }

    // status
    if (status) filter.status = status;

    // rating
    if (minRating && !Number.isNaN(Number(minRating))) {
      filter.averageRating = { $gte: Number(minRating) };
    }

    // khoảng thời gian theo createdAt (Date)
    if (createdFrom || createdTo) {
      filter.createdAt = {};
      if (createdFrom) filter.createdAt.$gte = new Date(createdFrom);
      if (createdTo) filter.createdAt.$lte = new Date(createdTo);
    }

    const data = await bookService.getAllBooks(filter, {
      page: Number(page),
      limit: Number(limit),
      sort,
      populate: true,
      // có thể truyền select/other options tại đây
    });
    // Nếu có respondSuccess:
    return respondSuccess(res, { data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
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
    const { name, author, date, type, description, imageLinks } = req.body;
    console.log(imageLinks);
    const book = await bookService.createBookSimple({
      title: name,
      author,
      date,
      categories: type,
      description,
      cover: imageLinks,
    });
    res.status(201).json({ message: 'Book created', data: book });
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key', detail: e?.keyValue });
    }
    next(e);
  }
};
export const updateSimpleController = async (req, res, next) => {
  try {
    const { _id, slug, ...changes } = req.body;
    if (!_id && !slug) throw new Error('Cần id hoặc slug');

    const book = await bookService.updateBookSimple({ id: _id, slug, ...changes });
    res.json({ message: 'Book updated', data: book });
  } catch (e) {
    next(e);
  }
};
export const deleteSimpleController = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) throw new Error('Cần id');

    const book = await bookService.deleteBookSimple({ id });
    res.json({ message: 'Book deleted', data: book });
  } catch (e) {
    next(e);
  }
};
