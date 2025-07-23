// src/controllers/user.controller.js
import * as userService from '../services/user.service.js';
import { respondSuccess } from '../utils/respond.js';
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    respondSuccess(res, { data: users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    respondSuccess(res, { data: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    respondSuccess(res, { data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    respondSuccess(res, { message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
