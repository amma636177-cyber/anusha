import { callGroqChat } from './groq.provider.js';

export const generateProductContent = async ({ prompt, title, category, brand, basePrice }) => {
  const systemPrompt = `You are an expert commerce copywriter and SEO specialist for an elite group buying platform in India.
Generate high-converting, professional e-commerce product copy.
Respond ONLY with valid JSON in this exact structure:
{
  "title": "Clean, punchy commercial product title",
  "description": "Rich 2-3 paragraph product overview highlighting build quality and benefits",
  "highlights": ["Key highlight 1", "Key highlight 2", "Key highlight 3", "Key highlight 4"],
  "bulletPoints": ["Detailed spec/feature point 1", "Detailed spec/feature point 2", "Detailed spec/feature point 3"],
  "suggestedCategory": "Electronics | Fashion | Beauty | Home | Grocery | Fitness | Accessories | Appliances",
  "seo": {
    "metaTitle": "SEO title under 60 characters",
    "metaDescription": "SEO meta description under 155 characters",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
  }
}`;

  const userMessage = `Input Details:
Prompt: ${prompt || 'Generate a compelling listing'}
Title: ${title || ''}
Brand: ${brand || ''}
Category: ${category || ''}
Price: ₹${basePrice || ''}`;

  const res = await callGroqChat({
    systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    temperature: 0.6
  });

  if (res.content) {
    try {
      const cleaned = res.content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('AI output parse error, using fallback template:', e.message);
    }
  }

  // High quality local fallback
  return {
    title: title ? `${brand || 'Premium'} ${title}` : 'Acoustic Pro Wireless Active Noise-Cancelling Headphones',
    description: `Engineered for audiophiles and modern multitaskers, this exceptional product combines industrial-grade durability with sublime aesthetics. Features fast charging, low latency modes, and ultra-comfortable ergonomic cushions crafted for all-day listening sessions.`,
    highlights: [
      '40-Hour Extended Battery Life with Rapid Turbo Charge',
      'Hybrid Active Noise Cancellation with Transparency Mode',
      'Multi-Device Bluetooth 5.3 Seamless Auto-Switching',
      'Ultra-Lightweight Ergonomic Comfort & Foldable Architecture'
    ],
    bulletPoints: [
      'Custom tuned 40mm neodymium dynamic drivers deliver punchy bass and crystalline highs',
      'Quad-microphone beamforming array with AI background noise isolation for crystal clear calls',
      'Low latency 45ms gaming and video sync mode'
    ],
    suggestedCategory: category || 'Electronics',
    seo: {
      metaTitle: `${title || 'Premium Wireless ANC Headphones'} | Group Buy Savings`,
      metaDescription: `Buy ${title || 'ANC Headphones'} at unbeatable wholesale tier prices. Join an active group deal today and save big!`,
      keywords: ['wireless audio', 'group buy discount', 'noise cancelling', 'best headphones']
    }
  };
};

export const generateCouponConfig = async ({ prompt }) => {
  const systemPrompt = `You are a financial and marketing promotions expert for an Indian e-commerce marketplace.
Convert the marketing request into a structured coupon configuration.
Output strictly JSON matching this schema:
{
  "code": "CAPITALIZED_CODE_WITHOUT_SPACES",
  "description": "Clear promo summary for users",
  "discountType": "PERCENTAGE" or "FIXED",
  "discountValue": 15, // number representing % or rupees
  "minOrderValue": 1499,
  "maxDiscount": 500,
  "isGroupOnly": false,
  "usageLimit": 1000,
  "validDays": 7,
  "suggestedCategories": ["Electronics"]
}`;

  const res = await callGroqChat({
    systemPrompt,
    messages: [{ role: 'user', content: prompt || 'Create a weekend discount coupon' }],
    temperature: 0.4
  });

  if (res.content) {
    try {
      const cleaned = res.content.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('AI Coupon generator parse error:', e.message);
    }
  }

  // Reliable fallback
  const isWeekend = (prompt || '').toLowerCase().includes('weekend');
  return {
    code: isWeekend ? 'WEEKENDSPECIAL' : 'FLASHDEAL20',
    description: 'Get an exclusive discount on your group and individual orders this week.',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderValue: 1500,
    maxDiscount: 600,
    isGroupOnly: false,
    usageLimit: 500,
    validDays: 5,
    suggestedCategories: ['Electronics', 'Home']
  };
};
