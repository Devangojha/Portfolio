import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShieldCheck, Clock, ArrowRight, Tag } from 'lucide-react';
import { GadgetImage } from './GadgetImage';
import { formatINR } from '../utils/currency';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreMore,
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    couponCode,
    applyCoupon,
    couponDiscount,
    reservationTimeRemaining,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) {
      setCouponMessage({ text: `Promo code ${couponInput.toUpperCase()} applied!`, error: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: 'Invalid code. Try "NEXUS10" or "FLASH20"', error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-bold text-slate-900 text-lg">
              Hardware Cart
            </h3>
            <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Stock Reservation Hold Banner */}
        {cart.length > 0 && (
          <div className="px-5 py-2.5 bg-cyan-50 border-b border-cyan-100 flex items-center justify-between text-xs text-cyan-900">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-cyan-700 shrink-0 animate-pulse" />
              <span>Real-Time Inventory Hold</span>
            </div>
            <div className="font-mono font-bold text-cyan-900 bg-white px-2 py-0.5 rounded border border-cyan-300 shadow-xs">
              {formatTimer(reservationTimeRemaining)}
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-base text-slate-800 font-bold mb-1">Your cart is empty</p>
              <p className="text-xs text-slate-500 mb-6">
                Explore our next-gen planar headphones, titanium biometrics, and cine drones.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onExploreMore();
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Browse Gadget Catalog
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={`${item.product.id}-${item.selectedColor}`}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex gap-3.5 shadow-xs"
              >
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                  <GadgetImage product={item.product} size="sm" className="w-full h-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 my-1 text-[11px] text-slate-500">
                    {item.selectedColor && (
                      <span className="font-semibold text-slate-700">
                        {item.selectedColor}
                      </span>
                    )}
                    <span>·</span>
                    <span className="font-mono text-slate-900 font-bold">
                      {formatINR(item.product.price)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:text-slate-900 text-slate-400 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs text-slate-900 font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:text-slate-900 text-slate-400 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Calculations */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            {/* Promo code field */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder="Coupon: NEXUS10"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 font-mono uppercase font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </form>

            {couponMessage && (
              <p className={`text-[11px] font-medium ${couponMessage.error ? 'text-rose-600' : 'text-emerald-700'}`}>
                {couponMessage.text}
              </p>
            )}

            {couponDiscount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-mono font-semibold">
                <span>Code {couponCode} ({(couponDiscount * 100).toFixed(0)}% Off)</span>
                <span>-{formatINR(discount)}</span>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-slate-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Priority Logistics</span>
                <span className="font-mono font-bold text-slate-900">
                  {shipping === 0 ? <span className="text-emerald-700">FREE</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-mono font-bold text-slate-900">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="font-mono text-cyan-800 text-lg font-extrabold">{formatINR(total)}</span>
              </div>
            </div>

            {/* Guarantee Tag */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>3-Year Hardware Guarantee · 30-Day Risk-Free Trial</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
