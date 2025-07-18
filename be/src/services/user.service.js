// src/services/user.service.js
import User from '../models/User.js';

export const getAllUsers = async () => {
  return await User.find();
};

export const getUserById = async (id) => {
  return await User.findById(id).select('-passwordHash');
};


export const updateUser = async (id, updates) => {
  return await User.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};
