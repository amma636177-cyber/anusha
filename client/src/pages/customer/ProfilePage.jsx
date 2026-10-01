import React, { useState } from 'react';
import {
  User, Award, Gift, Copy, Check, MapPin, Plus, LogOut,
  ShieldCheck, Share2, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const ProfilePage = ({ onNavigate }) => {
  const { user, logout, quickLoginAs } = useAuth();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = user?.referralCode || 'ANUSHA99';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎉 Hey! Join PoolBuy and unlock massive group buying discounts! Use my invite code ${referralCode} to get 150 bonus reward points on signup: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-premium-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
            alt={user?.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-stone-200 shrink-0"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900">{user?.name}</h1>
                <p className="text-xs text-stone-500">{user?.email} • {user?.phone}</p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  ★ {user?.loyaltyTier || 'Silver'} Member
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {user?.rewardPoints || 350} Pts
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-500 pt-1">
              Member of the PoolBuy community since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}.
            </p>
          </div>
        </div>
      </div>

      {/* Referral & Rewards Engine (Section 31 & 32) */}
      <div className="bg-gradient-to-br from-amber-50/70 via-white to-stone-50 rounded-3xl border border-amber-200/90 p-6 shadow-premium-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Refer & Earn 200 Points</h3>
            <p className="text-xs text-stone-500">
              Give your friends 150 points upon registration, and earn 200 points when they complete their first group buy!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Code box */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Your Referral Code</span>
              <span className="text-sm font-black text-stone-900 tracking-wider">{referralCode}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* WhatsApp share */}
          <button
            onClick={handleShareWhatsApp}
            className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-premium-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Invite Friends on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Address Book */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-premium-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900">Saved Addresses</h3>
          </div>
          <button className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(user?.addresses?.length ? user.addresses : [
            { street: '42, Indiranagar 100ft Road', city: 'Bengaluru', state: 'Karnataka', postalCode: '560038', isDefault: true }
          ]).map((addr, idx) => (
            <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-stone-900">Home Address</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-stone-600 leading-relaxed">
                {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
              </p>
              <span className="text-[10px] text-stone-400 block pt-1">India</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo fast role switcher */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-premium-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Switch Demo Account</h3>
        <p className="text-xs text-stone-500">Test different user roles and administrative dashboards instantly:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => quickLoginAs('anusha@customer.com', 'customer123')}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold"
          >
            Shopper (Anusha)
          </button>
          <button
            onClick={() => quickLoginAs('admin@groupbuy.com', 'admin123')}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
          >
            Platform Administrator
          </button>
          <button
            onClick={() => quickLoginAs('manager@groupbuy.com', 'manager123')}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs font-bold"
          >
            Operations Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
