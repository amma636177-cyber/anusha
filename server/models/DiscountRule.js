import mongoose from 'mongoose';

const discountRuleSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  conditions: {
    minGroupMembers: { type: Number, default: 0 },
    minOrderValue: { type: Number, default: 0 },
    applicableCategories: [{ type: String }],
    applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    userType: { type: String, enum: ['ALL', 'NEW_USER', 'REPEAT_BUYER', 'VIP'], default: 'ALL' }
  },
  actions: {
    discountType: { type: String, enum: ['PERCENT', 'FIXED'], required: true, default: 'PERCENT' },
    discountValue: { type: Number, required: true }, // e.g. 15% or 300
    maxDiscountCap: { type: Number, default: 5000 }
  },
  priority: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true, index: true }
}, { timestamps: true });

export default mongoose.model('DiscountRule', discountRuleSchema);
