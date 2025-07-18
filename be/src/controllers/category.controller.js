// controllers/category.controller.js

import * as categoryService from '../services/category.service.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNewCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateCategoryInfo = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.updateCategoryBySlug(slug, req.body);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = await categoryService.deleteCategoryBySlug(slug);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
