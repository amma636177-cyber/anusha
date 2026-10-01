import React, { useState, useEffect } from 'react';
import {
  Star, Users, ShieldCheck, Truck, ArrowRight, Zap, ShoppingCart,
  Heart, Sparkles, CheckCircle2, ChevronRight, Share2, Plus
} from 'lucide-react';
import api from '../../utils/api.js';
import { useCart } from '../../context/CartContext.jsx';
import PriceTierStepper from '../../components/PriceTierStepper.jsx';

export const ProductDetailPage = ({ productId, onNavigate, onJoinGroup }) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeGroups, setActiveGroups] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creatingGroup, setCreatingGroup] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const [prodRes, groupsRes, revRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get(`/ai/product-groups/${productId}`),
          api.get(`/reviews/product/${productId}`)
        ]);

        if (prodRes.success) setProduct(prodRes.product);
        if (groupsRes.success) setActiveGroups(groupsRes.groups || []);
        if (revRes.success) setReviews(revRes.reviews || []);
      } catch (e) {
        console.warn('Product load error:', e.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [productId]);

  const handleStartGroup = async () => {
    try {
      setCreatingGroup(true);
      const res = await api.post('/groups', {
        productId: product._id,
        durationHours: 48
      });
      if (res.success && res.groupDeal) {
        onNavigate('group-detail', { id: res.groupDeal._id });
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setCreatingGroup(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-xs text-stone-500 font-medium">Loading product details and active buyer pools...</p>
      </div>
    );
  }

  if (!product) return null;

  const lowestGroupPrice = product.defaultPriceTiers?.length
    ? Math.min(...product.defaultPriceTiers.map(t => t.price))
    : product.price;

  const savings = product.price - lowestGroupPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => onNavigate('home')} className="hover:text-stone-900 cursor-pointer">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('products', { category: product.category?.slug })} className="hover:text-stone-900 cursor-pointer">
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-stone-800 font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-premium-sm">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === idx ? 'border-emerald-600 shadow-sm' : 'border-stone-200 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Value props */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
            <div>
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-stone-900 block">Brand Warranty</span>
              <span className="text-[10px] text-stone-400">1 Year Official</span>
            </div>
            <div>
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-stone-900 block">Free Shipping</span>
              <span className="text-[10px] text-stone-400">On group orders</span>
            </div>
            <div>
              <Sparkles className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-stone-900 block">Lowest Guarantee</span>
              <span className="text-[10px] text-stone-400">Group wholesale</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Tiers, Group Buying Options */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-xs text-stone-600 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{product.ratings}</span>
                <span className="text-stone-400">({product.numReviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {product.title}
            </h1>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-4">
            <div className="flex items-baseline justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Group Buy Price (Lowest Tier)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900">
                    ₹{lowestGroupPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save ₹{(product.mrp - lowestGroupPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">Individual Buy</span>
                <span className="text-base font-bold text-stone-700">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Price Tiers Stepper */}
            <PriceTierStepper
              priceTiers={product.defaultPriceTiers}
              currentMembers={1}
              currentPrice={lowestGroupPrice}
            />

            {/* SECTION 16: AI GROUP MATCHING - Active Groups for this product */}
            <div className="pt-2 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Community Pools ({activeGroups.length})
                </span>
                <span className="text-[11px] text-stone-500">Join to lock current savings immediately</span>
              </div>

              {activeGroups.length === 0 ? (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                  <p className="text-xs text-stone-500 mb-2">No active groups for this product yet.</p>
                  <button
                    onClick={handleStartGroup}
                    disabled={creatingGroup}
                    className="py-2 px-4 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Start the First Group Deal
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeGroups.map((grp) => (
                    <div
                      key={grp.id}
                      onClick={() => onNavigate('group-detail', { id: grp.id })}
                      className="flex items-center justify-between p-3 bg-stone-50 hover:bg-emerald-50/40 rounded-2xl border border-stone-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                          {grp.currentMembers}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-stone-900">{grp.creatorName}'s Pool</span>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                              {grp.urgencyLabel}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 font-medium">
                            Current price: ₹{grp.currentPrice?.toLocaleString('en-IN')} (Target: ₹{grp.targetPrice?.toLocaleString('en-IN')})
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('group-detail', { id: grp.id });
                        }}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <span>Join</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={handleStartGroup}
                disabled={creatingGroup}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-premium-sm"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Start New Group</span>
              </button>

              <button
                onClick={() => addToCart({ productId: product._id, isGroupBuy: false, productTitle: product.title })}
                className="py-3 px-4 bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-stone-500" />
                <span>Buy Individual (₹{product.price.toLocaleString('en-IN')})</span>
              </button>
            </div>
          </div>

          {/* Highlights & Bullet Points */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Key Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900">Verified Customer Reviews ({reviews.length})</h3>
              <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{product.ratings} out of 5</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-stone-400 py-3">No reviews written yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-3 pt-2">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{rev.userName}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-semibold text-stone-800">{rev.title}</p>
                    <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
