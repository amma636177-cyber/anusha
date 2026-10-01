import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle2, AlertCircle, Share2, Flame } from 'lucide-react';
import api from '../../utils/api.js';
import ProgressBar from '../../components/ProgressBar.jsx';

export const AdminGroupDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/groups?status=ACTIVE');
      if (res.success) setDeals(res.groupDeals || []);
    } catch (e) {
      console.warn('Admin group deals fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Active Group Deals Monitoring</h1>
        <p className="text-xs text-stone-500">Real-time status of pooling thresholds, target locks, and member growth</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.map((deal) => (
          <div key={deal._id} className="bg-white rounded-3xl border border-stone-200 p-5 shadow-premium-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Pool #{deal.shareCode}
                </span>
                <h3 className="font-bold text-stone-900 text-sm mt-0.5 line-clamp-1">{deal.productTitle}</h3>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                deal.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {deal.status}
              </span>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 space-y-2">
              <ProgressBar current={deal.currentMembers} max={deal.maxMembers} showLabels={true} size="md" />
              <div className="flex justify-between items-center text-xs pt-1 border-t border-stone-200/60 font-semibold">
                <span className="text-stone-500">Current Price:</span>
                <span className="text-stone-900 font-extrabold">₹{deal.currentPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-xs text-stone-500 space-y-1">
              <div className="flex justify-between">
                <span>Pool Creator:</span>
                <span className="font-bold text-stone-900">{deal.creatorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="font-medium text-stone-700">
                  {new Date(deal.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGroupDeals;
