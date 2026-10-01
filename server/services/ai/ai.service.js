import { handleShoppingChat, parseSmartSearch } from './shopping-assistant.service.js';
import { getPersonalizedRecommendations, getActiveGroupsForProduct, getCartAiInsights } from './recommendation.service.js';
import { generateProductContent, generateCouponConfig } from './content-generator.service.js';
import { getDailyAdminDigest, queryAdminAnalytics } from './admin-assistant.service.js';

export const AIService = {
  chatWithShopper: handleShoppingChat,
  smartSearch: parseSmartSearch,
  getRecommendations: getPersonalizedRecommendations,
  getProductActiveGroups: getActiveGroupsForProduct,
  getCartInsights: getCartAiInsights,
  generateProductSEOAndCopy: generateProductContent,
  generateCoupon: generateCouponConfig,
  getAdminIssuesDigest: getDailyAdminDigest,
  queryAnalytics: queryAdminAnalytics
};

export default AIService;
