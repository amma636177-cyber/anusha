import React, { useState, useEffect } from 'react';
import {
  Percent, Plus, Trash2, Play, CheckCircle2, AlertCircle,
  Sliders, ShieldAlert, Sparkles, ArrowRight
} from 'lucide-react';
import api from '../../utils/api.js';

export const AdminDiscountEngine = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Visual Builder State
  const [newRule, setNewRule] = useState({
    name: 'Weekend Flash Group Booster',
    description: 'Promotional discount triggered when group pool size expands',
    conditions: {
      minGroupMembers: 10,
      minOrderValue: 2000,
      userType: 'ALL'
    },
    actions: {
      discountType: 'PERCENT',
      discountValue: 15,
      maxDiscountCap: 1500
    },
    priority: 10
  });

  // Simulator State
  const [simInput, setSimInput] = useState({ members: 10, orderValue: 2500 });
  const [simResult, setSimResult] = useState(null);

  const loadRules = async () => {
    try {
      setLoading(true);
      const res = await api.get('/discounts/rules');
      if (res.success) setRules(res.rules || []);
    } catch (e) {
      console.warn('Error loading discount rules:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/discounts/rules', newRule);
      if (res.success) {
        loadRules();
        alert('Visual Discount Rule created and deployed to engine!');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Delete this discount rule?')) return;
    try {
      await api.delete(`/discounts/rules/${id}`);
      loadRules();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleToggleRule = async (rule) => {
    try {
      await api.put(`/discounts/rules/${rule._id}`, { isActive: !rule.isActive });
      loadRules();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRunSimulator = async () => {
    try {
      const res = await api.post('/discounts/evaluate', {
        groupMembers: simInput.members,
        orderValue: simInput.orderValue
      });
      if (res.success) {
        setSimResult(res.result);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">Visual Discount Rule Builder</h1>
        <p className="text-xs text-stone-500">
          Build declarative IF/THEN pricing conditions without code for dynamic group promotions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Rule Builder Panel (Section 13) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200 shadow-premium-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-stone-900">Visual Rule Constructor</h2>
            </div>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Engine v2.4</span>
          </div>

          <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Rule Name</label>
              <input
                type="text"
                required
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            {/* IF BLOCK */}
            <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3">
              <span className="text-[11px] font-extrabold text-orange-800 uppercase tracking-wider block">
                IF Conditions:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Group Pool Size &gt;=
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRule.conditions.minGroupMembers}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: { ...newRule.conditions, minGroupMembers: Number(e.target.value) }
                    })}
                    className="w-full bg-white px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Order Value (₹) &gt;=
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={newRule.conditions.minOrderValue}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      conditions: { ...newRule.conditions, minOrderValue: Number(e.target.value) }
                    })}
                    className="w-full bg-white px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* THEN ACTION BLOCK */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider block">
                THEN Apply Discount Action:
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Discount Type</label>
                  <select
                    value={newRule.actions.discountType}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      actions: { ...newRule.actions, discountType: e.target.value }
                    })}
                    className="w-full bg-white px-2 py-1.5 border border-stone-200 rounded-lg text-xs font-bold"
                  >
                    <option value="PERCENT">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Value</label>
                  <input
                    type="number"
                    min="1"
                    value={newRule.actions.discountValue}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      actions: { ...newRule.actions, discountValue: Number(e.target.value) }
                    })}
                    className="w-full bg-white px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={newRule.actions.maxDiscountCap}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      actions: { ...newRule.actions, maxDiscountCap: Number(e.target.value) }
                    })}
                    className="w-full bg-white px-3 py-1.5 border border-stone-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-premium-sm"
            >
              Deploy Discount Rule to Production Engine
            </button>
          </form>
        </div>

        {/* Right Column: Simulator & Active Rules */}
        <div className="lg:col-span-5 space-y-6">
          {/* Rule Simulator */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                Live Rule Simulator
              </span>
              <span className="text-[10px] text-stone-400">Sandbox Test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-stone-500 font-bold block mb-1">Test Group Members</label>
                <input
                  type="number"
                  value={simInput.members}
                  onChange={(e) => setSimInput({ ...simInput, members: Number(e.target.value) })}
                  className="w-full bg-stone-50 px-2 py-1.5 border border-stone-200 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-stone-500 font-bold block mb-1">Test Order Value (₹)</label>
                <input
                  type="number"
                  value={simInput.orderValue}
                  onChange={(e) => setSimInput({ ...simInput, orderValue: Number(e.target.value) })}
                  className="w-full bg-stone-50 px-2 py-1.5 border border-stone-200 rounded-lg font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleRunSimulator}
              className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition-colors cursor-pointer"
            >
              Simulate Pricing Breakdown
            </button>

            {simResult && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600 font-medium">Calculated Discount:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    -₹{simResult.totalRuleDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-500">
                  <span>Net Payable Amount:</span>
                  <span className="font-extrabold text-stone-900">
                    ₹{(simInput.orderValue - simResult.totalRuleDiscount).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-1 text-[10px] text-stone-400">
                  Applied Rules: {simResult.appliedRules.map(r => r.name).join(', ') || 'None matched'}
                </div>
              </div>
            )}
          </div>

          {/* Active Rules List */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-premium-sm space-y-3">
            <span className="text-xs font-bold text-stone-900 block pb-2 border-b border-stone-100">
              Active Platform Rules ({rules.length})
            </span>

            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule._id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{rule.name}</span>
                    <button
                      onClick={() => handleDeleteRule(rule._id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-stone-500">
                    IF members &gt;= {rule.conditions?.minGroupMembers || 0} &amp; order &gt;= ₹{rule.conditions?.minOrderValue?.toLocaleString('en-IN') || 0}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                      THEN {rule.actions?.discountValue}{rule.actions?.discountType === 'PERCENT' ? '%' : '₹'} OFF
                    </span>

                    <button
                      onClick={() => handleToggleRule(rule)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        rule.isActive ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDiscountEngine;
