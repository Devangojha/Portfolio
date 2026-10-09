import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Zap, Package, AlertTriangle, Check, Trash2, ShieldCheck, X } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectProduct?: (productId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectOrder,
  onSelectProduct,
}) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
    pushPermission,
    requestPushPermission,
    triggerFlashSaleAlert,
    triggerOrderUpdateAlert,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'flash_sale' | 'inventory'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'flash_sale':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'order':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'inventory':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white border border-slate-200 rounded-lg text-cyan-700 shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base">
                Notification Feed
              </h3>
              <p className="text-xs text-slate-500">
                Live order tracking and flash sale updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        {pushPermission !== 'granted' && (
          <div className="mx-4 mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0" />
              <div className="text-xs text-cyan-950">
                <span className="font-bold">Enable Browser Push</span>
                <p className="text-[11px] text-cyan-800">Get alerts even when tab is in background</p>
              </div>
            </div>
            <button
              onClick={() => requestPushPermission()}
              className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Enable
            </button>
          </div>
        )}

        {/* Live Simulation Trigger Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">
            Simulate Live Push Alerts
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={triggerFlashSaleAlert}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              Test Flash Drop
            </button>
            <button
              onClick={() => triggerOrderUpdateAlert()}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Package className="w-3.5 h-3.5" />
              Simulate Order GPS
            </button>
          </div>
        </div>

        {/* Category Tabs & Actions */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2 bg-white">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {(['all', 'order', 'flash_sale', 'inventory'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer capitalize ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
                }`}
              >
                {tab === 'flash_sale' ? 'Flash Sales' : tab === 'order' ? 'Orders' : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={clearAll}
              title="Clear all"
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No notifications in this feed</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-slate-50 border-slate-200 opacity-80'
                    : 'bg-white border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      {item.orderId && onSelectOrder && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectOrder(item.orderId!);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-cyan-700 hover:underline cursor-pointer"
                        >
                          View Order #{item.orderId}
                        </button>
                      )}
                      {item.productId && onSelectProduct && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onSelectProduct(item.productId!);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                        >
                          View Product Specs
                        </button>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          clearNotification(item.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 text-[11px] ml-auto cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
