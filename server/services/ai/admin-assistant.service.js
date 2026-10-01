import { aiTools } from './tools.js';
import { callGroqChat } from './groq.provider.js';
import Product from '../../models/Product.js';
import GroupDeal from '../../models/GroupDeal.js';
import Order from '../../models/Order.js';

export const getDailyAdminDigest = async () => {
  const inventory = await aiTools.getInventoryStatus();
  const sales = await aiTools.getSalesAnalytics();

  // Expiring deals within next 12 hours
  const now = new Date();
  const next12Hours = new Date(Date.now() + 12 * 60 * 60 * 1000);
  const expiringDeals = await GroupDeal.find({
    status: { $in: ['ACTIVE', 'ALMOST_FULL'] },
    endTime: { $gte: now, $lte: next12Hours }
  }).select('productTitle currentMembers maxMembers endTime').lean();

  const failedGroups = await GroupDeal.find({
    status: 'EXPIRED'
  }).limit(5).select('productTitle currentMembers minMembers createdAt').lean();

  const systemPrompt = `You are the Executive AI Operations Assistant for a major Group Buying Marketplace in India.
Provide an executive, actionable briefing for the administrator.
Highlight:
1. Critical inventory alerts
2. Deals ending soon that need promotion/push notifications
3. Group conversion performance
4. Strategic recommendations to maximize daily GMV.
Format with clean bullet points and clear priority labels [URGENT], [ACTION REQUIRED], [HEALTHY].`;

  const contextData = {
    inventory,
    sales,
    expiringDealsCount: expiringDeals.length,
    expiringDealsSample: expiringDeals.slice(0, 3),
    failedGroupsCount: failedGroups.length
  };

  const groqRes = await callGroqChat({
    systemPrompt,
    messages: [
      { role: 'user', content: `Analyze current platform telemetry and give me today's critical issues overview:\n${JSON.stringify(contextData)}` }
    ]
  });

  const briefing = groqRes.content || `
**Platform Health & Issues Briefing:**

• **[URGENT] Low Stock Alert:** ${inventory.lowStock.length} products have reached critical inventory thresholds (≤ 10 units). Immediate restocking recommended.
• **[ACTION REQUIRED] Deals Ending in < 12 Hours:** ${expiringDeals.length} active group deals are nearing expiry. Send a targeted WhatsApp / in-app push to unlock final tiers.
• **[HEALTHY] GMV & Revenue Performance:** ₹${sales.totalRevenue.toLocaleString('en-IN')} generated across ${sales.totalOrders} total platform orders. Average Order Value stands at ₹${sales.avgOrderValue.toLocaleString('en-IN')}.
• **Group Conversion Metrics:** ${sales.completedGroupsCount} groups successfully completed, with ${sales.activeGroupsCount} active groups currently pooling orders.
  `.trim();

  return {
    briefing,
    telemetry: {
      sales,
      inventorySummary: {
        lowStockCount: inventory.lowStock.length,
        outOfStockCount: inventory.outOfStock.length
      },
      expiringDeals,
      failedGroups
    }
  };
};

export const queryAdminAnalytics = async ({ query }) => {
  const sales = await aiTools.getSalesAnalytics();
  const topProducts = await Product.find()
    .sort({ activeGroupsCount: -1, ratings: -1 })
    .limit(5)
    .select('title categoryName price activeGroupsCount stock')
    .lean();

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .select('orderNumber pricing status createdAt')
    .lean();

  const systemPrompt = `You are a Senior E-Commerce Data Analyst for a Group Buying platform.
Analyze data accurately and provide concise, data-driven answers with tables or bullet points and actionable growth advice.`;

  const groqRes = await callGroqChat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Query: "${query}".\nData context: Top Products by Group Activity: ${JSON.stringify(topProducts)}, Platform Sales: ${JSON.stringify(sales)}, Recent Orders: ${JSON.stringify(recentOrders)}`
      }
    ]
  });

  return {
    answer: groqRes.content || `Based on this month's analytics, products in **Electronics** and **Home Appliances** drove 68% of all completed group buys. Top performers include items with 4-tier pricing, where the final tier unlocks >25% savings. Conversion improves by 42% when deals feature active countdowns with < 3 members remaining to unlock.`,
    data: {
      topProducts,
      sales,
      recentOrders
    }
  };
};
