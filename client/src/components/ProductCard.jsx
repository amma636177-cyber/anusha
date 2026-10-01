import React from 'react';
import { Star, Users, ArrowUpRight, Zap, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export const ProductCard = ({ product, onViewDetails, onQuickJoinGroup }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  // Calculate lowest group tier price
  const lowestGroupPrice = product.defaultPriceTiers?.length
    ? Math.min(...product.defaultPriceTiers.map(t => t.price))
    : product.price;

  const maxDiscountPercent = Math.round(((product.mrp - lowestGroupPrice) / product.mrp) * 100);
  const targetTier = product.defaultPriceTiers?.[product.defaultPriceTiers.length - 1];

  return (
    <div className="group bg-white rounded-2xl border border-stone-200 p-3.5 hover:shadow-premium-md hover:border-stone-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Image wrapper */}
        <div
          onClick={() => onViewDetails && onViewDetails(product._id || product.slug)}
          className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 cursor-pointer mb-3"
        >
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Discount Pill */}
          <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {maxDiscountPercent}% OFF
          </span>

          {/* Category / Badge */}
          {product.badge && (
            <span className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Brand & Ratings */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
          <span className="font-semibold tracking-wide uppercase text-[10px] text-stone-600">{product.brand || product.categoryName}</span>
          <div className="flex items-center gap-1 font-medium text-stone-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{product.ratings || 4.7}</span>
            <span className="text-stone-400">({product.numReviews || 12})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onViewDetails && onViewDetails(product._id || product.slug)}
          className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug cursor-pointer hover:text-emerald-700 transition-colors mb-2"
        >
          {product.title}
        </h3>

        {/* Pricing Area */}
        <div className="bg-stone-50/70 border border-stone-100 rounded-xl p-2.5 mb-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Group Buy Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-stone-900">₹{lowestGroupPrice.toLocaleString('en-IN')}</span>
                <span className="text-xs text-stone-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-stone-500 block">Individual</span>
              <span className="text-xs font-semibold text-stone-700">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Group buying insight */}
          {targetTier && (
            <div className="mt-1.5 pt-1.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
              <span className="text-stone-600 flex items-center gap-1 font-medium">
                <Users className="w-3 h-3 text-emerald-600" /> Unlock at {targetTier.memberCount} members
              </span>
              <span className="font-bold text-emerald-700">Save ₹{(product.mrp - lowestGroupPrice).toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <button
          onClick={() => onViewDetails && onViewDetails(product._id || product.slug)}
          className="w-full py-2 px-3 text-xs font-bold text-stone-800 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
        >
          View Deal
        </button>
        <button
          onClick={() => {
            if (onQuickJoinGroup) {
              onQuickJoinGroup(product);
            } else if (onViewDetails) {
              onViewDetails(product._id || product.slug);
            }
          }}
          className="w-full py-2 px-3 text-xs font-bold text-white bg-stone-900 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-premium-sm"
        >
          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>Join Group</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
