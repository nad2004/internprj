import BookInstance from '../models/BookInstance.js';

export const createBookInstance = async (data) => {
  return await BookInstance.create(data);
};

export const getBookInstances = async (filter = {}) => {
  return await BookInstance.find(filter)
    .populate('book_id', 'title authors')
    .populate('currentHolder', 'username email');
};

export const getBookInstanceById = async (id) => {
  return await BookInstance.findById(id)
    .populate('book_id', 'title authors')
    .populate('currentHolder', 'username email');
};

export const updateBookInstance = async (id, data) => {
  return await BookInstance.findByIdAndUpdate(id, data, { new: true });
};

export const deleteBookInstance = async (id) => {
  return await BookInstance.findByIdAndDelete(id);
};
