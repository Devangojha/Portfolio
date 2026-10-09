import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Zap, Eye } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Product } from '../types';
import { GadgetImage } from './GadgetImage';
import { formatINR } from '../utils/currency';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onViewCategory: (category: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewCategory,
}) => {
  const { products } = useInventory();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Audio', 'Wearables', 'Computing', 'Optics', 'Drones', 'Power', 'Robotics'];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery =
      query.trim() === '' ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.tagline.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.sku.toLowerCase().includes(query.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  const popularSearches = ['Planar Magnetic', 'Titanium Smartwatch', 'GaN 200W', '8K Cine Drone', 'Hall-Effect 75%'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-cyan-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search gadgets, specs, SKUs, audio, titanium..."
            className="w-full bg-transparent border-none text-slate-900 placeholder:text-slate-400 text-base focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px] text-slate-500 bg-white shadow-xs">
            ESC
          </span>
        </div>

        {/* Category Pills & Quick Filters */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {query.trim() === '' && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Popular Quick Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm font-semibold text-slate-700">No gadgets found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400 mt-1">Try exploring by category or clearing filters</p>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 mb-1 font-medium">
                <span>{filteredProducts.length} Results Found</span>
                <span className="font-mono">Real-time Stock Checked</span>
              </div>

              {filteredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product.id);
                    onClose();
                  }}
                  className="group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                      <GadgetImage product={product} size="sm" className="w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                          {product.name}
                        </span>
                        {product.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-sm">
                        {product.tagline}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                        <span className="text-slate-900 font-bold">{formatINR(product.price)}</span>
                        <span>·</span>
                        <span className={product.stockCount <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                          {product.stockCount} in stock
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Eye className="w-3 h-3" />
                          {product.activeViewers} viewing
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-cyan-700 transition-colors shrink-0">
                    <span className="text-xs font-semibold hidden sm:inline">Overview</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Search index spans all 7 engineering departments</span>
          <button
            onClick={() => {
              onViewCategory(selectedCategory);
              onClose();
            }}
            className="text-cyan-700 hover:text-cyan-900 font-bold cursor-pointer"
          >
            Open in Full Catalog &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
