import React, { useState } from 'react';
import { X, Lock, Mail, User, Gift, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, quickLoginAs } = useAuth();
  const [tab, setTab] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (tab === 'LOGIN') {
        await login(email, password);
      } else {
        await register(name, email, password, referralCode);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (demoEmail, demoPass) => {
    setError('');
    setLoading(true);
    try {
      await quickLoginAs(demoEmail, demoPass);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-premium-lg max-w-sm w-full overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-stone-900">
              {tab === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 mx-4 mt-4 bg-stone-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => { setTab('LOGIN'); setError(''); }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'LOGIN' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('REGISTER'); setError(''); }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === 'REGISTER' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {tab === 'REGISTER' && (
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-stone-50 pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:border-stone-400"
                />
                <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-stone-50 pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:border-stone-400"
              />
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-stone-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-50 pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:border-stone-400"
              />
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {tab === 'REGISTER' && (
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">Referral Code (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. ANUSHA99 (+100 pts)"
                  className="w-full bg-stone-50 pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:bg-white focus:outline-none focus:border-stone-400 uppercase"
                />
                <Gift className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-premium-sm flex items-center justify-center gap-1.5"
          >
            <span>{tab === 'LOGIN' ? 'Sign In' : 'Join PoolBuy'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block mb-2 text-center">
            Or Click to Fast Login Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoSelect('anusha@customer.com', 'customer123')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-800 text-[11px] font-bold rounded-lg border border-stone-200 transition-colors"
            >
              Shopper (Anusha)
            </button>
            <button
              onClick={() => handleDemoSelect('admin@groupbuy.com', 'admin123')}
              className="py-1.5 px-2 bg-white hover:bg-stone-100 text-stone-800 text-[11px] font-bold rounded-lg border border-stone-200 transition-colors"
            >
              Platform Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
