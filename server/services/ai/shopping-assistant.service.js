import { aiTools } from './tools.js';
import { callGroqChat } from './groq.provider.js';

export const handleShoppingChat = async ({ message, history = [], userPreferences = {} }) => {
  const lowerMsg = (message || '').toLowerCase();

  // Extract budget if mentioned (e.g. "under 3000", "below 20000", "< 5000", "under ₹1500")
  let maxPrice = null;
  const priceMatch = lowerMsg.match(/(?:under|below|less than|within|upto|budget of)?\s*(?:₹|rs\.?|inr)?\s*([0-9]{3,7})/i);
  if (priceMatch && (lowerMsg.includes('under') || lowerMsg.includes('below') || lowerMsg.includes('budget') || lowerMsg.includes('within') || lowerMsg.includes('upto') || lowerMsg.includes('₹') || lowerMsg.includes('rs'))) {
    maxPrice = parseInt(priceMatch[1], 10);
  }

  // Detect category keywords
  let detectedCategory = null;
  if (lowerMsg.includes('headphone') || lowerMsg.includes('earphone') || lowerMsg.includes('audio') || lowerMsg.includes('earbuds')) {
    detectedCategory = 'Electronics';
  } else if (lowerMsg.includes('watch') || lowerMsg.includes('smartwatch')) {
    detectedCategory = 'Electronics';
  } else if (lowerMsg.includes('shoe') || lowerMsg.includes('sneaker') || lowerMsg.includes('shirt') || lowerMsg.includes('jacket') || lowerMsg.includes('dress')) {
    detectedCategory = 'Fashion';
  } else if (lowerMsg.includes('serum') || lowerMsg.includes('cream') || lowerMsg.includes('skin') || lowerMsg.includes('beauty')) {
    detectedCategory = 'Beauty';
  } else if (lowerMsg.includes('lamp') || lowerMsg.includes('cookware') || lowerMsg.includes('home') || lowerMsg.includes('kitchen')) {
    detectedCategory = 'Home';
  } else if (lowerMsg.includes('coffee') || lowerMsg.includes('tea') || lowerMsg.includes('snack') || lowerMsg.includes('grocery')) {
    detectedCategory = 'Grocery';
  } else if (lowerMsg.includes('mat') || lowerMsg.includes('gym') || lowerMsg.includes('fitness') || lowerMsg.includes('protein')) {
    detectedCategory = 'Fitness';
  }

  // Fetch relevant products and active groups using safe tools
  const products = await aiTools.searchProducts({
    query: detectedCategory ? '' : message.replace(/under|below|rs|₹|\d+/gi, '').trim(),
    category: detectedCategory,
    maxPrice
  });

  const matchingGroups = await aiTools.searchGroups({
    query: detectedCategory ? '' : message.replace(/under|below|rs|₹|\d+/gi, '').trim()
  });

  // System prompt tailored for concise conversational output without ASCII tables
  const systemPrompt = `You are the AI Shopping Concierge for PoolBuy, a premium Indian Group Buying platform.
Your mission is to provide concise, friendly, and expert shopping recommendations.

CRITICAL FORMATTING INSTRUCTIONS:
- Keep your response brief, natural, and conversational (2 to 3 sentences max).
- DO NOT generate markdown tables (no | pipes | or table syntax).
- DO NOT output bulleted lists of product prices, because interactive product cards and group deal buttons are automatically displayed directly below your message in the UI!
- Focus on answering the user's specific request and highlighting the group buying savings.

Available Catalog Matches:
${JSON.stringify(products.slice(0, 4))}

Available Group Deals:
${JSON.stringify(matchingGroups.slice(0, 3))}`;

  const groqRes = await callGroqChat({
    systemPrompt,
    messages: [
      ...history.slice(-4),
      { role: 'user', content: message }
    ]
  });

  let responseText = groqRes.content;

  // Clean up any stray markdown table rows or excessive pipe characters if present
  if (responseText) {
    responseText = responseText
      .split('\n')
      .filter(line => !line.trim().startsWith('|'))
      .join('\n')
      .trim();
  }

  if (!responseText) {
    if (products.length > 0) {
      const topProd = products[0];
      const lowestTierPrice = topProd.defaultPriceTiers?.length
        ? Math.min(...topProd.defaultPriceTiers.map(t => t.price))
        : topProd.price;
      const totalSavings = topProd.mrp - lowestTierPrice;

      responseText = `I found great options matching your request! For instance, **${topProd.title}** can be unlocked for as low as **₹${lowestTierPrice.toLocaleString('en-IN')}** (saving ₹${totalSavings.toLocaleString('en-IN')}) when you join the active group deal below.`;
    } else {
      responseText = `I searched our catalog for "${message}". We have trending group deals across Electronics, Fashion, Beauty, and Home where community pooling unlocks up to 45% discount. Check out our active deals below!`;
    }
  }

  return {
    reply: responseText,
    recommendedProducts: products.slice(0, 4),
    recommendedGroups: matchingGroups.slice(0, 3),
    appliedFilters: {
      category: detectedCategory,
      maxPrice
    }
  };
};

export const parseSmartSearch = async (query) => {
  const lower = query.toLowerCase();
  let category = '';
  let maxPrice = null;
  let minDiscount = null;

  if (lower.includes('headphone') || lower.includes('audio') || lower.includes('watch') || lower.includes('gadget')) category = 'Electronics';
  else if (lower.includes('shoe') || lower.includes('wear') || lower.includes('fashion')) category = 'Fashion';
  else if (lower.includes('skin') || lower.includes('beauty')) category = 'Beauty';
  else if (lower.includes('home') || lower.includes('kitchen')) category = 'Home';

  const priceMatch = lower.match(/(?:under|below|<|<=|upto)\s*₹?\s*(\d+)/i);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1], 10);
  }

  const discountMatch = lower.match(/(?:more than|>|>=|above)?\s*(\d+)%\s*(?:off|discount)?/i);
  if (discountMatch) {
    minDiscount = parseInt(discountMatch[1], 10);
  }

  return {
    queryText: query.replace(/(?:under|below|more than|\d+%|₹|\d+)/gi, '').trim(),
    structuredFilters: {
      category,
      maxPrice,
      minDiscount
    }
  };
};
