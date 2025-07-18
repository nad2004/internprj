import mongoose from 'mongoose';
import slugify from 'slugify';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  createdBy: {
    type: String,
    default: 'admin'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tự động sinh slug từ name trước khi validate
CategorySchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
