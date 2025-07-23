// controllers/category.controller.js

import * as categoryService from '../services/category.service.js';
import { respondSuccess } from '../utils/respond.js';
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    respondSuccess(res, { data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    respondSuccess(res, { data: category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNewCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    respondSuccess(res, { data: category, message: 'Category created successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCategoryInfo = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.updateCategoryBySlug(slug, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    respondSuccess(res, { data: category, méssage: 'Category updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = await categoryService.deleteCategoryBySlug(slug);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    respondSuccess(res, { message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
