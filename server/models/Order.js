import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  isGroupBuy: { type: Boolean, default: false },
  groupDeal: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupDeal' }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, default: '' }
  },
  paymentInfo: {
    method: { type: String, enum: ['RAZORPAY', 'PHONEPE', 'CASHFREE', 'UPI', 'COD'], default: 'RAZORPAY' },
    transactionId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
      default: 'SUCCESS'
    },
    paidAt: { type: Date, default: Date.now }
  },
  pricing: {
    subtotal: { type: Number, required: true },
    groupSavings: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  appliedCoupon: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'PLACED', 'CONFIRMED', 'PROCESSING', 'PACKED',
      'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED',
      'CANCELLED', 'RETURNED', 'REFUNDED'
    ],
    default: 'CONFIRMED',
    index: true
  },
  groupDeal: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupDeal' },
  trackingHistory: [{
    status: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
