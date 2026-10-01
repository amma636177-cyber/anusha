import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Award, Check } from 'lucide-react';
import api from '../../utils/api.js';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/users${search ? `?search=${search}` : ''}`);
      if (res.success) setUsers(res.users || []);
    } catch (e) {
      console.warn('Users load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      loadUsers();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Customer & Role Management</h1>
          <p className="text-xs text-stone-500">Manage user authorization, loyalty tiers, and referral balances</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-premium-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Loyalty Tier</th>
              <th className="py-3 px-4">Reward Points</th>
              <th className="py-3 px-4">Referral Code</th>
              <th className="py-3 px-4">Role Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-stone-50/60 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                      alt={u.name}
                      className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                    />
                    <div>
                      <p className="font-bold text-stone-900">{u.name}</p>
                      <span className="text-[10px] text-stone-400">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[10px]">
                    {u.loyaltyTier || 'Silver'}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-stone-900">
                  {u.rewardPoints || 0} pts
                </td>
                <td className="py-3 px-4 font-mono font-bold text-stone-700">
                  {u.referralCode || '-'}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-stone-50 font-bold px-2.5 py-1 rounded-lg border border-stone-200 text-xs cursor-pointer"
                  >
                    <option value="customer">customer</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
