import React, { useState } from 'react';
import { Product } from '../types';

interface GadgetImageProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  overrideImage?: string;
  showBadge?: boolean;
}

export const GadgetImage: React.FC<GadgetImageProps> = ({
  product,
  className = '',
  size = 'md',
  overrideImage,
  showBadge = true,
}) => {
  const { iconType, accentColor } = product;
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayImage = overrideImage || product.imageUrl;

  React.useEffect(() => {
    setImageFailed(false);
    setImageLoaded(false);
  }, [displayImage]);

  const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-52 w-full',
    lg: 'h-80 w-full',
    hero: 'h-[420px] w-full',
  }[size];

  // Bespoke futuristic SVG vector illustrations per gadget archetype as zero-broken-image fallback
  const renderSvgFallback = () => {
    switch (iconType) {
      case 'headphone':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <path
              d="M40 105 C40 45, 160 45, 160 105"
              stroke="#64748b"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M48 95 C48 55, 152 55, 152 95"
              stroke={accentColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="4 6"
              className="opacity-90"
            />
            <path
              d="M60 60 C80 48, 120 48, 140 60"
              stroke="#0f172a"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <rect x="26" y="92" width="28" height="52" rx="14" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <ellipse cx="40" cy="118" rx="8" ry="18" fill="#334155" />
            <circle cx="40" cy="118" r="5" fill={accentColor} />
            <rect x="146" y="92" width="28" height="52" rx="14" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />
            <ellipse cx="160" cy="118" rx="8" ry="18" fill="#334155" />
            <circle cx="160" cy="118" r="5" fill={accentColor} />
            <path d="M12 118 C12 100, 12 136, 12 118" stroke={accentColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <path d="M188 118 C188 100, 188 136, 188 118" stroke={accentColor} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
        );

      case 'watch':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <path d="M72 16 L128 16 L124 58 L76 58 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            <path d="M76 142 L124 142 L128 184 L72 184 Z" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            <rect x="58" y="52" width="84" height="96" rx="26" fill="#1e293b" stroke="#0f172a" strokeWidth="3.5" />
            <rect x="65" y="59" width="70" height="82" rx="20" fill="#0f172a" stroke={accentColor} strokeWidth="1.5" strokeDasharray="6 3" />
            <circle cx="100" cy="100" r="28" stroke="#334155" strokeWidth="3" />
            <path d="M100 72 A28 28 0 0 1 128 100" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
            <text x="100" y="98" fill="#f8fafc" fontSize="13" fontWeight="bold" fontFamily="monospace" textAnchor="middle">09:42</text>
            <text x="100" y="112" fill={accentColor} fontSize="8" fontFamily="monospace" textAnchor="middle">138 BPM · 98%</text>
            <rect x="142" y="88" width="6" height="24" rx="3" fill="#94a3b8" />
          </svg>
        );

      case 'keyboard':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <rect x="22" y="65" width="156" height="88" rx="10" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <rect x="26" y="69" width="148" height="80" rx="7" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <g fill="#334155" stroke="#1e293b" strokeWidth="1">
              <rect x="32" y="74" width="14" height="10" rx="2" />
              <rect x="49" y="74" width="14" height="10" rx="2" />
              <rect x="66" y="74" width="14" height="10" rx="2" fill={accentColor} fillOpacity="0.4" />
              <rect x="83" y="74" width="14" height="10" rx="2" />
              <rect x="100" y="74" width="14" height="10" rx="2" />
              <rect x="117" y="74" width="14" height="10" rx="2" />
              <rect x="134" y="74" width="14" height="10" rx="2" />
              <rect x="151" y="74" width="18" height="10" rx="2" fill="#475569" />
              <rect x="32" y="88" width="18" height="10" rx="2" fill="#475569" />
              <rect x="53" y="88" width="14" height="10" rx="2" fill={accentColor} fillOpacity="0.3" stroke={accentColor} />
              <rect x="70" y="88" width="14" height="10" rx="2" />
              <rect x="87" y="88" width="14" height="10" rx="2" />
              <rect x="104" y="88" width="14" height="10" rx="2" fill={accentColor} fillOpacity="0.3" stroke={accentColor} />
              <rect x="121" y="88" width="14" height="10" rx="2" />
              <rect x="138" y="88" width="31" height="10" rx="2" />
              <rect x="32" y="102" width="22" height="10" rx="2" />
              <rect x="57" y="102" width="14" height="10" rx="2" />
              <rect x="74" y="102" width="14" height="10" rx="2" />
              <rect x="91" y="102" width="14" height="10" rx="2" />
              <rect x="108" y="102" width="14" height="10" rx="2" />
              <rect x="125" y="102" width="44" height="10" rx="2" fill="#475569" />
              <rect x="32" y="116" width="26" height="10" rx="2" />
              <rect x="62" y="116" width="76" height="10" rx="2" fill={accentColor} fillOpacity="0.6" stroke={accentColor} />
              <rect x="142" y="116" width="27" height="10" rx="2" />
            </g>
            <path d="M26 150 L174 150" stroke={accentColor} strokeWidth="3" strokeLinecap="round" className="opacity-75 blur-[1px]" />
          </svg>
        );

      case 'glasses':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <path d="M26 84 L48 94" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d="M174 84 L152 94" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <path d="M90 98 Q100 93 110 98" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <rect x="42" y="88" width="50" height="38" rx="12" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <rect x="46" y="92" width="42" height="30" rx="8" fill="#0f172a" fillOpacity="0.8" />
            <path d="M52 102 H64 M52 108 H74" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="80" cy="106" r="3" stroke={accentColor} strokeWidth="1.5" />
            <rect x="108" y="88" width="50" height="38" rx="12" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <rect x="112" y="92" width="42" height="30" rx="8" fill="#0f172a" fillOpacity="0.8" />
            <path d="M118 104 L128 98 L138 104" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="140" cy="112" r="2" fill={accentColor} />
          </svg>
        );

      case 'drone':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <path d="M52 52 L148 148" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <path d="M148 52 L52 148" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="48" r="22" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />
            <circle cx="152" cy="48" r="22" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />
            <circle cx="48" cy="152" r="22" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />
            <circle cx="152" cy="152" r="22" stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" />
            <circle cx="48" cy="48" r="4" fill={accentColor} />
            <circle cx="152" cy="48" r="4" fill={accentColor} />
            <polygon points="100,64 126,90 126,118 100,136 74,118 74,90" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <circle cx="100" cy="104" r="14" fill="#020617" stroke={accentColor} strokeWidth="2" />
          </svg>
        );

      case 'mouse':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <path
              d="M74 55 C74 38, 126 38, 126 55 L132 120 C132 155, 68 155, 68 120 Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            <line x1="100" y1="42" x2="100" y2="86" stroke="#475569" strokeWidth="2" />
            <rect x="96" y="52" width="8" height="20" rx="4" fill="#334155" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="99" cy="130" r="3" fill={accentColor} fillOpacity="0.8" />
          </svg>
        );

      case 'power':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <rect x="50" y="44" width="100" height="116" rx="14" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <rect x="62" y="56" width="76" height="34" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="100" y="74" fill={accentColor} fontSize="14" fontWeight="bold" fontFamily="monospace" textAnchor="middle">200.0W</text>
            <text x="100" y="85" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">48.2°C · GaN III</text>
            <rect x="64" y="102" width="22" height="10" rx="5" fill="#334155" stroke={accentColor} strokeWidth="1" />
            <rect x="94" y="102" width="22" height="10" rx="5" fill="#334155" stroke={accentColor} strokeWidth="1" />
            <rect x="124" y="102" width="22" height="10" rx="5" fill="#334155" stroke={accentColor} strokeWidth="1" />
          </svg>
        );

      case 'robot':
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <line x1="100" y1="36" x2="100" y2="52" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="34" r="5" fill={accentColor} />
            <rect x="52" y="52" width="96" height="74" rx="20" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <rect x="62" y="64" width="76" height="50" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <ellipse cx="82" cy="88" rx="8" ry="12" fill={accentColor} />
            <ellipse cx="118" cy="88" rx="8" ry="12" fill={accentColor} />
            <rect x="88" y="126" width="24" height="18" fill="#334155" stroke="#1e293b" strokeWidth="2" />
            <path d="M60 162 L140 162 L130 144 L70 144 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 200 200" className="w-4/5 h-4/5 drop-shadow-md transition-transform duration-500 group-hover:scale-105" fill="none">
            <rect x="40" y="40" width="120" height="120" rx="16" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
            <circle cx="100" cy="100" r="38" stroke={accentColor} strokeWidth="3" strokeDasharray="10 4" />
            <circle cx="100" cy="100" r="16" fill="#334155" stroke={accentColor} strokeWidth="2" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden border border-slate-200/90 ${sizeClasses} ${className}`}
    >
      {/* Soft studio light dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Soft atmospheric halo */}
      <div
        className="absolute w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: accentColor }}
      />

      {/* Main Photographic Product Image */}
      {displayImage && !imageFailed ? (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <img
            key={displayImage}
            src={displayImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageFailed(true)}
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />

          {/* Fallback skeleton while image is loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-200/60 animate-pulse">
              {renderSvgFallback()}
            </div>
          )}
        </div>
      ) : (
        /* Resilient Zero-Broken-Image Fallback Vector */
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
          {renderSvgFallback()}
        </div>
      )}

      {/* Corner category & SKU watermark */}
      {showBadge && size !== 'sm' && (
        <span className="absolute bottom-2 right-2.5 font-mono text-[9px] uppercase tracking-wider text-slate-600 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 shadow-xs pointer-events-none backdrop-blur-xs font-semibold">
          {product.sku}
        </span>
      )}
    </div>
  );
};
