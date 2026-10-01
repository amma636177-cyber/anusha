import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  performedByName: { type: String, default: 'System' },
  role: { type: String, default: 'admin' },
  targetType: { type: String, required: true }, // e.g. 'PRODUCT', 'GROUP_DEAL', 'DISCOUNT_RULE', 'COUPON', 'ORDER'
  targetId: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
