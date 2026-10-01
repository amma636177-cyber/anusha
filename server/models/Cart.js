import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  groupDeal: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupDeal' },
  isGroupBuy: { type: Boolean, default: false },
  quantity: { type: Number, default: 1, min: 1 },
  unitPrice: { type: Number, required: true },
  originalPrice: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: [cartItemSchema],
  appliedCoupon: {
    code: String,
    discountAmount: { type: Number, default: 0 }
  },
  subtotal: { type: Number, default: 0 },
  groupSavings: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
