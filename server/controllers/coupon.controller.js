import Coupon from '../models/Coupon.js';
import AuditLog from '../models/AuditLog.js';
import { validateAndApplyCoupon } from '../services/discount.service.js';

export const getCoupons = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { isActive: true };
    const coupons = await Coupon.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

export const applyCouponCode = async (req, res, next) => {
  try {
    const { code, subtotal, isGroupBuy } = req.body;
    const result = await validateAndApplyCoupon({
      code,
      userId: req.user?._id,
      subtotal: Number(subtotal) || 0,
      isGroupBuy: Boolean(isGroupBuy)
    });

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, coupon: result.coupon });
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const couponData = { ...req.body, code: req.body.code.toUpperCase().trim() };
    const coupon = await Coupon.create(couponData);

    await AuditLog.create({
      action: 'COUPON_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'COUPON',
      targetId: coupon._id.toString(),
      details: { code: coupon.code, discountValue: coupon.discountValue }
    });

    res.status(201).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    await AuditLog.create({
      action: 'COUPON_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'COUPON',
      targetId: coupon._id.toString(),
      details: { code: coupon.code }
    });

    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    await AuditLog.create({
      action: 'COUPON_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'COUPON',
      targetId: req.params.id,
      details: { code: coupon.code }
    });

    res.json({ success: true, message: 'Coupon removed' });
  } catch (error) {
    next(error);
  }
};
