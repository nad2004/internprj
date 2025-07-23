import * as bookInstanceService from '../services/bookInstance.service.js';
import { respondSuccess } from '../utils/respond.js';
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
    const bookInstances = await bookInstanceService.getBookInstances();
    respondSuccess(res, { data: bookInstances });
  } catch (err) {
    next(err);
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
    const bookInstance = await bookInstanceService.updateBookInstance(req.params.id, req.body);
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.deleteBookInstance(req.params.id);
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    respondSuccess(res, { message: 'Book instance deleted successfully' });
  } catch (err) {
    next(err);
  }
};
