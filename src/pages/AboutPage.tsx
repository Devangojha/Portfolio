import React from 'react';
import { ShieldCheck, Cpu, Truck, RefreshCw, Radio } from 'lucide-react';

interface AboutPageProps {
  onNavigateToExplore: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToExplore }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-700 uppercase tracking-wider font-bold">
          <Cpu className="w-4 h-4" />
          <span>Nexus Labs Architectural Manifesto</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Engineering the next era of reactive hardware.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Founded by industrial designers and audio acoustic engineers across Munich and San Francisco, NEXUS designs specialized electronic gadgets made from milled aircraft alloys, gallium nitride, and sapphire crystals.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900">Real-Time Inventory Mesh</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every prototype in our catalog is synced directly with robotic warehouse bin allocations. No phantom backorders or deceptive pre-orders.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900">3-Year Nexus Warranty</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero-friction repairs and swap guarantees on all structural chassis, biometric sensors, and lithium-polymer cells.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900">Sub-24h Dispatch Network</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Micro-fulfillment facilities in Frankfurt, California, and Tokyo enable same-day pack and next-flight express handover.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-slate-900">100% Circular Recovery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Trade in end-of-life hardware for instant store credit. All titanium, copper, and rare-earth magnets are closed-loop recycled.
          </p>
        </div>
      </div>

      {/* Engineering Testing Protocol Section */}
      <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase text-cyan-700 font-bold">
              QA Validation Chambers
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Subjected to 10,000 thermal and kinetic stress cycles.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Before a new model is minted for our production batch, it undergoes an unforgiving validation gauntlet: continuous -20°C to +60°C thermal shock, 1.8-meter granite drop testing, and 240-hour saline atmospheric exposure.
            </p>
            <div className="pt-2">
              <button
                onClick={onNavigateToExplore}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
              >
                Inspect Certified Hardware &rarr;
              </button>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Anechoic Chamber Acoustic Distortion</span>
              <span className="text-emerald-700 font-bold">&lt; 0.05% THD @ 1kHz</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Grade 5 Titanium Tensile Yield</span>
              <span className="text-cyan-800 font-bold">880 MPa Milled ASTM B348</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">Micro-OLED Luminance Retention</span>
              <span className="text-amber-800 font-bold">99.4% @ 5,000 Continuous Hours</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <span className="text-slate-600">GaN III Thermal Dissipation Delta</span>
              <span className="text-slate-900 font-bold">&Delta;T &lt; 28.4°C @ 200W Full Load</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
