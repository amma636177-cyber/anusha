import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['customer', 'admin', 'manager', 'support', 'super_admin'],
    default: 'customer'
  },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  phone: { type: String, default: '+91 98765 43210' },
  referralCode: { type: String, unique: true, sparse: true, index: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rewardPoints: { type: Number, default: 150 },
  loyaltyTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Silver' },
  addresses: [addressSchema],
  isVerified: { type: Boolean, default: true },
  preferences: {
    categories: [{ type: String }],
    priceRange: { min: Number, max: Number },
    notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true } }
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
