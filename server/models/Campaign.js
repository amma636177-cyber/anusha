import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['FESTIVAL', 'WEEKEND', 'FLASH', 'CLEARANCE', 'NEW_USER', 'CATEGORY'],
    default: 'FLASH'
  },
  tagLine: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  featuredProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  featuredGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupDeal' }],
  couponCode: { type: String },
  discountHighlight: { type: String, default: 'Up to 45% OFF' },
  status: {
    type: String,
    enum: ['ACTIVE', 'UPCOMING', 'EXPIRED'],
    default: 'ACTIVE',
    index: true
  }
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
