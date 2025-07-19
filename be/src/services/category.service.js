// services/category.service.js

import Category from '../models/Category.js';

export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const getCategoryBySlug = async (slug) => {
  return await Category.findOne({ slug });
};

export const createCategory = async ({ name, slug }) => {
  // ensure your model has a slug field and you pass it in req.body
  const category = new Category({ name, slug });
  return await category.save();
};

export const updateCategoryBySlug = async (slug, updates) => {
  return await Category.findOneAndUpdate({ slug }, updates, { new: true });
};

export const deleteCategoryBySlug = async (slug) => {
  return await Category.findOneAndDelete({ slug });
};
