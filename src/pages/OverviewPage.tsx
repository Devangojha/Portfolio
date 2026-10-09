import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { GadgetImage } from '../components/GadgetImage';
import { formatINR } from '../utils/currency';
import {
  Star,
  ShieldCheck,
  Truck,
  Eye,
  Heart,
  Plus,
  Minus,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  RotateCcw
} from 'lucide-react';

interface OverviewPageProps {
  productId?: string;
  onSelectProduct: (productId: string) => void;
  onProceedToCheckout?: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  productId,
  onSelectProduct,
  onProceedToCheckout,
}) => {
  const { products, getProductById, getProductReviews, addReview, voteHelpful } = useInventory();
  const { addToCart, setIsCheckoutOpen } = useCart();
  const { toggleWishlist, isInWishlist, user } = useAuth();

  // Active product
  const activeProduct = (productId ? getProductById(productId) : null) || products[0];

  const [selectedImage, setSelectedImage] = useState<string>(activeProduct.imageUrl);
  const [selectedColor, setSelectedColor] = useState<string>(
    activeProduct.colorOptions ? activeProduct.colorOptions[0].name : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews' | 'features'>('specs');

  // Sync selectedImage when activeProduct changes
  React.useEffect(() => {
    setSelectedImage(activeProduct.imageUrl);
    if (activeProduct.colorOptions && activeProduct.colorOptions.length > 0) {
      setSelectedColor(activeProduct.colorOptions[0].name);
    }
  }, [activeProduct.id]);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  // Accessories bundle state
  const [bundleAccessories, setBundleAccessories] = useState<{ [key: string]: boolean }>({
    'braided-cable': false,
    'protective-case': false,
  });

  const reviews = getProductReviews(activeProduct.id);
  const inWish = isInWishlist(activeProduct.id);

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, quantity, selectedColor);
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewComment.trim()) return;

    addReview(
      activeProduct.id,
      newReviewRating,
      newReviewTitle,
      newReviewComment,
      user?.name || 'Verified Engineer'
    );

    setNewReviewTitle('');
    setNewReviewComment('');
    setIsReviewModalOpen(false);
  };

  const accessoryOptions = [
    { id: 'braided-cable', name: 'Kevlar Braided 240W Type-C Cable (2m)', price: 29 },
    { id: 'protective-case', name: 'Ballistic Nylon Armor Carrying Vault', price: 45 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <span className="hover:text-cyan-700 cursor-pointer font-medium" onClick={() => onSelectProduct(products[0].id)}>
          Catalog
        </span>
        <span>/</span>
        <span className="text-cyan-700 font-bold">{activeProduct.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{activeProduct.name}</span>
      </div>

      {/* Main PDP Grid: Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Interactive Product Visuals */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 sm:p-5 shadow-sm">
            {/* Real-time viewer badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-[11px] font-mono text-cyan-800 shadow-xs backdrop-blur-xs font-semibold">
              <Eye className="w-3.5 h-3.5 text-cyan-600" />
              <span>{activeProduct.activeViewers} users viewing live</span>
            </div>

            {/* Badge */}
            {activeProduct.badge && (
              <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-xs font-mono text-amber-800 font-bold shadow-xs">
                {activeProduct.badge}
              </div>
            )}

            <GadgetImage
              product={activeProduct}
              overrideImage={selectedImage}
              size="hero"
              className="h-80 sm:h-[420px]"
            />
          </div>

          {/* Interactive Gallery Thumbnails */}
          {activeProduct.galleryImages && activeProduct.galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {activeProduct.galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 relative bg-slate-100 ${
                    selectedImage === imgUrl
                      ? 'border-cyan-600 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${activeProduct.name} angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Quick specs pill strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="font-mono text-xs text-slate-500 font-medium">Model SKU</div>
              <div className="font-mono text-xs font-bold text-slate-900 mt-0.5">{activeProduct.sku}</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="font-mono text-xs text-slate-500 font-medium">Hardware QA</div>
              <div className="font-mono text-xs font-bold text-emerald-700 mt-0.5">100% Certified</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-center shadow-xs">
              <div className="font-mono text-xs text-slate-500 font-medium">Dispatch Speed</div>
              <div className="font-mono text-xs font-bold text-cyan-700 mt-0.5">Priority 24h</div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs text-cyan-700 uppercase tracking-wider font-bold">
                {activeProduct.brand}
              </span>
              <button
                onClick={() => toggleWishlist(activeProduct.id)}
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  inWish
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'
                }`}
                title="Save to Wishlist"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {activeProduct.name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {activeProduct.tagline}
            </p>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                ))}
              </div>
              <span className="font-mono font-bold text-slate-900">{activeProduct.rating}</span>
              <span className="text-slate-500">({activeProduct.reviewCount} verified reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-extrabold text-slate-900 tabular-nums">
                  {formatINR(activeProduct.price)}
                </span>
                {activeProduct.originalPrice && (
                  <span className="font-mono text-sm text-slate-400 line-through">
                    {formatINR(activeProduct.originalPrice)}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Save {formatINR(activeProduct.originalPrice ? activeProduct.originalPrice - activeProduct.price : 0)} · Free insured priority express delivery
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[10px] uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                In Stock
              </span>
            </div>
          </div>

          {/* Live Inventory Stock Meter */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between text-xs font-mono">
              <span className={activeProduct.stockCount <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold'}>
                ● Real-Time Inventory: {activeProduct.stockCount} units available
              </span>
              <span className="text-slate-500">
                {activeProduct.reservedCount} in active cart locks
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-500"
                style={{ width: `${Math.min(100, (activeProduct.stockCount / 12) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              Items placed in cart are locked against other buyers for 10 minutes.
            </p>
          </div>

          {/* Color Variant Selector */}
          {activeProduct.colorOptions && activeProduct.colorOptions.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                Finish: <span className="text-slate-900 font-bold font-sans">{selectedColor}</span>
              </label>
              <div className="flex gap-2.5">
                {activeProduct.colorOptions.map(col => (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedColor === col.name
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Add to Cart Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-mono font-bold text-sm text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(activeProduct.stockCount, quantity + 1))}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add to Cart ({formatINR(activeProduct.price * quantity)})
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-cyan-200"
            >
              Instant Buy Now &rarr;
            </button>
          </div>

          {/* Trust assurances */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{activeProduct.warranty} (Repair or direct swap)</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Free priority express shipping with live GPS telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>30-Day risk-free trial in your own studio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accessories Add-On Bundle Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <h3 className="font-display font-bold text-base text-slate-900 mb-1">
          Frequently Paired Hardware Upgrades
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Add laboratory-tested accessories with zero additional shipping fees.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accessoryOptions.map(acc => {
            const isAdded = bundleAccessories[acc.id];
            return (
              <div
                key={acc.id}
                onClick={() => setBundleAccessories({ ...bundleAccessories, [acc.id]: !isAdded })}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isAdded
                    ? 'bg-cyan-50 border-cyan-500 text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{acc.name}</div>
                  <div className="font-mono text-cyan-700 text-xs font-bold mt-0.5">+{formatINR(acc.price)}</div>
                </div>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                    isAdded ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isAdded && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs: Technical Specifications vs Customer Reviews vs Features */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          {(['specs', 'reviews', 'features'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold capitalize transition-colors relative cursor-pointer ${
                activeTab === tab ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'specs'
                ? 'Technical Specifications'
                : tab === 'reviews'
                ? `Verified Reviews (${reviews.length})`
                : 'Key Engineering Features'}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Specs Sheet */}
      {activeTab === 'specs' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Laboratory Telemetry &amp; Dimension Sheet
          </h3>
          <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
            {activeProduct.specs.map(spec => (
              <div key={spec.label} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <span className="font-medium text-slate-500">{spec.label}</span>
                <span className="sm:col-span-2 font-mono text-slate-900 tabular-nums font-semibold">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Features */}
      {activeTab === 'features' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="font-display font-bold text-lg text-slate-900">
            Engineering Highlights
          </h3>
          <ul className="space-y-3">
            {activeProduct.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 3: Verified User Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-center font-mono">
                <div className="text-4xl font-extrabold text-slate-900">{activeProduct.rating}</div>
                <div className="text-xs text-slate-500 font-semibold">out of 5.0</div>
              </div>
              <div className="space-y-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600">
                  Based on {activeProduct.reviewCount} customer benchmarks
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
              Write Verified Review
            </button>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-2xl">
                <p className="text-sm font-semibold text-slate-700">No reviews yet for this model.</p>
                <p className="text-xs text-slate-500 mt-1">Be the first verified buyer to share feedback.</p>
              </div>
            ) : (
              reviews.map(rev => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-mono text-xs font-bold text-cyan-700">
                        {rev.author[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{rev.author}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                              Verified Hardware Buyer
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.comment}</p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <button
                      onClick={() => voteHelpful(rev.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                        rev.userHelpful
                          ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.helpfulVotes})</span>
                    </button>
                    <span className="text-[11px] text-slate-400 font-mono">Benchmark Verified</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsReviewModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl z-10 space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="font-display font-bold text-lg text-slate-900">
              Write a Review for {activeProduct.name}
            </h3>
            <p className="text-xs text-slate-500">
              Share your laboratory benchmarking notes or everyday user experience.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Hardware Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Headline</label>
                <input
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={e => setNewReviewTitle(e.target.value)}
                  placeholder="e.g., Flawless low latency and immaculate planar fidelity"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1 font-medium">Detailed Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={e => setNewReviewComment(e.target.value)}
                  placeholder="Describe acoustic response, ergonomics, battery endurance, build quality..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
