import mongoose from 'mongoose';

const priceTierSchema = new mongoose.Schema({
  memberCount: { type: Number, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  sku: { type: String, required: true, unique: true, index: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  categoryName: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  bulletPoints: [{ type: String }],
  specifications: [{ key: String, value: String }],
  mrp: { type: Number, required: true }, // MRP e.g. 2999
  price: { type: Number, required: true }, // Individual purchase price e.g. 2699
  stock: { type: Number, required: true, default: 50 },
  images: [{ type: String, required: true }],
  ratings: { type: Number, default: 4.6 },
  numReviews: { type: Number, default: 12 },
  isGroupBuyEligible: { type: Boolean, default: true, index: true },
  defaultPriceTiers: [priceTierSchema],
  activeGroupsCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  badge: { type: String, default: '' }, // e.g. 'HOT DEAL', 'TRENDING', 'TOP CHOICE'
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', productSchema);
