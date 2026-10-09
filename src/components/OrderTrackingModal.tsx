import React from 'react';
import { Order } from '../types';
import { X, CheckCircle, Clock, MapPin, Truck, ShieldCheck, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
  const { triggerOrderUpdateAlert } = useNotifications();

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Live Dispatch Telemetry
                </h3>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold">
                  {order.status}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                Tracking #{order.trackingNumber} · Order #{order.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Map Banner Simulation */}
        <div className="relative h-24 bg-slate-100 border-b border-slate-200 overflow-hidden flex items-center justify-center">
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Telemetry Radar Pulse */}
          <div className="relative z-10 flex items-center gap-4 text-xs font-mono text-slate-800">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span>Carrier: NEXUS Sonic Flight NX-402</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Destination: {order.shippingAddress.city}, {order.shippingAddress.state}</span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline Stepper */}
        <div className="p-6 space-y-5 max-h-72 overflow-y-auto">
          <div className="space-y-4">
            {order.trackingUpdates.map((update, idx) => (
              <div key={idx} className="relative flex items-start gap-3.5">
                {/* Connecting line */}
                {idx !== order.trackingUpdates.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-[1px] ${
                      update.completed ? 'bg-cyan-600' : 'bg-slate-200'
                    }`}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border z-10 ${
                    update.completed
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
                      : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                >
                  {update.completed ? (
                    <CheckCircle className="w-4 h-4 text-cyan-700" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className={`font-bold ${update.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                      {update.stage}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{update.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {update.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer & Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guaranteed Delivery: {order.estimatedDelivery}</span>
          </div>

          <button
            onClick={() => triggerOrderUpdateAlert(order.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Bell className="w-3.5 h-3.5" />
            Ping Live Update
          </button>
        </div>
      </div>
    </div>
  );
};
