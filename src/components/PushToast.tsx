import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Zap, Package, AlertTriangle, X } from 'lucide-react';

interface PushToastProps {
  onNavigateToOrder?: (orderId: string) => void;
  onNavigateToProduct?: (productId: string) => void;
}

export const PushToast: React.FC<PushToastProps> = ({
  onNavigateToOrder,
  onNavigateToProduct,
}) => {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'flash_sale':
        return <Zap className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'order':
        return <Package className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'inventory':
        return <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Bell className="w-5 h-5 text-cyan-600 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (activeToast.type) {
      case 'flash_sale':
        return 'border-amber-300 shadow-amber-500/10';
      case 'order':
        return 'border-emerald-300 shadow-emerald-500/10';
      case 'inventory':
        return 'border-rose-300 shadow-rose-500/10';
      default:
        return 'border-cyan-300 shadow-cyan-500/10';
    }
  };

  return (
    <aside
      aria-label="Push notifications"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div
        className={`bg-white/95 backdrop-blur-md border ${getBorderColor()} rounded-xl p-4 shadow-2xl flex items-start gap-3 relative`}
      >
        <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-xs font-bold text-slate-900 tracking-wide font-display">
              {activeToast.title}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeToast.timestamp}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {activeToast.message}
          </p>

          {(activeToast.orderId || activeToast.productId) && (
            <div className="mt-2.5 flex items-center gap-2">
              {activeToast.orderId && onNavigateToOrder && (
                <button
                  onClick={() => {
                    onNavigateToOrder(activeToast.orderId!);
                    dismissToast();
                  }}
                  className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Track Order #{activeToast.orderId} →
                </button>
              )}
              {activeToast.productId && onNavigateToProduct && (
                <button
                  onClick={() => {
                    onNavigateToProduct(activeToast.productId!);
                    dismissToast();
                  }}
                  className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  View Product Drop →
                </button>
              )}
            </div>
          )}
        </div>

        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
