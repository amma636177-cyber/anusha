import GroupDeal from '../models/GroupDeal.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { calculateGroupTierPrice } from './discount.service.js';
import { emitToGroup, emitToAdmin, emitToUser } from './socket.service.js';

export const createGroupDeal = async ({ productId, creatorUser, durationHours = 48, customPriceTiers }) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const priceTiers = (customPriceTiers && customPriceTiers.length > 0)
    ? customPriceTiers
    : product.defaultPriceTiers;

  const targetTier = [...priceTiers].sort((a, b) => b.memberCount - a.memberCount)[0];
  const targetPrice = targetTier ? targetTier.price : product.price;

  const startTime = new Date();
  const endTime = new Date(Date.now() + durationHours * 60 * 60 * 1000);
  const shareCode = `GRP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const initialMember = {
    user: creatorUser._id,
    name: creatorUser.name,
    avatar: creatorUser.avatar,
    joinedAt: new Date(),
    quantity: 1,
    paidAmount: product.price,
    status: 'CONFIRMED'
  };

  const initialPrice = calculateGroupTierPrice(priceTiers, 1, product.price);

  const groupDeal = new GroupDeal({
    product: product._id,
    productTitle: product.title,
    productImage: product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    mrp: product.mrp,
    individualPrice: product.price,
    currentPrice: initialPrice,
    targetPrice,
    creator: creatorUser._id,
    creatorName: creatorUser.name,
    minMembers: 5,
    maxMembers: targetTier ? targetTier.memberCount : 20,
    currentMembers: 1,
    members: [initialMember],
    priceTiers,
    status: 'ACTIVE',
    startTime,
    endTime,
    shareCode
  });

  await groupDeal.save();
  await Product.findByIdAndUpdate(productId, { $inc: { activeGroupsCount: 1 } });

  emitToAdmin('group:created', {
    id: groupDeal._id,
    productTitle: product.title,
    creator: creatorUser.name
  });

  return groupDeal;
};

export const joinGroupDeal = async ({ groupDealId, user, quantity = 1, orderId = null }) => {
  const groupDeal = await GroupDeal.findById(groupDealId);
  if (!groupDeal) throw new Error('Group Deal not found');

  if (['COMPLETED', 'EXPIRED', 'CANCELLED', 'FULL'].includes(groupDeal.status)) {
    throw new Error(`Group Deal is already ${groupDeal.status.toLowerCase()}`);
  }

  if (new Date() > groupDeal.endTime) {
    groupDeal.status = 'EXPIRED';
    await groupDeal.save();
    throw new Error('This Group Deal has expired');
  }

  // Check if user already joined
  const existingMember = groupDeal.members.find(m => m.user.toString() === user._id.toString());
  if (existingMember) {
    existingMember.quantity += quantity;
  } else {
    groupDeal.members.push({
      user: user._id,
      name: user.name,
      avatar: user.avatar,
      joinedAt: new Date(),
      quantity,
      paidAmount: groupDeal.currentPrice * quantity,
      orderId,
      status: 'CONFIRMED'
    });
    groupDeal.currentMembers += 1;
  }

  // Calculate new current price
  const previousPrice = groupDeal.currentPrice;
  const newPrice = calculateGroupTierPrice(groupDeal.priceTiers, groupDeal.currentMembers, groupDeal.individualPrice);
  groupDeal.currentPrice = newPrice;

  const isTierUnlocked = newPrice < previousPrice;

  // Status updates
  if (groupDeal.currentMembers >= groupDeal.maxMembers) {
    groupDeal.status = 'COMPLETED';
  } else if (groupDeal.currentMembers >= groupDeal.maxMembers - 2) {
    groupDeal.status = 'ALMOST_FULL';
  } else {
    groupDeal.status = 'ACTIVE';
  }

  await groupDeal.save();

  // Real-time broadcast
  emitToGroup(groupDeal._id.toString(), 'group:updated', {
    groupId: groupDeal._id,
    currentMembers: groupDeal.currentMembers,
    currentPrice: groupDeal.currentPrice,
    status: groupDeal.status,
    newMemberName: user.name,
    isTierUnlocked
  });

  // Notify all members if new tier unlocked!
  if (isTierUnlocked) {
    for (const member of groupDeal.members) {
      const notif = await Notification.create({
        user: member.user,
        title: '🎉 Price Tier Unlocked!',
        message: `A new member joined ${groupDeal.productTitle}! Group price dropped to ₹${newPrice.toLocaleString('en-IN')}.`,
        type: 'TIER_UNLOCKED',
        link: `/group/${groupDeal._id}`
      });
      emitToUser(member.user.toString(), 'notification:new', notif);
    }
  }

  return groupDeal;
};

export const checkExpiringGroups = async () => {
  const now = new Date();
  const expiredActiveGroups = await GroupDeal.find({
    status: { $in: ['ACTIVE', 'ALMOST_FULL'] },
    endTime: { $lt: now }
  });

  for (const group of expiredActiveGroups) {
    if (group.currentMembers >= group.minMembers) {
      group.status = 'COMPLETED';
    } else {
      group.status = 'EXPIRED';
    }
    await group.save();
    emitToGroup(group._id.toString(), 'group:updated', {
      groupId: group._id,
      status: group.status,
      currentMembers: group.currentMembers
    });
  }
};
