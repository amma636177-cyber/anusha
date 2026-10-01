import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, unique: true, index: true },
  icon: { type: String, default: 'Package' },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  productCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
