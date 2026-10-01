import React, { useState, useEffect } from 'react';
import {
  Package, Plus, Sparkles, Edit, Trash2, Search, X, Check,
  Layers, DollarSign, Users, Eye, RefreshCw
} from 'lucide-react';
import api from '../../utils/api.js';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    categoryName: 'Electronics',
    brand: '',
    mrp: 2999,
    price: 2499,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    description: '',
    highlights: ['', ''],
    defaultPriceTiers: [
      { memberCount: 1, price: 2499, discountPercent: 10 },
      { memberCount: 5, price: 2199, discountPercent: 20 },
      { memberCount: 10, price: 1899, discountPercent: 30 }
    ],
    seo: { metaTitle: '', metaDescription: '', keywords: [] }
  });

  // AI Content Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        api.get('/products'),
        api.get('/products/categories')
      ]);
      if (pRes.success) setProducts(pRes.products || []);
      if (cRes.success) setCategories(cRes.categories || []);
    } catch (e) {
      console.warn('Error loading products in admin:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      title: '',
      categoryName: categories[0]?.name || 'Electronics',
      brand: '',
      mrp: 2999,
      price: 2499,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
      description: '',
      highlights: ['', ''],
      defaultPriceTiers: [
        { memberCount: 1, price: 2499, discountPercent: 10 },
        { memberCount: 5, price: 2199, discountPercent: 20 },
        { memberCount: 10, price: 1899, discountPercent: 30 }
      ],
      seo: { metaTitle: '', metaDescription: '', keywords: [] }
    });
    setAiPrompt('');
    setAiSuccess(false);
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      categoryName: product.categoryName,
      brand: product.brand,
      mrp: product.mrp,
      price: product.price,
      stock: product.stock,
      images: product.images,
      description: product.description,
      highlights: product.highlights || ['', ''],
      defaultPriceTiers: product.defaultPriceTiers || [],
      seo: product.seo || { metaTitle: '', metaDescription: '', keywords: [] }
    });
    setAiPrompt('');
    setAiSuccess(false);
    setShowModal(true);
  };

  // Section 20: AI Product Content Generator
  const handleGenerateAI = async () => {
    if (!form.brand && !form.title && !aiPrompt) {
      alert('Please provide at least a title, brand or prompt for the AI');
      return;
    }

    try {
      setGeneratingAi(true);
      const res = await api.post('/ai/generate-product-content', {
        prompt: aiPrompt || `Generate listing for ${form.brand} ${form.title}`,
        title: form.title,
        brand: form.brand,
        category: form.categoryName,
        basePrice: form.price
      });

      if (res.success && res.content) {
        const c = res.content;
        setForm(prev => ({
          ...prev,
          title: c.title || prev.title,
          description: c.description || prev.description,
          highlights: c.highlights || prev.highlights,
          categoryName: c.suggestedCategory || prev.categoryName,
          seo: c.seo || prev.seo
        }));
        setAiSuccess(true);
      }
    } catch (e) {
      alert('AI Generation error: ' + e.message);
    } finally {
      setGeneratingAi(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedCat = categories.find(c => c.name === form.categoryName);
      const payload = {
        ...form,
        category: selectedCat?._id
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      setShowModal(false);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredProducts = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-stone-500">Add, edit pricing tiers, and generate AI listings</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search SKU or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pl-8 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-premium-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-premium-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Individual / MRP</th>
                <th className="py-3 px-4">Group Buy Tier (Lowest)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Active Pools</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredProducts.map((p) => {
                const lowest = p.defaultPriceTiers?.length
                  ? Math.min(...p.defaultPriceTiers.map(t => t.price))
                  : p.price;

                return (
                  <tr key={p._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                          alt={p.title}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 truncate max-w-xs">{p.title}</p>
                          <span className="text-[10px] text-stone-400">{p.brand} • SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-700">{p.categoryName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-stone-400 line-through block">₹{p.mrp.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ₹{lowest.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${p.stock <= 10 ? 'text-rose-600' : 'text-stone-800'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-stone-600 font-semibold">{p.activeGroupsCount || 0} pools</span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with AI Content Generator */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-premium-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h3 className="font-extrabold text-sm text-stone-900">
                {editingProduct ? 'Edit Product Listing' : 'Create New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Generator Box (Section 20) */}
            <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-stone-50 border-b border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  AI Product Content Generator (Groq Powered)
                </span>
                {aiSuccess && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Content Generated & Applied
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Premium noise cancelling over-ear headphones with 40h battery"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 bg-white text-xs px-3 py-1.5 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-400 placeholder:text-stone-600"
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generatingAi}
                  className="py-1.5 px-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors shadow-2xs"
                >
                  {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{generatingAi ? 'Generating...' : 'AI Generate'}</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    value={form.categoryName}
                    onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Individual Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Main Image URL</label>
                  <input
                    type="text"
                    required
                    value={form.images[0] || ''}
                    onChange={(e) => setForm({ ...form, images: [e.target.value] })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-stone-700 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-stone-50 px-3 py-2 border border-stone-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Tiers Area */}
              <div className="pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-800 block mb-2">Group Buying Price Tiers</span>
                <div className="grid grid-cols-3 gap-2">
                  {form.defaultPriceTiers.map((tier, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center">
                      <span className="text-[11px] font-bold text-stone-500">{tier.memberCount} Members</span>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => {
                          const updated = [...form.defaultPriceTiers];
                          updated[idx].price = Number(e.target.value);
                          setForm({ ...form, defaultPriceTiers: updated });
                        }}
                        className="w-full bg-white text-center font-bold px-2 py-1 mt-1 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold shadow-premium-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
