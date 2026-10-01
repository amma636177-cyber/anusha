import React, { useState, useEffect } from 'react';
import {
  Users, Sparkles, ArrowRight, ShieldCheck, Flame, ShoppingBag,
  Clock, TrendingUp, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import api from '../../utils/api.js';
import ProductCard from '../../components/ProductCard.jsx';
import GroupDealCard from '../../components/GroupDealCard.jsx';

export const HomePage = ({ onNavigate, onJoinGroup }) => {
  const [categories, setCategories] = useState([]);
  const [activeGroups, setActiveGroups] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, groupRes, prodRes, recRes] = await Promise.all([
          api.get('/products/categories'),
          api.get('/groups?status=ACTIVE'),
          api.get('/products?sort=popular'),
          api.get('/ai/recommendations')
        ]);

        if (catRes.success) setCategories(catRes.categories || []);
        if (groupRes.success) setActiveGroups(groupRes.groupDeals || []);
        if (prodRes.success) setFeaturedProducts(prodRes.products || []);
        if (recRes.success) setRecommendations(recRes.recommendations || []);
      } catch (err) {
        console.warn('Home data load error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION (Section 7) */}
      <section className="relative overflow-hidden bg-white border-b border-stone-200/80 pt-8 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Highlight badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Wholesale Tier Pricing For Everyone</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 leading-[1.08]">
                  More People.<br />
                  <span className="text-emerald-600">Lower Prices.</span>
                </h1>
                <p className="text-base sm:text-lg text-stone-600 font-normal max-w-xl leading-relaxed">
                  Join together, unlock better prices, and save more. Team up with community shoppers across India to drop prices tier by tier.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('group-deals')}
                  className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-sm transition-all shadow-premium-md flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span>Explore Group Deals</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 rounded-2xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>

              {/* Metric stats strip */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100 max-w-lg">
                <div>
                  <span className="text-xl sm:text-2xl font-black text-stone-900 block leading-tight">₹8.4L+</span>
                  <span className="text-xs font-medium text-stone-600">Community Saved</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-stone-900 block leading-tight">86+</span>
                  <span className="text-xs font-medium text-stone-600">Active Pools</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 block leading-tight">Up to 45%</span>
                  <span className="text-xs font-medium text-stone-600">Tier Discounts</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card Mockup */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-b from-stone-50 to-white rounded-3xl p-5 border border-stone-200 shadow-premium-lg">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Live Group Deal</span>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    ⚡ 3 spots left
                  </span>
                </div>

                <div className="flex gap-4 items-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=250"
                    alt="Headphones"
                    className="w-24 h-24 rounded-2xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-stone-600 uppercase">AcousticLab Audio</span>
                    <h3 className="font-extrabold text-stone-900 text-sm leading-snug">
                      AcousticPro ANC Wireless Headphones
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-black text-stone-900">₹2,099</span>
                      <span className="text-xs text-stone-400 line-through">₹2,999</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Save ₹900
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live progress preview */}
                <div className="bg-white rounded-2xl p-3.5 border border-stone-200 mb-4 shadow-2xs">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-stone-800">7 of 10 people joined</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                      Next tier: ₹1,899
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '70%' }}></div>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-2 font-medium">
                    Invite 3 more people on WhatsApp to unlock ₹1,899!
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('group-deals')}
                  className="w-full py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-premium-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Join This Group Deal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION (Section 8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Browse group deals and trending products curated across top departments
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => onNavigate('products', { category: cat.slug })}
              className="group bg-white rounded-2xl border border-stone-200 p-3 hover:border-emerald-400 hover:shadow-premium-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden mb-2 bg-stone-100 group-hover:scale-105 transition-transform">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-stone-600 mt-0.5">
                {cat.productCount || 4} items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOT ACTIVE GROUP DEALS (Section 9, 10) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Active Group Deals
              </h2>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                Ending Soon
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              Jump into active pools with other shoppers to lock wholesale tier prices immediately.
            </p>
          </div>
          <button
            onClick={() => onNavigate('group-deals')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Groups</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeGroups.slice(0, 4).map((deal) => (
            <GroupDealCard
              key={deal._id}
              deal={deal}
              onJoin={() => onJoinGroup(deal)}
              onViewDetails={() => onNavigate('group-detail', { id: deal._id })}
            />
          ))}
        </div>
      </section>

      {/* 4. HOW GROUP BUYING WORKS (Trust & Explainer Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700 block mb-1">
              Simple. Transparent. Viral.
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              How PoolBuy Group Buying Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              We aggregate buyer demand directly to manufacturers so you never pay traditional retail markups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-white font-black text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Select a Deal</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Choose any product with group pricing tiers or join an already active buyer pool.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Invite or Pool</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Share on WhatsApp with your friends or let fellow community shoppers join your deal.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Price Drops in Real-Time</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                As more people join, prices drop down tier by tier. Everyone pays the final lowest unlocked price!
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h4 className="font-bold text-stone-900 text-sm mb-1">Delivered to Your Door</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Express insured shipping to each individual address with live order tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AI RECOMMENDATIONS ("Recommended For You" - Section 15) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                Recommended For You
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Personalized picks tailored to your shopping preferences and active group savings
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore AI Picks</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {recommendations.slice(0, 6).map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onViewDetails={(id) => onNavigate('product-detail', { id })}
              onQuickJoinGroup={() => onNavigate('product-detail', { id: prod._id })}
            />
          ))}
        </div>
      </section>

      {/* 6. POPULAR MARKETPLACE PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Trending Products
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Top-rated consumer favorites eligible for group buy discounts
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Shop All Products</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.slice(0, 8).map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onViewDetails={(id) => onNavigate('product-detail', { id })}
              onQuickJoinGroup={() => onNavigate('product-detail', { id: prod._id })}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
