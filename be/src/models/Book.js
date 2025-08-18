import mongoose from 'mongoose';
import slugify from 'slugify';

slugify.extend({ 'đ': 'd', 'Đ': 'd' }); // tiện cho TV
const toBase = (s) => slugify(s || '', { lower: true, strict: true, trim: true });

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true, default: '' },

  // slug duy nhất
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

  authors: [{ type: String, trim: true }],
  publisher: { type: String, trim: true },
  publishedDate: { type: String, trim: true },
  description: { type: String },

  isbn10: { type: String, trim: true, default: '' },
  isbn13: { type: String, trim: true, default: '' },
  pageCount: { type: Number, default: 0 },

  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  averageRating: { type: Number },
  ratingsCount: { type: Number },

  imageLinks: {
    smallThumbnail: {
      type: String,
      default: 'https://neelkanthpublishers.com/assets/bookcover_cover.png',
    },
    thumbnail: {
      type: String,
      default: 'https://neelkanthpublishers.com/assets/bookcover_cover.png',
    },
  },
  language: { type: String, trim: true },

  previewLink: { type: String },
  infoLink: { type: String },
  canonicalVolumeLink: { type: String },

  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  quantity: { type: Number, default: 0 },

  // ⚠️ đặt tên đúng 'deletedAt' để khớp service (trước đây file cũ là deleteAt)
  deletedAt: { type: Date },

  createdBy: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

// Sinh slug một lần khi tạo (không tự đổi khi sửa title)
BookSchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    const suffix = (this._id?.toString() || '').slice(-8); // short id 8 ký tự
    this.slug = `${toBase(this.title)}-${suffix}`;
  }
  next();
});

const Book = mongoose.model('Book', BookSchema);
export default Book;
