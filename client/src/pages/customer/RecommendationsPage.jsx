import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Filter } from 'lucide-react';
import api from '../../utils/api.js';
import ProductCard from '../../components/ProductCard.jsx';

export const RecommendationsPage = ({ onNavigate }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/ai/recommendations');
        if (res.success) {
          setRecommendations(res.recommendations || []);
        }
      } catch (e) {
        console.warn('AI Recs fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-700" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            AI Personalized Recommendations
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600">
          Curated specifically using your browsing patterns, purchase history, and active community group pooling
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((prod) => (
            <div key={prod._id} className="bg-white rounded-3xl border border-stone-200 p-4 shadow-premium-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-all">
              <div className="flex gap-4">
                <img
                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                  alt={prod.title}
                  className="w-24 h-24 rounded-2xl object-cover bg-stone-100 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">{prod.brand}</span>
                  <h3 className="font-bold text-stone-900 text-sm line-clamp-2 leading-snug">{prod.title}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-black text-stone-900">₹{prod.groupPrice?.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-stone-400 line-through">₹{prod.mrp?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Save ₹{prod.savings?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Reason Badge */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-100 text-xs text-stone-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">{prod.aiReason}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onNavigate('product-detail', { id: prod._id })}
                  className="py-2.5 px-3 bg-white hover:bg-stone-50 text-stone-900 text-xs font-bold rounded-xl border border-stone-200 transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => onNavigate('product-detail', { id: prod._id })}
                  className="py-2.5 px-3 bg-stone-900 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Join Pool</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
