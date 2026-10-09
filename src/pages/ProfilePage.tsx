import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { GadgetImage } from '../components/GadgetImage';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { formatINR } from '../utils/currency';
import {
  Package,
  Heart,
  MapPin,
  Bell,
  Truck,
  Plus,
  Trash2,
  ShieldCheck,
  LogOut,
  Zap
} from 'lucide-react';
import { Order } from '../types';

interface ProfilePageProps {
  onSelectProduct: (productId: string) => void;
  onNavigateToExplore: () => void;
  onNavigateToLogin?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onSelectProduct,
  onNavigateToExplore,
  onNavigateToLogin,
}) => {
  const { user, orders, wishlistIds, toggleWishlist, logout, updateNotificationSettings, loginDemoUser } = useAuth();
  const { products } = useInventory();
  const { addToCart } = useCart();
  const { pushPermission, requestPushPermission, triggerFlashSaleAlert, triggerOrderUpdateAlert } = useNotifications();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'settings'>('orders');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
            No Account Currently Logged In
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
            Sign in to view your real-time order history, tracking telemetry, and hardware wishlist, or register a new profile.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onNavigateToLogin && (
            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              Sign In / Create Account
            </button>
          )}
          <button
            onClick={onNavigateToExplore}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
          <span>Need to evaluate quickly? </span>
          <button
            onClick={() => loginDemoUser()}
            className="text-cyan-600 hover:text-cyan-700 font-bold underline cursor-pointer"
          >
            1-Click Demo Account Sign In
          </button>
        </div>
      </div>
    );
  }

  // Wishlist products
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  const handleAddAllWishlistToCart = () => {
    wishlistProducts.forEach(prod => {
      addToCart(prod, 1);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* User Banner Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-100 shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-xl sm:text-2xl text-slate-900">
                {user.name}
              </h1>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                {user.memberTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
              <span>Member since {user.memberSince}</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">Hardware Allocation Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-rose-600 text-xs transition-colors cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'Order History', count: orders.length, icon: Package },
            { id: 'wishlist', label: 'Wishlist', count: wishlistProducts.length, icon: Heart },
            { id: 'addresses', label: 'Saved Addresses', count: user.addresses.length, icon: MapPin },
            { id: 'settings', label: 'Push Notifications', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 text-xs sm:text-sm font-semibold transition-colors relative flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-cyan-50 text-cyan-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Hardware Orders &amp; Live Telemetry
            </h2>
            <button
              onClick={() => triggerOrderUpdateAlert()}
              className="text-xs font-mono text-cyan-700 hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <Zap className="w-3.5 h-3.5" />
              Simulate Live GPS Ping
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <Package className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-800 font-bold">No orders recorded yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Explore our next-gen gadgets and experience real-time dispatch tracking.
              </p>
              <button
                onClick={onNavigateToExplore}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          #{order.id}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500 font-mono">{order.date}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-cyan-50 text-cyan-800 border border-cyan-200 animate-pulse'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tracking: <span className="font-mono text-slate-800 font-semibold">{order.trackingNumber}</span> · {order.estimatedDelivery}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="font-mono text-right sm:text-right">
                        <div className="text-sm font-bold text-slate-900 tabular-nums">{formatINR(order.total)}</div>
                        <div className="text-[10px] text-slate-500">{order.paymentMethod}</div>
                      </div>

                      <button
                        onClick={() => setSelectedOrderForTracking(order)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Live Coordinates
                      </button>
                    </div>
                  </div>

                  {/* Itemized Order Line Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            <GadgetImage product={item.product} size="sm" className="w-full h-full" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">{item.product.name}</span>
                            <div className="text-[11px] text-slate-500">
                              Qty: {item.quantity} {item.selectedColor ? `· ${item.selectedColor}` : ''}
                            </div>
                          </div>
                        </div>

                        <span className="font-mono text-slate-900 font-bold">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Hardware Wishlist &amp; Allocation Watch
              </h2>
              <p className="text-xs text-slate-500">
                You will receive automatic push notifications when items experience price drops or drop below 5 units.
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <button
                onClick={handleAddAllWishlistToCart}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                Move All To Cart
              </button>
            )}
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <Heart className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-800 font-bold">Your wishlist is empty</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Save planar headphones, titanium watches, or drones to track inventory levels.
              </p>
              <button
                onClick={onNavigateToExplore}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase"
              >
                Explore Hardware
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map(product => (
                <div
                  key={product.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div
                      onClick={() => onSelectProduct(product.id)}
                      className="cursor-pointer overflow-hidden rounded-xl mb-4"
                    >
                      <GadgetImage product={product} size="md" className="h-44" />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-1">
                      <span className="text-cyan-700 font-bold">{product.category}</span>
                      <span className={product.stockCount <= 5 ? 'text-rose-600 font-bold' : 'text-emerald-700 font-semibold'}>
                        {product.stockCount} in stock
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product.id)}
                      className="font-display font-bold text-base text-slate-900 hover:text-cyan-700 transition-colors cursor-pointer truncate"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {product.tagline}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {formatINR(product.price)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900">
            Saved Delivery Hubs &amp; Destinations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 relative space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                      Default Delivery Hub
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{addr.street}</p>
                <p className="text-xs text-slate-500 font-mono">
                  {addr.city}, {addr.state} {addr.postalCode} · {addr.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Push Notification Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-2xl">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900">
              Real-Time Push Notification Engine
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure real-time browser push notifications and in-app sound/banner triggers.
            </p>
          </div>

          {/* Browser Notification Status Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-bold text-slate-900">
                  Native Web Browser Push API
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Status: {pushPermission === 'granted' ? 'Active & Authorized' : pushPermission === 'denied' ? 'Blocked in Browser' : 'Pending Authorization'}
              </p>
            </div>

            {pushPermission !== 'granted' && (
              <button
                onClick={() => requestPushPermission()}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Enable Push API
              </button>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            {[
              {
                key: 'orderUpdates',
                title: 'Live Order Dispatch & GPS Updates',
                desc: 'Push notification every time your package clears transit sort hubs.',
                state: user.notificationSettings.orderUpdates,
              },
              {
                key: 'flashSales',
                title: 'Flash Sale Drops & Lightning Countdown Alerts',
                desc: 'Alerts when limited-batch 35% discount allocations go live.',
                state: user.notificationSettings.flashSales,
              },
              {
                key: 'inventoryDrops',
                title: 'Low Stock & Restock Telemetry',
                desc: 'Alerts when watched wishlist gadgets drop below 5 available units.',
                state: user.notificationSettings.inventoryDrops,
              },
            ].map(item => (
              <div
                key={item.key}
                className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-xs"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={item.state}
                  onChange={e =>
                    updateNotificationSettings({
                      ...user.notificationSettings,
                      [item.key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-slate-900 accent-slate-900 cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Test Buttons */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-500 block mb-2 font-bold">
              Diagnostics: Fire Live Test Alerts
            </span>
            <div className="flex gap-3">
              <button
                onClick={triggerFlashSaleAlert}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                Trigger Flash Drop Test
              </button>
              <button
                onClick={() => triggerOrderUpdateAlert()}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold cursor-pointer"
              >
                Trigger Order Update Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        order={selectedOrderForTracking}
        onClose={() => setSelectedOrderForTracking(null)}
      />
    </div>
  );
};
