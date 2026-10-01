import React, { useState, useEffect } from 'react';
import { Flame, Clock, Users, Sparkles, Filter } from 'lucide-react';
import api from '../../utils/api.js';
import GroupDealCard from '../../components/GroupDealCard.jsx';

export const GroupDealsPage = ({ onNavigate, onJoinGroup }) => {
  const [deals, setDeals] = useState([]);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ALMOST_FULL' | 'ACTIVE'
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);

  const loadDeals = async () => {
    try {
      setLoading(true);
      let url = `/groups?sort=${sort}`;
      if (filter !== 'ALL') url += `&status=${filter}`;

      const res = await api.get(url);
      if (res.success) {
        setDeals(res.groupDeals || []);
      }
    } catch (e) {
      console.warn('Group deals fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, [filter, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Active Group Deals
            </h1>
            <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
              Live Demand Pooling
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Team up with fellow buyers to unlock wholesale price tiers. The more people join, the lower the price drops.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filter === 'ALL' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
              }`}
            >
              All Pools
            </button>
            <button
              onClick={() => setFilter('ALMOST_FULL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                filter === 'ALMOST_FULL' ? 'bg-white text-orange-700 shadow-2xs font-bold' : 'text-stone-600'
              }`}
            >
              <span>Almost Full</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            </button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none cursor-pointer"
          >
            <option value="popular">Most Joined</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="discount">Highest Savings</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
          <p className="text-stone-400 text-sm mb-2">No group deals found for this filter</p>
          <button
            onClick={() => setFilter('ALL')}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            View all deals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <GroupDealCard
              key={deal._id}
              deal={deal}
              onJoin={() => onJoinGroup(deal)}
              onViewDetails={() => onNavigate('group-detail', { id: deal._id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDealsPage;
