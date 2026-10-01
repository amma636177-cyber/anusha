import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import GroupDeal from '../models/GroupDeal.js';
import DiscountRule from '../models/DiscountRule.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

dotenv.config();

export const seedDatabase = async () => {
  console.log('🌱 Seeding database with realistic commercial data...');

  // 1. Clear existing
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    GroupDeal.deleteMany({}),
    DiscountRule.deleteMany({}),
    Coupon.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    Notification.deleteMany({})
  ]);

  // 2. Create Users
  const adminUser = await User.create({
    name: 'Platform Administrator',
    email: 'admin@groupbuy.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98111 22233',
    referralCode: 'ADMIN01',
    rewardPoints: 1000,
    loyaltyTier: 'Platinum'
  });

  const managerUser = await User.create({
    name: 'Kavita Nair',
    email: 'manager@groupbuy.com',
    password: 'manager123',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98222 33344',
    referralCode: 'MGR01',
    rewardPoints: 500,
    loyaltyTier: 'Gold'
  });

  const customerUser = await User.create({
    name: 'Anusha Sharma',
    email: 'anusha@customer.com',
    password: 'customer123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '+91 98333 44455',
    referralCode: 'ANUSHA99',
    rewardPoints: 450,
    loyaltyTier: 'Gold',
    addresses: [{
      street: '42, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      isDefault: true
    }]
  });

  const demoMembers = [
    { name: 'Rahul Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Priya Iyer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Amit Patel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sneha Rao', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Vikram Malhotra', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { name: 'Ananya Sen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
    { name: 'Rohan Gupta', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80' },
    { name: 'Pooja Reddy', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' }
  ];

  // 3. Create Categories
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', icon: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', description: 'Smart gadgets, premium audio, and computing accessories' },
    { name: 'Fashion', slug: 'fashion', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80', description: 'Contemporary apparel, footwear, and designer essentials' },
    { name: 'Beauty', slug: 'beauty', icon: 'Sparkles', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80', description: 'Luxury skincare, fragrances, and organic wellness' },
    { name: 'Home', slug: 'home', icon: 'Home', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80', description: 'Modern decor, intelligent lighting, and cookware' },
    { name: 'Grocery', slug: 'grocery', icon: 'ShoppingBag', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80', description: 'Artisanal roasts, superfoods, and daily pantry staples' },
    { name: 'Fitness', slug: 'fitness', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80', description: 'Training gear, smart bands, and yoga accessories' },
    { name: 'Accessories', slug: 'accessories', icon: 'Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', description: 'Leather goods, timepieces, and travel gear' },
    { name: 'Appliances', slug: 'appliances', icon: 'Zap', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80', description: 'Coffee machines, air purifiers, and smart kitchenware' }
  ];

  const createdCategories = {};
  for (const cat of categoryData) {
    const created = await Category.create(cat);
    createdCategories[cat.name] = created;
  }

  // 4. Create 32+ Rich Products with Price Tiers
  const productDefinitions = [
    // Electronics
    {
      title: 'AcousticPro ANC Wireless Headphones',
      categoryName: 'Electronics',
      brand: 'AcousticLab',
      mrp: 2999,
      price: 2699,
      stock: 45,
      ratings: 4.8,
      numReviews: 48,
      badge: 'POPULAR CHOICE',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Engineered with titanium drivers, 40-hour battery reserve, and crystal hybrid active noise cancellation for immersive audio everywhere.',
      highlights: ['40-Hour Battery Reserve with Fast USB-C Charging', 'Hybrid Active Noise Cancellation', 'Multi-device Bluetooth 5.3', 'Comfort memory foam cushions'],
      defaultPriceTiers: [
        { memberCount: 1, price: 2699, discountPercent: 10 },
        { memberCount: 5, price: 2399, discountPercent: 20 },
        { memberCount: 10, price: 2099, discountPercent: 30 },
        { memberCount: 20, price: 1899, discountPercent: 37 }
      ]
    },
    {
      title: 'Titanium Edge Smart Watch Gen 4',
      categoryName: 'Electronics',
      brand: 'Titanium',
      mrp: 4999,
      price: 4499,
      stock: 35,
      ratings: 4.7,
      numReviews: 64,
      badge: 'URGENT DEAL',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Ultra-bright 1.43 AMOLED display, heart rate and SpO2 precision telemetry, GPS tracking, and a titanium alloy bezel.',
      highlights: ['1.43-inch Always-On AMOLED Display', 'Built-in Dual Frequency GPS', '5 ATM Water Resistant', '7-Day Battery Life'],
      defaultPriceTiers: [
        { memberCount: 1, price: 4499, discountPercent: 10 },
        { memberCount: 5, price: 3999, discountPercent: 20 },
        { memberCount: 10, price: 3599, discountPercent: 28 },
        { memberCount: 20, price: 3199, discountPercent: 36 }
      ]
    },
    {
      title: 'Vortex Mechanical Gaming Keyboard (RGB)',
      categoryName: 'Electronics',
      brand: 'Vortex',
      mrp: 3499,
      price: 3199,
      stock: 28,
      ratings: 4.6,
      numReviews: 29,
      badge: 'TRENDING',
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Hot-swappable tactile switches, double-shot PBT keycaps, per-key RGB backlighting, and CNC anodized aluminum frame.',
      highlights: ['Hot-Swappable Switches', 'Pre-lubed stabilizers', 'Per-key ARGB with onboard profiles', 'Detachable braided Type-C cable'],
      defaultPriceTiers: [
        { memberCount: 1, price: 3199, discountPercent: 9 },
        { memberCount: 5, price: 2799, discountPercent: 20 },
        { memberCount: 10, price: 2399, discountPercent: 31 }
      ]
    },
    {
      title: 'Aura Studio Portable Bluetooth Speaker',
      categoryName: 'Electronics',
      brand: 'AuraAudio',
      mrp: 2499,
      price: 2199,
      stock: 40,
      ratings: 4.5,
      numReviews: 33,
      badge: 'GROUP EXCLUSIVE',
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Room-filling 360-degree sound with deep passive bass radiators and IPX7 waterproof casing for outdoor gatherings.',
      highlights: ['24-Watt Peak Dynamic Output', 'IPX7 Rugged Waterproof', 'Stereo Pairing Support', '18 Hours Playtime'],
      defaultPriceTiers: [
        { memberCount: 1, price: 2199, discountPercent: 12 },
        { memberCount: 5, price: 1899, discountPercent: 24 },
        { memberCount: 10, price: 1599, discountPercent: 36 }
      ]
    },

    // Fashion
    {
      title: 'Apex Aero Knit Performance Running Shoes',
      categoryName: 'Fashion',
      brand: 'ApexPro',
      mrp: 3999,
      price: 3499,
      stock: 60,
      ratings: 4.9,
      numReviews: 76,
      badge: 'TOP SELLER',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Ultra-cushioned carbon-infused midsole engineered for maximum energy return and marathon breathability.',
      highlights: ['Carbon plate responsiveness', 'Engineered seamless mesh upper', 'High-grip continental rubber outsole', 'Ortholite antimicrobial footbed'],
      defaultPriceTiers: [
        { memberCount: 1, price: 3499, discountPercent: 12 },
        { memberCount: 5, price: 2999, discountPercent: 25 },
        { memberCount: 10, price: 2499, discountPercent: 37 },
        { memberCount: 20, price: 2199, discountPercent: 45 }
      ]
    },
    {
      title: 'Merino Wool Minimalist Overcoat',
      categoryName: 'Fashion',
      brand: 'Atelier NORD',
      mrp: 6999,
      price: 5999,
      stock: 20,
      ratings: 4.8,
      numReviews: 19,
      badge: 'LIMITED EDITION',
      images: [
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80'
      ],
      description: '100% fine Australian merino wool with a tailored architectural silhouette and silk-blend interior lining.',
      highlights: ['Pure Merino Wool', 'Horn Button Closures', 'Tailored Modern Fit', 'Thermal regulation'],
      defaultPriceTiers: [
        { memberCount: 1, price: 5999, discountPercent: 14 },
        { memberCount: 5, price: 5199, discountPercent: 26 },
        { memberCount: 10, price: 4499, discountPercent: 36 }
      ]
    },
    {
      title: 'Pima Cotton Luxe Oxford Shirt',
      categoryName: 'Fashion',
      brand: 'Hemmingway',
      mrp: 1999,
      price: 1699,
      stock: 50,
      ratings: 4.6,
      numReviews: 42,
      badge: 'VALUE DEAL',
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Crafted from extra-long staple Pima cotton for incredible softness, natural luster, and crease-resistant drape.',
      highlights: ['100% Supima Cotton', 'Reinforced Collar Stays', 'Natural Mother of Pearl Buttons', 'Pre-shrunk fabric'],
      defaultPriceTiers: [
        { memberCount: 1, price: 1699, discountPercent: 15 },
        { memberCount: 5, price: 1399, discountPercent: 30 },
        { memberCount: 10, price: 1199, discountPercent: 40 }
      ]
    },

    // Beauty
    {
      title: 'Lumiglow 15% Vitamin C Brightening Serum',
      categoryName: 'Beauty',
      brand: 'Lumiglow Botanical',
      mrp: 999,
      price: 849,
      stock: 75,
      ratings: 4.8,
      numReviews: 95,
      badge: 'BEST DEAL',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Clinically tested antioxidant formula with pure L-Ascorbic Acid, Ferulic Acid, and Hyaluronic Acid for radiant clarity.',
      highlights: ['Stabilized Vitamin C formula', 'Fades hyperpigmentation and sun spots', 'Dermatologist tested & fragrance-free', 'Deep cellular hydration'],
      defaultPriceTiers: [
        { memberCount: 1, price: 849, discountPercent: 15 },
        { memberCount: 5, price: 699, discountPercent: 30 },
        { memberCount: 10, price: 549, discountPercent: 45 },
        { memberCount: 20, price: 449, discountPercent: 55 }
      ]
    },
    {
      title: 'Peptide Firming Ceramide Barrier Cream',
      categoryName: 'Beauty',
      brand: 'Dermacell',
      mrp: 1499,
      price: 1299,
      stock: 40,
      ratings: 4.7,
      numReviews: 38,
      badge: 'AI RECOMMENDED',
      images: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Replenishes compromised moisture barriers with 5 essential ceramides and multi-molecular peptides for plumper skin.',
      highlights: ['5 Biomimetic Ceramides', 'Squalane & Niacinamide enriched', 'Soothes inflammation', 'Velvety non-greasy absorption'],
      defaultPriceTiers: [
        { memberCount: 1, price: 1299, discountPercent: 13 },
        { memberCount: 5, price: 1099, discountPercent: 26 },
        { memberCount: 10, price: 899, discountPercent: 40 }
      ]
    },

    // Home
    {
      title: 'Nordic Ceramic Minimalist Table Lamp',
      categoryName: 'Home',
      brand: 'Nordic Living',
      mrp: 2799,
      price: 2399,
      stock: 30,
      ratings: 4.6,
      numReviews: 24,
      badge: 'NEW ARRIVAL',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Handcrafted stoneware ceramic base with textured oatmeal linen shade and touch-dimmable warm ambient LED.',
      highlights: ['Handmade ceramic pottery', '3-Level touch dimming', 'Eco-friendly linen lampshade', 'Includes 2700K warm LED bulb'],
      defaultPriceTiers: [
        { memberCount: 1, price: 2399, discountPercent: 14 },
        { memberCount: 5, price: 1999, discountPercent: 28 },
        { memberCount: 10, price: 1699, discountPercent: 39 }
      ]
    },
    {
      title: 'Cast Iron Enamelled Dutch Oven (4.5L)',
      categoryName: 'Home',
      brand: 'Culinary Heritage',
      mrp: 4499,
      price: 3899,
      stock: 25,
      ratings: 4.9,
      numReviews: 53,
      badge: 'CHEF CHOICE',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Heavyweight enameled cast iron delivers superior heat retention and uniform simmering for artisan breads and slow roasts.',
      highlights: ['Oven safe up to 260°C', 'Chip-resistant dual enamel coating', 'Self-basting condensation lid', 'Induction & Gas compatible'],
      defaultPriceTiers: [
        { memberCount: 1, price: 3899, discountPercent: 13 },
        { memberCount: 5, price: 3299, discountPercent: 26 },
        { memberCount: 10, price: 2799, discountPercent: 37 }
      ]
    },

    // Appliances
    {
      title: 'Barista Touch 15-Bar Espresso Machine',
      categoryName: 'Appliances',
      brand: 'CremaMaster',
      mrp: 8999,
      price: 7999,
      stock: 22,
      ratings: 4.9,
      numReviews: 61,
      badge: 'MEGA SAVINGS',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Commercial 15-bar Italian pressure pump with micro-foam milk wand for authentic silky lattes and dense crema espressos at home.',
      highlights: ['15-Bar Italian high-pressure extraction', 'Commercial 360-degree steam wand', 'PID precision temperature control', 'Pre-infusion technology'],
      defaultPriceTiers: [
        { memberCount: 1, price: 7999, discountPercent: 11 },
        { memberCount: 5, price: 6999, discountPercent: 22 },
        { memberCount: 10, price: 5999, discountPercent: 33 },
        { memberCount: 20, price: 5299, discountPercent: 41 }
      ]
    },
    {
      title: 'Smart HEPA-13 Air Purifier with Ionizer',
      categoryName: 'Appliances',
      brand: 'AeroPure',
      mrp: 6499,
      price: 5499,
      stock: 30,
      ratings: 4.7,
      numReviews: 44,
      badge: 'HEALTH FIRST',
      images: [
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'True HEPA H13 filtration removes 99.97% of airborne PM2.5, pet dander, viruses, and smoke with whisper-quiet sleep mode.',
      highlights: ['Real-time PM2.5 laser sensor', 'CADR 320 m³/h covers large living rooms', 'WiFi app & Alexa control', 'Sleep mode under 24dB'],
      defaultPriceTiers: [
        { memberCount: 1, price: 5499, discountPercent: 15 },
        { memberCount: 5, price: 4699, discountPercent: 27 },
        { memberCount: 10, price: 3999, discountPercent: 38 }
      ]
    },

    // Grocery
    {
      title: 'Single-Origin Arabica Whole Bean Coffee (1kg)',
      categoryName: 'Grocery',
      brand: 'Chikmagalur Roasters',
      mrp: 1299,
      price: 1099,
      stock: 80,
      ratings: 4.8,
      numReviews: 82,
      badge: 'COMMUNITY PICK',
      images: [
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Shade-grown at 4,200ft in Western Ghats, medium roasted with notes of dark cocoa, almond, and subtle honey sweetness.',
      highlights: ['100% Specialty Grade Arabica', 'Small batch freshly roasted', 'Nitrogen-flushed valve bag', 'Direct trade certified'],
      defaultPriceTiers: [
        { memberCount: 1, price: 1099, discountPercent: 15 },
        { memberCount: 5, price: 899, discountPercent: 30 },
        { memberCount: 10, price: 749, discountPercent: 42 }
      ]
    },
    {
      title: 'Wild Forest Raw Organic Honey (500g Pack of 2)',
      categoryName: 'Grocery',
      brand: 'NaturePure',
      mrp: 899,
      price: 749,
      stock: 65,
      ratings: 4.7,
      numReviews: 39,
      badge: 'ORGANIC',
      images: [
        'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Unprocessed, unpasteurized natural honey collected from forest beehives, naturally loaded with enzymes and propolis.',
      highlights: ['Zero added sugar or syrup', 'Naturally crystallized richness', 'Glass jar preservation', 'NMR tested pure'],
      defaultPriceTiers: [
        { memberCount: 1, price: 749, discountPercent: 16 },
        { memberCount: 5, price: 599, discountPercent: 33 },
        { memberCount: 10, price: 499, discountPercent: 44 }
      ]
    },

    // Fitness
    {
      title: 'Eco-Grip Alignment Natural Rubber Yoga Mat',
      categoryName: 'Fitness',
      brand: 'PranaMotion',
      mrp: 2199,
      price: 1899,
      stock: 45,
      ratings: 4.8,
      numReviews: 47,
      badge: 'HOT DEAL',
      images: [
        'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80'
      ],
      description: '6mm high-density natural tree rubber with laser-etched precision alignment markers and non-slip sweat traction.',
      highlights: ['Non-slip polyurethane surface', 'Laser alignment guide', 'Biodegradable natural rubber', 'Includes carry strap'],
      defaultPriceTiers: [
        { memberCount: 1, price: 1899, discountPercent: 13 },
        { memberCount: 5, price: 1599, discountPercent: 27 },
        { memberCount: 10, price: 1299, discountPercent: 40 }
      ]
    },
    {
      title: 'Adjustable Quick-Select Dumbbell (2.5kg - 24kg)',
      categoryName: 'Fitness',
      brand: 'IronForge',
      mrp: 7999,
      price: 6999,
      stock: 18,
      ratings: 4.9,
      numReviews: 31,
      badge: 'HEAVYWEIGHT',
      images: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Dial selection system replaces 15 sets of dumbbells in one compact space-saving iron setup.',
      highlights: ['Replaces 15 weights in 1 unit', 'Smooth mechanical turn dial', 'Molded steel plates with quiet coating', 'Heavy-duty storage tray'],
      defaultPriceTiers: [
        { memberCount: 1, price: 6999, discountPercent: 12 },
        { memberCount: 5, price: 5999, discountPercent: 25 },
        { memberCount: 10, price: 4999, discountPercent: 37 }
      ]
    },

    // Accessories
    {
      title: 'Full Grain Leather Executive Messenger Bag',
      categoryName: 'Accessories',
      brand: 'Sartorial Heritage',
      mrp: 5499,
      price: 4699,
      stock: 25,
      ratings: 4.8,
      numReviews: 28,
      badge: 'PREMIUM CRAFT',
      featured: true,
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Hand-burnished vegetable tanned leather with padded 16-inch laptop compartment and antique brass YKK hardware.',
      highlights: ['Full grain vegetable tanned leather', 'Dedicated 16-inch laptop sleeve', 'Reinforced grab handles', 'Aged patina development'],
      defaultPriceTiers: [
        { memberCount: 1, price: 4699, discountPercent: 14 },
        { memberCount: 5, price: 3999, discountPercent: 27 },
        { memberCount: 10, price: 3399, discountPercent: 38 }
      ]
    },
    {
      title: 'Polarized Titanium Aviator Sunglasses',
      categoryName: 'Accessories',
      brand: 'Solstice Optics',
      mrp: 2999,
      price: 2499,
      stock: 40,
      ratings: 4.7,
      numReviews: 36,
      badge: 'TRENDING',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Featherlight Japanese titanium frame with Category 3 polarized lenses providing 100% UV400 glare elimination.',
      highlights: ['18g Featherlight Titanium Frame', 'TAC HD Polarized Lenses', 'Silicon anti-slip nose pads', 'Hard protective leather case'],
      defaultPriceTiers: [
        { memberCount: 1, price: 2499, discountPercent: 16 },
        { memberCount: 5, price: 2099, discountPercent: 30 },
        { memberCount: 10, price: 1699, discountPercent: 43 }
      ]
    }
  ];

  const createdProducts = [];
  for (const prod of productDefinitions) {
    const cat = createdCategories[prod.categoryName];
    const created = await Product.create({
      ...prod,
      category: cat ? cat._id : null,
      slug: prod.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      sku: 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      seo: {
        metaTitle: `${prod.title} | Group Buying Deals`,
        metaDescription: `Buy ${prod.title} at wholesale discounts with community buying.`,
        keywords: [prod.categoryName.toLowerCase(), 'group buy', 'discount', prod.brand.toLowerCase()]
      }
    });
    createdProducts.push(created);
    if (cat) {
      await Category.findByIdAndUpdate(cat._id, { $inc: { productCount: 1 } });
    }
  }

  // 5. Create Realistic Active & Almost-Full Group Deals
  console.log('👥 Creating vibrant Group Deals...');

  // Group Deal 1: AcousticPro Headphones (7/10 members - ALMOST FULL)
  const p1 = createdProducts[0];
  const members1 = demoMembers.slice(0, 7).map((m, idx) => ({
    user: customerUser._id,
    name: m.name,
    avatar: m.avatar,
    joinedAt: new Date(Date.now() - (idx + 1) * 3600000),
    quantity: 1,
    paidAmount: 2099,
    status: 'CONFIRMED'
  }));

  const group1 = await GroupDeal.create({
    product: p1._id,
    productTitle: p1.title,
    productImage: p1.images[0],
    mrp: p1.mrp,
    individualPrice: p1.price,
    currentPrice: 2099, // at 7 members tier 2 is unlocked!
    targetPrice: 1899,
    creator: customerUser._id,
    creatorName: 'Anusha Sharma',
    minMembers: 5,
    maxMembers: 10,
    currentMembers: 7,
    members: members1,
    priceTiers: [
      { memberCount: 1, price: 2699, discountPercent: 10 },
      { memberCount: 5, price: 2399, discountPercent: 20 },
      { memberCount: 7, price: 2099, discountPercent: 30 },
      { memberCount: 10, price: 1899, discountPercent: 37 }
    ],
    status: 'ALMOST_FULL',
    startTime: new Date(Date.now() - 24 * 3600000),
    endTime: new Date(Date.now() + 18 * 3600000),
    shareCode: 'GRP-HEADPHONES-7'
  });
  await Product.findByIdAndUpdate(p1._id, { $inc: { activeGroupsCount: 1 } });

  // Group Deal 2: Titanium Smart Watch (14/20 members)
  const p2 = createdProducts[1];
  const members2 = [...demoMembers, ...demoMembers.slice(0, 6)].map((m, idx) => ({
    user: customerUser._id,
    name: m.name,
    avatar: m.avatar,
    joinedAt: new Date(Date.now() - (idx + 1) * 1800000),
    quantity: 1,
    paidAmount: 3599,
    status: 'CONFIRMED'
  }));

  const group2 = await GroupDeal.create({
    product: p2._id,
    productTitle: p2.title,
    productImage: p2.images[0],
    mrp: p2.mrp,
    individualPrice: p2.price,
    currentPrice: 3599,
    targetPrice: 3199,
    creator: adminUser._id,
    creatorName: 'Rahul Verma',
    minMembers: 5,
    maxMembers: 20,
    currentMembers: 14,
    members: members2,
    priceTiers: p2.defaultPriceTiers,
    status: 'ACTIVE',
    startTime: new Date(Date.now() - 36 * 3600000),
    endTime: new Date(Date.now() + 12 * 3600000),
    shareCode: 'GRP-WATCH-14'
  });
  await Product.findByIdAndUpdate(p2._id, { $inc: { activeGroupsCount: 1 } });

  // Group Deal 3: Lumiglow Vitamin C Serum (9/10 members - 1 MORE PERSON NEEDED!)
  const p3 = createdProducts.find(p => p.title.includes('Lumiglow'));
  if (p3) {
    const members3 = demoMembers.concat(demoMembers.slice(0, 1)).map((m, idx) => ({
      user: customerUser._id,
      name: m.name,
      avatar: m.avatar,
      joinedAt: new Date(Date.now() - idx * 1200000),
      quantity: 1,
      paidAmount: 549,
      status: 'CONFIRMED'
    }));

    await GroupDeal.create({
      product: p3._id,
      productTitle: p3.title,
      productImage: p3.images[0],
      mrp: p3.mrp,
      individualPrice: p3.price,
      currentPrice: 549,
      targetPrice: 449,
      creator: customerUser._id,
      creatorName: 'Anusha Sharma',
      minMembers: 5,
      maxMembers: 10,
      currentMembers: 9,
      members: members3,
      priceTiers: p3.defaultPriceTiers,
      status: 'ALMOST_FULL',
      startTime: new Date(Date.now() - 10 * 3600000),
      endTime: new Date(Date.now() + 6 * 3600000),
      shareCode: 'GRP-SERUM-9'
    });
    await Product.findByIdAndUpdate(p3._id, { $inc: { activeGroupsCount: 1 } });
  }

  // Group Deal 4: Barista Espresso Machine (3/5 members)
  const p4 = createdProducts.find(p => p.title.includes('Barista'));
  if (p4) {
    await GroupDeal.create({
      product: p4._id,
      productTitle: p4.title,
      productImage: p4.images[0],
      mrp: p4.mrp,
      individualPrice: p4.price,
      currentPrice: 7999,
      targetPrice: 5299,
      creator: managerUser._id,
      creatorName: 'Kavita Nair',
      minMembers: 5,
      maxMembers: 10,
      currentMembers: 3,
      members: demoMembers.slice(0, 3).map((m, idx) => ({
        user: customerUser._id,
        name: m.name,
        avatar: m.avatar,
        joinedAt: new Date(),
        quantity: 1,
        paidAmount: 7999,
        status: 'CONFIRMED'
      })),
      priceTiers: p4.defaultPriceTiers,
      status: 'ACTIVE',
      startTime: new Date(Date.now() - 5 * 3600000),
      endTime: new Date(Date.now() + 32 * 3600000),
      shareCode: 'GRP-COFFEE-3'
    });
    await Product.findByIdAndUpdate(p4._id, { $inc: { activeGroupsCount: 1 } });
  }

  // 6. Create Visual Discount Rules (Section 12, 13)
  console.log('⚡ Creating Visual Discount Rules...');
  await DiscountRule.create([
    {
      name: 'Mega Group Buy Booster (10+ Members)',
      description: 'Automatically awards 15% extra discount when a group reaches 10+ buyers on orders above ₹2,000.',
      conditions: {
        minGroupMembers: 10,
        minOrderValue: 2000,
        userType: 'ALL'
      },
      actions: {
        discountType: 'PERCENT',
        discountValue: 15,
        maxDiscountCap: 1500
      },
      priority: 10,
      isActive: true
    },
    {
      name: 'Bulk Community 20+ Unlock',
      description: 'Wholesale clearance tier for large pooling groups exceeding 20 members.',
      conditions: {
        minGroupMembers: 20,
        minOrderValue: 3000,
        userType: 'ALL'
      },
      actions: {
        discountType: 'PERCENT',
        discountValue: 25,
        maxDiscountCap: 3000
      },
      priority: 9,
      isActive: true
    },
    {
      name: 'First-Order VIP Welcome',
      description: 'Flat ₹300 off on all carts above ₹1,500 for new shoppers.',
      conditions: {
        minGroupMembers: 0,
        minOrderValue: 1500,
        userType: 'NEW_USER'
      },
      actions: {
        discountType: 'FIXED',
        discountValue: 300,
        maxDiscountCap: 300
      },
      priority: 5,
      isActive: true
    }
  ]);

  // 7. Create Coupons (Section 14)
  console.log('🎟️ Creating Coupons...');
  const nextMonth = new Date(Date.now() + 30 * 24 * 3600000);
  await Coupon.create([
    {
      code: 'GROUP15',
      description: '15% instant savings on any active Group Deal',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 999,
      maxDiscount: 750,
      endDate: nextMonth,
      isGroupOnly: true,
      isActive: true
    },
    {
      code: 'SUPER500',
      description: 'Flat ₹500 OFF on orders exceeding ₹2,999',
      discountType: 'FIXED',
      discountValue: 500,
      minOrderValue: 2999,
      maxDiscount: 500,
      endDate: nextMonth,
      isGroupOnly: false,
      isActive: true
    },
    {
      code: 'WELCOME10',
      description: '10% OFF for all community members on your entire cart',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 499,
      maxDiscount: 500,
      endDate: nextMonth,
      isGroupOnly: false,
      isActive: true
    },
    {
      code: 'FESTIVE25',
      description: 'Special festival reward coupon - 25% discount',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minOrderValue: 3500,
      maxDiscount: 1500,
      endDate: nextMonth,
      isGroupOnly: false,
      isActive: true
    }
  ]);

  // 8. Create Realistic Demo Orders (for charts and order history)
  console.log('📦 Creating Sample Historical Orders...');
  const order1 = await Order.create({
    orderNumber: 'ORD-84265-1029',
    user: customerUser._id,
    items: [{
      product: p1._id,
      title: p1.title,
      image: p1.images[0],
      price: 2099,
      mrp: p1.mrp,
      quantity: 1,
      isGroupBuy: true,
      groupDeal: group1._id
    }],
    shippingAddress: {
      street: '42, Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
      phone: '+91 98333 44455'
    },
    paymentInfo: {
      method: 'RAZORPAY',
      transactionId: 'TXN-RZP9812471',
      status: 'SUCCESS',
      paidAt: new Date(Date.now() - 2 * 86400000)
    },
    pricing: {
      subtotal: 2099,
      groupSavings: 900,
      couponDiscount: 0,
      deliveryFee: 0,
      tax: 105,
      total: 2204
    },
    status: 'SHIPPED',
    groupDeal: group1._id,
    trackingHistory: [
      { status: 'PLACED', message: 'Order received and group participation confirmed.', timestamp: new Date(Date.now() - 2 * 86400000) },
      { status: 'CONFIRMED', message: 'Group milestone locked. Item allocated.', timestamp: new Date(Date.now() - 36 * 3600000) },
      { status: 'SHIPPED', message: 'Dispatched via BlueDart Express (Air AWB #78192019).', timestamp: new Date(Date.now() - 12 * 3600000) }
    ]
  });

  // 9. Create Notifications
  await Notification.create([
    {
      user: customerUser._id,
      title: '🎉 Price Dropped to ₹2,099!',
      message: '7 members joined AcousticPro ANC Headphones! Your final price is locked at ₹2,099.',
      type: 'TIER_UNLOCKED',
      link: `/group/${group1._id}`,
      read: false
    },
    {
      user: customerUser._id,
      title: '📦 Order Dispatched',
      message: 'Your order #ORD-84265-1029 has been handed over to BlueDart express courier.',
      type: 'ORDER_UPDATE',
      link: `/orders/${order1._id}`,
      read: false
    },
    {
      user: customerUser._id,
      title: '⚡ 1 Member Needed!',
      message: 'Lumiglow Vitamin C serum needs only 1 more member to unlock the lowest tier at ₹449!',
      type: 'ALMOST_FULL',
      link: `/group/${group1._id}`,
      read: true
    }
  ]);

  // 10. Reviews
  await Review.create([
    {
      product: p1._id,
      user: customerUser._id,
      userName: 'Anusha Sharma',
      userAvatar: customerUser.avatar,
      rating: 5,
      title: 'Unbelievable savings with group buy!',
      comment: 'Saved nearly ₹900 compared to other e-commerce sites! Sound quality is punchy and ANC cuts out metro noise effortlessly. Delivery took just 2 days after group completed.',
      isVerifiedPurchase: true,
      helpfulVotes: 19
    },
    {
      product: p1._id,
      user: adminUser._id,
      userName: 'Rahul Verma',
      userAvatar: demoMembers[0].avatar,
      rating: 5,
      title: 'Best audio deal in India right now',
      comment: 'The group buying mechanic is super fun and transparent. Watched the price drop in real time as 4 colleagues joined my invite link on WhatsApp!',
      isVerifiedPurchase: true,
      helpfulVotes: 14
    }
  ]);

  console.log('✅ Seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('Admin:    admin@groupbuy.com    / admin123');
  console.log('Customer: anusha@customer.com   / customer123');
  console.log('Manager:  manager@groupbuy.com  / manager123');
  console.log('----------------------------------------------------');
};

// If executed directly
if (process.argv[1]?.includes('seed.js')) {
  import('../config/db.js').then(async ({ connectDB, closeDB }) => {
    await connectDB();
    await seedDatabase();
    await closeDB();
    process.exit(0);
  });
}
