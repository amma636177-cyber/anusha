import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], required: true, default: 'PERCENTAGE' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 2000 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 1000 },
  perUserLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  applicableCategories: [{ type: String }],
  isGroupOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
