import GroupDeal from '../models/GroupDeal.js';
import Product from '../models/Product.js';
import { createGroupDeal as createGroupService, joinGroupDeal as joinGroupService } from '../services/group.service.js';

export const getGroupDeals = async (req, res, next) => {
  try {
    const { status, category, sort } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      // Default to showing active & almost full
      query.status = { $in: ['ACTIVE', 'ALMOST_FULL', 'FULL', 'COMPLETED'] };
    }

    let sortOptions = { currentMembers: -1, createdAt: -1 };
    if (sort === 'expiring_soon') {
      sortOptions = { endTime: 1 };
    } else if (sort === 'discount') {
      sortOptions = { targetPrice: 1 };
    }

    const groupDeals = await GroupDeal.find(query).sort(sortOptions).populate('product', 'categoryName brand ratings numReviews');
    res.json({ success: true, count: groupDeals.length, groupDeals });
  } catch (error) {
    next(error);
  }
};

export const getGroupDealById = async (req, res, next) => {
  try {
    const groupDeal = await GroupDeal.findById(req.params.id)
      .populate('product')
      .populate('members.user', 'name avatar loyaltyTier');

    if (!groupDeal) {
      return res.status(404).json({ success: false, message: 'Group Deal not found' });
    }

    // Calculate time left in seconds
    const now = new Date();
    const timeLeftSeconds = Math.max(0, Math.floor((new Date(groupDeal.endTime) - now) / 1000));

    // Calculate savings against MRP and individual price
    const savingsFromMrp = groupDeal.mrp - groupDeal.currentPrice;
    const savingsFromIndividual = groupDeal.individualPrice - groupDeal.currentPrice;

    // Next tier info
    const sortedTiers = [...groupDeal.priceTiers].sort((a, b) => a.memberCount - b.memberCount);
    const nextTier = sortedTiers.find(t => t.memberCount > groupDeal.currentMembers);
    const membersNeededForNextTier = nextTier ? nextTier.memberCount - groupDeal.currentMembers : 0;
    const nextTierPrice = nextTier ? nextTier.price : groupDeal.currentPrice;

    // WhatsApp share text
    const shareText = encodeURIComponent(
      `🔥 Unlock Big Savings! Join my Group Deal on "${groupDeal.productTitle}".\n` +
      `Current Price: ₹${groupDeal.currentPrice.toLocaleString('en-IN')} (MRP: ₹${groupDeal.mrp.toLocaleString('en-IN')})\n` +
      `Unlock lowest price ₹${groupDeal.targetPrice.toLocaleString('en-IN')} when more join!\n` +
      `Join here: ${process.env.CLIENT_URL || 'http://localhost:5173'}/group/${groupDeal._id}`
    );

    res.json({
      success: true,
      groupDeal: {
        ...groupDeal.toObject(),
        timeLeftSeconds,
        savingsFromMrp,
        savingsFromIndividual,
        nextTier: nextTier ? {
          memberCount: nextTier.memberCount,
          price: nextTier.price,
          membersNeeded: membersNeededForNextTier,
          priceDrop: groupDeal.currentPrice - nextTierPrice
        } : null,
        shareText,
        whatsappUrl: `https://api.whatsapp.com/send?text=${shareText}`
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req, res, next) => {
  try {
    const { productId, durationHours, customPriceTiers } = req.body;
    const groupDeal = await createGroupService({
      productId,
      creatorUser: req.user,
      durationHours: durationHours || 48,
      customPriceTiers
    });

    res.status(201).json({ success: true, groupDeal });
  } catch (error) {
    next(error);
  }
};

export const joinGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity = 1, orderId } = req.body;

    const groupDeal = await joinGroupService({
      groupDealId: id,
      user: req.user,
      quantity,
      orderId
    });

    res.json({
      success: true,
      message: 'Successfully joined Group Deal!',
      groupDeal
    });
  } catch (error) {
    next(error);
  }
};
