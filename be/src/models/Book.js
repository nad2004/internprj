import mongoose from 'mongoose';
import slugify from 'slugify';

const BookSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

  authors: [{ type: String, trim: true }],
  publisher: { type: String, trim: true },
  publishedDate: { type: String, trim: true },
  description: { type: String },

  isbn10: { type: String, trim: true },
  isbn13: { type: String, trim: true },
  pageCount: { type: Number },

  // liên kết đến Category bằng ObjectId
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  // categories: [{ type: String }],
  averageRating: { type: Number },
  ratingsCount: { type: Number },

  imageLinks: {
    smallThumbnail: { type: String },
    thumbnail: { type: String },
  },
  language: { type: String, trim: true },

  previewLink: { type: String },
  infoLink: { type: String },
  canonicalVolumeLink: { type: String },

  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available',
  },
  quantity: { type: Number, default: 0 },

  createdBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

BookSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Book = mongoose.model('Book', BookSchema);
export default Book;
