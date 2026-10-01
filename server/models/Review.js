import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: true },
  helpfulVotes: { type: Number, default: 0 },
  status: { type: String, enum: ['APPROVED', 'PENDING', 'REJECTED'], default: 'APPROVED' }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
