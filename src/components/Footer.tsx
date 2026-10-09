import React, { useState } from 'react';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'explore' | 'overview' | 'about' | 'profile' | 'login') => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      {/* Top Banner / Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-2 text-cyan-700 font-mono text-xs uppercase tracking-wider font-bold">
              <Cpu className="w-4 h-4" />
              <span>Hardware Dispatch &amp; Drop Telemetry</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Get 10% off your first prototype order + flash drop alerts.
            </h3>
            <p className="text-slate-600 text-xs mt-1.5 max-w-xl">
              Subscribe to the NEXUS frequency for limited-batch hardware releases, firmware notes, and exclusive member discounts.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 shadow-xs">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold text-xs text-slate-900">Welcome to NEXUS LABS</p>
                  <p className="text-[11px] text-emerald-700">Use promo code <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300">NEXUS10</span> for 10% off at checkout.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter developer email..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500 font-mono text-xs shadow-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              Hardware Labs
            </h4>
            <ul className="space-y-2.5">
              {['Audio', 'Wearables', 'Computing', 'Optics', 'Drones', 'Power'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                      onNavigate('explore');
                    }}
                    className="hover:text-cyan-700 transition-colors text-left font-medium"
                  >
                    {cat} Systems
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-700 transition-colors">
                  Storefront Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-cyan-700 transition-colors">
                  Full Catalog &amp; Filters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-cyan-700 transition-colors">
                  Product Spotlight
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-cyan-700 transition-colors">
                  Engineering Principles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-cyan-700 transition-colors">
                  Live Order Telemetry
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              Guarantees &amp; Policy
            </h4>
            <ul className="space-y-2.5 font-medium">
              <li className="hover:text-slate-900">3-Year Nexus Hardware Warranty</li>
              <li className="hover:text-slate-900">30-Day Zero-Risk Return Policy</li>
              <li className="hover:text-slate-900">Real-Time Inventory Hold SLA</li>
              <li className="hover:text-slate-900">Carbon-Neutral Micro-Fulfillment</li>
              <li className="hover:text-slate-900">Global RoHS &amp; CE Certification</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider mb-4">
              Security &amp; Logistics
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  PCI-DSS Level 1 tokenized processing. Zero credential storage.
                </p>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Logistics Nodes: Frankfurt · San Francisco · Singapore · Tokyo
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; 2026 NEXUS Tech Inc. All rights reserved. High-performance reactive hardware architecture.
          </div>
          <div className="flex items-center gap-4 font-mono font-medium">
            <span>Latency: 12ms</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">API Gateway: Online</span>
            <span>·</span>
            <span>Inventory Feed: Real-Time</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
