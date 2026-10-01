import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '../../utils/api.js';
import ProductCard from '../../components/ProductCard.jsx';

export const WishlistPage = ({ onNavigate }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wishlist');
      if (res.success && res.wishlist?.products) {
        setWishlistProducts(res.wishlist.products.map(p => p.product).filter(Boolean));
      }
    } catch (e) {
      console.warn('Wishlist load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          My Saved Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Items bookmarked for price drop alerts and group buy opportunities
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-900">Your wishlist is empty</h3>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Tap the heart on any product or group deal to monitor price tier drops.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onViewDetails={(id) => onNavigate('product-detail', { id })}
              onQuickJoinGroup={() => onNavigate('product-detail', { id: prod._id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
