import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GadgetImage } from '../components/GadgetImage';
import { Product } from '../types';
import { formatINR } from '../utils/currency';
import {
  Search,
  Grid,
  List,
  Heart,
  Plus,
  Eye,
  Star,
  X
} from 'lucide-react';

interface ExplorePageProps {
  onSelectProduct: (productId: string) => void;
  selectedCategoryFromParent?: string;
  onClearParentCategory?: () => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onSelectProduct,
  selectedCategoryFromParent = 'All',
  onClearParentCategory,
}) => {
  const { products } = useInventory();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>(selectedCategoryFromParent);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'stock'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Audio', 'Wearables', 'Computing', 'Optics', 'Drones', 'Power', 'Robotics'];

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = category === 'All' || p.category === category;
        const matchesQuery =
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPrice = p.price <= maxPrice;
        const matchesStock = inStockOnly ? p.inStock && p.stockCount > 0 : true;
        const matchesRating = p.rating >= minRating;

        return matchesCategory && matchesQuery && matchesPrice && matchesStock && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'stock') return a.stockCount - b.stockCount;
        return 0;
      });
  }, [products, category, searchQuery, maxPrice, inStockOnly, minRating, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategory('All');
    setMaxPrice(1000);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('featured');
    if (onClearParentCategory) onClearParentCategory();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Page Header */}
      <div>
        <div className="text-xs font-mono text-cyan-700 uppercase tracking-wider mb-1 font-bold">
          Complete Hardware Catalog
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Engineered Gadgets
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Live telemetry tracking across {products.length} lab prototypes with real-time stock reservations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-white border border-slate-200 rounded-lg shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-100 text-cyan-700 font-bold' : 'text-slate-400 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-slate-100 text-cyan-700 font-bold' : 'text-slate-400 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Control Bar */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by model, sensor, feature, or SKU..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-cyan-500 cursor-pointer font-medium"
            >
              <option value="featured">Featured Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="stock">Low Stock First (Urgent)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Additional Filters: Price Slider & In-Stock Only */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            {/* Price Slider */}
            <div className="flex items-center gap-2.5">
              <span className="text-slate-500 font-medium">Max Price:</span>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-28 accent-slate-900 cursor-pointer"
              />
              <span className="font-mono text-slate-900 font-bold">{formatINR(maxPrice)}</span>
            </div>

            {/* In-Stock Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-slate-900 accent-slate-900 cursor-pointer"
              />
              <span className="text-slate-700 font-medium">In-Stock Only</span>
            </label>

            {/* Rating Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Min Rating:</span>
              <button
                onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                  minRating > 0
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                ★ 4.8+
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-500">
              Showing {filteredProducts.length} of {products.length} prototypes
            </span>
            {(category !== 'All' || searchQuery || maxPrice < 1000 || inStockOnly || minRating > 0) && (
              <button
                onClick={resetFilters}
                className="text-cyan-700 hover:text-cyan-900 font-semibold text-xs underline underline-offset-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
          <p className="text-base text-slate-800 font-semibold">No gadgets match your filters</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try adjusting your price ceiling or selecting &quot;All&quot; departments.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View (3 columns on desktop) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const inWish = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5 shadow-xs hover:shadow-md"
              >
                <div>
                  <div
                    onClick={() => onSelectProduct(product.id)}
                    className="cursor-pointer overflow-hidden rounded-xl mb-4"
                  >
                    <GadgetImage product={product} size="md" className="h-48" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="uppercase text-[11px] tracking-wider text-cyan-700 font-bold">{product.category}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{product.sku}</span>
                    </div>
                    {product.badge && (
                      <span className="text-[11px] text-amber-700 font-bold font-sans">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectProduct(product.id)}
                    className="font-display font-bold text-base text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Real-time Inventory & Rating */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className={product.stockCount <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                      ● {product.stockCount} in stock
                    </span>
                    <div className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-mono">
                    <span className="text-lg font-bold text-slate-900 tabular-nums">{formatINR(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through ml-2">{formatINR(product.originalPrice)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        inWish
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredProducts.map(product => {
            const inWish = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all shadow-xs"
              >
                <div
                  onClick={() => onSelectProduct(product.id)}
                  className="w-full sm:w-36 h-28 shrink-0 overflow-hidden rounded-xl cursor-pointer"
                >
                  <GadgetImage product={product} size="sm" className="w-full h-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
                    <span className="text-cyan-700 font-bold">{product.category}</span>
                    <span>·</span>
                    <span>{product.sku}</span>
                    {product.badge && (
                      <span className="text-amber-700 font-bold ml-2">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onSelectProduct(product.id)}
                    className="font-display font-bold text-base text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {product.tagline}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-slate-500">
                    <span className={product.stockCount <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                      ● {product.stockCount} in stock
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {product.activeViewers} viewing
                    </span>
                    <div className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{product.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="font-mono text-right sm:text-right">
                    <div className="text-xl font-bold text-slate-900 tabular-nums">{formatINR(product.price)}</div>
                    {product.originalPrice && (
                      <div className="text-xs text-slate-400 line-through">{formatINR(product.originalPrice)}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        inWish
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
