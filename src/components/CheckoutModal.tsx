import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, ArrowRight, Truck, X, Sparkles } from 'lucide-react';
import { Order, Address } from '../types';
import { formatINR } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const { cart, subtotal, discount, tax, shipping, total, clearCart } = useCart();
  const { user, addOrder } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const [paymentType, setPaymentType] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Shipping form state
  const defaultAddress: Address = user?.addresses[0] || {
    fullName: 'Alex Vance',
    street: '450 Mission Street, Suite 1200',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
  };

  const [address, setAddress] = useState<Address>(defaultAddress);

  // Payment form state
  const [cardData, setCardData] = useState({
    cardNumber: '•••• •••• •••• 4092',
    nameOnCard: user?.name || 'Alex Vance',
    expiry: '12/28',
    cvv: '•••',
  });

  if (!isOpen) return null;

  const expressCost = deliveryOption === 'express' ? 19 : 0;
  const finalTotal = total + expressCost;

  const handleNextStep = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder = addOrder({
        items: cart,
        subtotal,
        discount,
        shipping: shipping + expressCost,
        tax,
        total: finalTotal,
        shippingAddress: address,
        paymentMethod:
          paymentType === 'card'
            ? 'Visa ending in 4092'
            : paymentType === 'apple_pay'
            ? 'Apple Pay (Biometric Touch)'
            : 'Cash on Delivery (Verified)',
      });

      setConfirmedOrder(newOrder);
      setStep(4);
      clearCart();
    }, 1200);
  };

  const handleFinish = () => {
    if (confirmedOrder) {
      onOrderSuccess(confirmedOrder);
    }
    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => step !== 4 && onClose()}
      />

      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Nexus 256-Bit Encrypted Checkout
              </h3>
              <p className="text-[11px] text-slate-500">
                PCI-DSS Level 1 Compliant · Zero Data Storage
              </p>
            </div>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Bar (if not finished) */}
        {step !== 4 && (
          <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between text-xs font-mono text-slate-500 font-semibold">
            <span className={step >= 1 ? 'text-cyan-700 font-bold' : ''}>
              1. Review & Stock Lock
            </span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-cyan-700 font-bold' : ''}>
              2. Shipping Address
            </span>
            <span>&rarr;</span>
            <span className={step >= 3 ? 'text-cyan-700 font-bold' : ''}>
              3. Payment
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0" />
                <div className="text-xs text-cyan-950">
                  <span className="font-bold">Hardware Allocation Locked</span>
                  <p className="text-slate-600 text-[11px]">
                    All {cart.length} item(s) are securely held in your name for checkout.
                  </p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50 p-2">
                {cart.map(item => (
                  <div key={item.product.id} className="py-2.5 px-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{item.product.name}</span>
                      <span className="text-slate-500 text-[11px] ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-mono text-slate-800 font-semibold">{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-mono font-semibold text-slate-900">{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Due</span>
                  <span className="font-mono text-cyan-800 text-base font-extrabold">{formatINR(total)}</span>
                </div>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Continue to Shipping
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Delivery Destination
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Full Recipient Name</label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={e => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-cyan-500 font-medium"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={e => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-cyan-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-cyan-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Delivery Speed Options */}
              <div className="pt-2">
                <label className="text-[11px] text-slate-600 font-medium block mb-2">Priority Shipping Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryOption('standard')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryOption === 'standard'
                        ? 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Truck className="w-3.5 h-3.5 text-cyan-700" />
                      Priority Air (Free)
                    </div>
                    <p className="text-[11px] text-slate-500">3-4 business days with live telemetry</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryOption('express')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryOption === 'express'
                        ? 'bg-cyan-50 border-cyan-500 text-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Sonic Drone 24h (+{formatINR(19)})
                    </div>
                    <p className="text-[11px] text-slate-500">Next-day automated dispatch</p>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 cursor-pointer font-semibold"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Proceed to Payment ({formatINR(finalTotal)})
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Payment Channel
              </h4>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentType === 'card'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  <span className="text-[11px] font-bold block">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('apple_pay')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentType === 'apple_pay'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-base font-bold block mb-0.5"></span>
                  <span className="text-[11px] font-bold block">Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('cod')}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    paymentType === 'cod'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                  <span className="text-[11px] font-bold block">COD</span>
                </button>
              </div>

              {paymentType === 'card' && (
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <label className="text-[11px] text-slate-600 font-medium block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={e => setCardData({ ...cardData, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-cyan-500 font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">Expiration</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-cyan-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-medium block mb-1">CVC / CVV</label>
                      <input
                        type="password"
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:border-cyan-500 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentType === 'apple_pay' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-xs text-slate-700">
                    Touch ID or Face ID will authenticate payment for{' '}
                    <span className="font-mono text-cyan-800 font-bold">{formatINR(finalTotal)}</span>.
                  </p>
                </div>
              )}

              {paymentType === 'cod' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-emerald-800">Cash on Delivery Verification</p>
                  <p className="text-[11px] text-slate-500">
                    Pay upon arrival. An SMS / push confirmation will verify handover at destination.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 cursor-pointer font-semibold"
                >
                  Back
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isProcessing ? 'Authorizing Quantum Gateway...' : `Authorize & Pay ${formatINR(finalTotal)}`}
                </button>
              </div>
            </div>
          )}

          {step === 4 && confirmedOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Hardware Order Confirmed
                </h3>
                <p className="font-mono text-xs text-cyan-700 mt-1 font-bold">
                  Order ID: #{confirmedOrder.id}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracking Number: {confirmedOrder.trackingNumber}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Estimated Delivery</span>
                  <span className="font-bold text-emerald-700">{confirmedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping Address</span>
                  <span className="truncate max-w-xs">{confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.city}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Confirmed</span>
                  <span>{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Paid</span>
                  <span className="font-mono text-cyan-800 font-extrabold">{formatINR(confirmedOrder.total)}</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-[11px] text-cyan-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Push notifications enabled: You will receive real-time package movement alerts!</span>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                View in Order History & Live GPS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
