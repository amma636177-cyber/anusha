import AIService from '../services/ai/ai.service.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

    const result = await AIService.chatWithShopper({
      message,
      history: history || [],
      userPreferences: req.user?.preferences || {}
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const handleSmartSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query string is required' });

    const result = await AIService.smartSearch(q);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { category } = req.query;
    const recommendations = await AIService.getRecommendations({
      userId: req.user?._id,
      categoryPreference: category
    });
    res.json({ success: true, count: recommendations.length, recommendations });
  } catch (error) {
    next(error);
  }
};

export const getProductGroups = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const groups = await AIService.getProductActiveGroups(productId);
    res.json({ success: true, count: groups.length, groups });
  } catch (error) {
    next(error);
  }
};

export const getCartInsights = async (req, res, next) => {
  try {
    const { cart } = req.body;
    const insights = await AIService.getCartInsights({
      cart,
      userId: req.user?._id
    });
    res.json({ success: true, insights });
  } catch (error) {
    next(error);
  }
};

export const generateProductContent = async (req, res, next) => {
  try {
    const { prompt, title, category, brand, basePrice } = req.body;
    const content = await AIService.generateProductSEOAndCopy({
      prompt,
      title,
      category,
      brand,
      basePrice
    });
    res.json({ success: true, content });
  } catch (error) {
    next(error);
  }
};

export const generateCoupon = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    const coupon = await AIService.generateCoupon({ prompt });
    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

export const getAdminDailyDigest = async (req, res, next) => {
  try {
    const digest = await AIService.getAdminIssuesDigest();
    res.json({ success: true, ...digest });
  } catch (error) {
    next(error);
  }
};

export const queryAnalytics = async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    const analytics = await AIService.queryAnalytics({ query });
    res.json({ success: true, ...analytics });
  } catch (error) {
    next(error);
  }
};
