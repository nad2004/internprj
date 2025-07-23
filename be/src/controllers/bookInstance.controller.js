import * as bookInstanceService from '../services/bookInstance.service.js';

export const create = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.createBookInstance(req.body);
    res.status(201).json({ success: true, data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const bookInstances = await bookInstanceService.getBookInstances();
    res.json({ success: true, data: bookInstances });
  } catch (err) {
    next(err);
  }
};

export const getById = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.getBookInstanceById(req.params.id);
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.updateBookInstance(req.params.id, req.body);
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: bookInstance });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const bookInstance = await bookInstanceService.deleteBookInstance(req.params.id);
    if (!bookInstance) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};
