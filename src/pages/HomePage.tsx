import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GadgetImage } from '../components/GadgetImage';
import { formatINR } from '../utils/currency';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Eye,
  Heart,
  Plus,
  Radio,
  Cpu,
  Truck
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: 'home' | 'explore' | 'overview' | 'about' | 'profile' | 'login') => void;
  onSelectProduct: (productId: string) => void;
  onSelectCategory: (category: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onSelectCategory,
}) => {
  const { products, flashSaleTimeLeft } = useInventory();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();

  // Flagship spotlight product
  const flagshipProduct = products.find(p => p.id === 'prod-vortex-aero') || products[0];

  // Flash sale products
  const flashSaleProducts = products.filter(p => p.badge === 'Flash Sale' || p.badge === 'Limited Batch');

  // Featured grid products
  const featuredProducts = products.slice(0, 6);

  const formatDigits = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="space-y-16 pb-20">
      {/* 1. STOREFRONT HERO: Bold Campaign Focal Point */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12 border-b border-slate-200 bg-white">
        {/* Subtle radial glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-400/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Quiet unboxed text metadata - zero pill compliance */}
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-800">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  Live Hardware Allocation
                </span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-600">Gen-4 Planar &amp; Titanium Systems</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-emerald-700 font-semibold">Sub-24h Dispatch</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] text-balance">
                Precision hardware for the next frontier.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
                Engineered from aircraft magnesium, Grade 5 titanium, and gallium nitride. Experience uncompressed spatial acoustics, sub-millimeter biometrics, and real-time inventory tracking.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onSelectProduct(flagshipProduct.id)}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  Inspect VORTEX Aero Pro
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('explore')}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Explore All 7 Labs
                </button>
              </div>

              {/* Quantitative Rigor Stats adjacent to claim */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-200 max-w-lg">
                <div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">18ms</div>
                  <div className="text-xs text-slate-500 mt-0.5">Ultra-wideband wireless latency</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-cyan-700 tabular-nums">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5">Real-time inventory verified</div>
                </div>
                <div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">3-Yr</div>
                  <div className="text-xs text-slate-500 mt-0.5">Comprehensive hardware warranty</div>
                </div>
              </div>
            </div>

            {/* Right Focal Hero Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-xs text-slate-700 font-semibold">
                      FLAGSHIP SPECIMEN
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>{formatINR(flagshipProduct.price)}</span>
                    <span className="line-through text-slate-400 text-[11px] ml-1">{formatINR(flagshipProduct.originalPrice)}</span>
                  </div>
                </div>

                {/* Hero Product Graphic */}
                <div
                  onClick={() => onSelectProduct(flagshipProduct.id)}
                  className="cursor-pointer group"
                >
                  <GadgetImage product={flagshipProduct} size="lg" className="h-64 sm:h-72" />
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">
                        {flagshipProduct.name}
                      </h3>
                      <p className="text-xs text-slate-500">{flagshipProduct.tagline}</p>
                    </div>
                    <button
                      onClick={() => toggleWishlist(flagshipProduct.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isInWishlist(flagshipProduct.id)
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Real-time stock meter bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-600">
                      <span className="text-rose-600 font-bold">
                        Only {flagshipProduct.stockCount} units remaining
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Eye className="w-3 h-3 text-slate-500" />
                        {flagshipProduct.activeViewers} active viewers
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, (flagshipProduct.stockCount / 10) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(flagshipProduct)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Reserve &amp; Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH SALE COUNTDOWN & LIVE TELEMETRY BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-sky-50/80 border border-amber-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-700 font-bold">
                <Zap className="w-4 h-4" />
                <span>Live Flash Allocation Drop</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                Limited Batch Countdown: Up to 35% Instant Savings
              </h2>
              <p className="text-xs text-slate-600 max-w-xl">
                Real-time stock decreases as units are reserved. Guaranteed reservation lock for 10 minutes upon cart placement.
              </p>
            </div>

            {/* Countdown Clock (Tabular numerals) */}
            <div className="flex items-center gap-2 font-mono">
              <div className="text-center p-2.5 bg-white border border-amber-200 rounded-xl min-w-[56px] shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  {formatDigits(flashSaleTimeLeft.hours)}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Hours</div>
              </div>
              <span className="text-amber-600 text-xl font-bold">:</span>
              <div className="text-center p-2.5 bg-white border border-amber-200 rounded-xl min-w-[56px] shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  {formatDigits(flashSaleTimeLeft.minutes)}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Mins</div>
              </div>
              <span className="text-amber-600 text-xl font-bold">:</span>
              <div className="text-center p-2.5 bg-white border border-amber-200 rounded-xl min-w-[56px] shadow-xs">
                <div className="text-xl sm:text-2xl font-bold text-amber-600 tabular-nums">
                  {formatDigits(flashSaleTimeLeft.seconds)}
                </div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Secs</div>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Row */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashSaleProducts.slice(0, 3).map(product => (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-all flex items-center gap-4 group shadow-xs"
              >
                <div
                  onClick={() => onSelectProduct(product.id)}
                  className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 cursor-pointer"
                >
                  <GadgetImage product={product} size="sm" className="w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => onSelectProduct(product.id)}
                    className="text-xs font-semibold text-slate-900 group-hover:text-amber-600 transition-colors truncate cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-mono">
                    <span className="text-amber-700 font-bold">{formatINR(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-slate-400 line-through text-[11px]">{formatINR(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-rose-600 font-semibold mt-1">
                    {product.stockCount} left in allocation
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg border border-amber-200 transition-colors cursor-pointer shrink-0"
                  title="Quick Add to Cart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORY SEGMENTED NAVIGATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
              Hardware Departments
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Precision manufactured modules built across 7 specialized labs
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1 cursor-pointer"
          >
            Explore Complete Catalog &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'Audio', label: 'Audio Systems', desc: 'Planar ANC & DACs' },
            { id: 'Wearables', label: 'Biometrics', desc: 'Titanium Micro-OLED' },
            { id: 'Computing', label: 'Precision Input', desc: 'Hall-Effect & Carbon' },
            { id: 'Optics', label: 'Spatial Optics', desc: 'AR Waveguides' },
            { id: 'Drones', label: 'Autonomous Cine', desc: '8K LiDAR Drones' },
            { id: 'Power', label: 'GaN PowerLab', desc: '200W Fast Stations' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onNavigate('explore');
              }}
              className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-cyan-400 text-left transition-all cursor-pointer group shadow-xs"
            >
              <div className="font-display font-semibold text-xs text-slate-900 group-hover:text-cyan-700 transition-colors">
                {cat.label}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {cat.desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FEATURED HARDWARE GRID (3-column desktop layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs font-mono text-cyan-700 uppercase tracking-wider mb-1 font-bold">
              Curated Release Schedule
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Next-Gen Gadgets
            </h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            View All ({products.length})
          </button>
        </div>

        {/* 3-Column Desktop Grid as specified by Ecommerce Reference */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map(product => {
            const inWish = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between transition-all hover:-translate-y-0.5 shadow-xs hover:shadow-md"
              >
                <div>
                  {/* Lead with imagery */}
                  <div
                    onClick={() => onSelectProduct(product.id)}
                    className="cursor-pointer overflow-hidden rounded-xl mb-4"
                  >
                    <GadgetImage product={product} size="md" className="h-48" />
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-mono">
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

                  {/* Product Title */}
                  <h3
                    onClick={() => onSelectProduct(product.id)}
                    className="font-display font-bold text-base text-slate-900 group-hover:text-cyan-700 transition-colors cursor-pointer truncate"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Real-time Inventory Status Indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className={product.stockCount <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                      ● {product.stockCount} in stock
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-slate-400" />
                      {product.activeViewers} viewing
                    </span>
                  </div>
                </div>

                {/* Card Footer: Price & Primary CTA */}
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
                      title="Toggle Wishlist"
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
      </section>

      {/* 5. BRAND CRAFTSMANSHIP & ZERO-SLOP TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-700 font-bold">
              The Nexus Engineering Standard
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Hardware designed without compromise.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every prototype undergoes rigorous thermal cycle analysis, 10-ATM pressure containment tests, and RF electromagnetic certification. If a component fails within 3 years, our Munich and San Francisco micro-labs replace it with zero questions asked.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">3-Year Nexus Warranty</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Comprehensive cover including battery health drop below 80%.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sub-24h Micro-Fulfillment</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated robotic pick, pack, and priority air express handoff.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Radio className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Real-Time Inventory Hold</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Cart allocation locks stock so you never miss a limited run.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
