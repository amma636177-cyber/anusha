import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, X, ChevronDown, Check } from 'lucide-react';
import api from '../../utils/api.js';
import ProductCard from '../../components/ProductCard.jsx';

export const ProductsPage = ({ initialCategory = null, initialSearch = '', onNavigate }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [groupOnly, setGroupOnly] = useState(false);
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.success) setCategories(res.categories || []);
      } catch (e) {
        // Ignore
      }
    };
    fetchCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let url = `/products?sort=${sort}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (groupOnly) url += `&groupOnly=true`;

      const res = await api.get(url);
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (e) {
      console.warn('Error fetching products:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, sort, groupOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Discover wholesale tier prices on verified products across India
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search catalog or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-none placeholder:text-stone-600"
          />
          <Search className="w-4 h-4 text-stone-600 absolute left-3 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); loadProducts(); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === null
                ? 'bg-stone-900 text-white font-bold'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setSelectedCategory(c.slug)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === c.slug
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Toggles and Sorting */}
        <div className="flex items-center gap-3">
          {/* Group Only Toggle */}
          <label className="flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={groupOnly}
              onChange={(e) => setGroupOnly(e.target.checked)}
              className="accent-emerald-600 w-4 h-4 rounded"
            />
            <span>Group Buy Only</span>
          </label>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-400 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
          <p className="text-stone-400 text-sm mb-2">No products found matching your filters</p>
          <button
            onClick={() => { setSelectedCategory(null); setSearch(''); setGroupOnly(false); }}
            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((prod) => (
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

export default ProductsPage;
