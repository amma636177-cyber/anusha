import Campaign from '../models/Campaign.js';
import AuditLog from '../models/AuditLog.js';

export const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ status: 'ACTIVE' })
      .populate('featuredProducts')
      .populate('featuredGroups')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.create(req.body);

    await AuditLog.create({
      action: 'CAMPAIGN_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'CAMPAIGN',
      targetId: campaign._id.toString(),
      details: { name: campaign.name, type: campaign.type }
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    next(error);
  }
};
