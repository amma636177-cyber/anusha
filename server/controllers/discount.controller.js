import DiscountRule from '../models/DiscountRule.js';
import AuditLog from '../models/AuditLog.js';
import { evaluateRulesForOrder } from '../services/discount.service.js';

export const getDiscountRules = async (req, res, next) => {
  try {
    const rules = await DiscountRule.find().sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, count: rules.length, rules });
  } catch (error) {
    next(error);
  }
};

export const createDiscountRule = async (req, res, next) => {
  try {
    const rule = await DiscountRule.create(req.body);

    await AuditLog.create({
      action: 'DISCOUNT_RULE_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'DISCOUNT_RULE',
      targetId: rule._id.toString(),
      details: { name: rule.name, conditions: rule.conditions, actions: rule.actions }
    });

    res.status(201).json({ success: true, rule });
  } catch (error) {
    next(error);
  }
};

export const updateDiscountRule = async (req, res, next) => {
  try {
    const rule = await DiscountRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Discount rule not found' });
    }

    await AuditLog.create({
      action: 'DISCOUNT_RULE_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'DISCOUNT_RULE',
      targetId: rule._id.toString(),
      details: { name: rule.name }
    });

    res.json({ success: true, rule });
  } catch (error) {
    next(error);
  }
};

export const deleteDiscountRule = async (req, res, next) => {
  try {
    const rule = await DiscountRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Discount rule not found' });
    }

    await AuditLog.create({
      action: 'DISCOUNT_RULE_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'DISCOUNT_RULE',
      targetId: req.params.id,
      details: { name: rule.name }
    });

    res.json({ success: true, message: 'Rule removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const testEvaluateRule = async (req, res, next) => {
  try {
    const { groupMembers, orderValue, categoryIds } = req.body;
    const result = await evaluateRulesForOrder({
      groupMembers: Number(groupMembers) || 1,
      orderValue: Number(orderValue) || 0,
      categoryIds: categoryIds || [],
      userType: req.user ? req.user.loyaltyTier : 'ALL'
    });
    res.json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
