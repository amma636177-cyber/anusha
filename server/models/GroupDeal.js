import mongoose from 'mongoose';

const groupTierSchema = new mongoose.Schema({
  memberCount: { type: Number, required: true },
  price: { type: Number, required: true },
  discountPercent: { type: Number, required: true }
}, { _id: false });

const groupMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  quantity: { type: Number, default: 1 },
  paidAmount: { type: Number, required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  status: { type: String, enum: ['CONFIRMED', 'PENDING', 'REFUNDED'], default: 'CONFIRMED' }
}, { _id: true });

const groupDealSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  mrp: { type: Number, required: true },
  individualPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  targetPrice: { type: Number, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: { type: String, required: true },
  minMembers: { type: Number, required: true, default: 5 },
  maxMembers: { type: Number, required: true, default: 20 },
  currentMembers: { type: Number, default: 1 },
  members: [groupMemberSchema],
  priceTiers: [groupTierSchema],
  status: {
    type: String,
    enum: ['ACTIVE', 'ALMOST_FULL', 'FULL', 'COMPLETED', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE',
    index: true
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true, index: true },
  shareCode: { type: String, required: true, unique: true, index: true },
  rules: {
    type: [String],
    default: [
      'Orders are locked at the price tier reached when group completes or time ends.',
      'If minimum members threshold is reached, deal unlocks for everyone.',
      'If the deal reaches maximum capacity, it is automatically finalized immediately.',
      'Invite friends via WhatsApp or copy link to accelerate unlocking the lowest tier.'
    ]
  },
  deliveryEstimateDays: { type: Number, default: 3 }
}, { timestamps: true });

export default mongoose.model('GroupDeal', groupDealSchema);
