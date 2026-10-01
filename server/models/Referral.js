import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralCode: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED', 'EXPIRED'], default: 'PENDING' },
  rewardPointsEarned: { type: Number, default: 200 }
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);
