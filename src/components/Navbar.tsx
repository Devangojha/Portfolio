import React, { useState } from 'react';
import { Search, Bell, ShoppingBag, Heart, User, Menu, X, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: 'home' | 'explore' | 'overview' | 'about' | 'profile' | 'login';
  onNavigate: (tab: 'home' | 'explore' | 'overview' | 'about' | 'profile' | 'login') => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  onCloseMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  onOpenCart,
  mobileMenuOpen: controlledMobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
}) => {
  const { totalItems } = useCart();
  const { unreadCount } = useNotifications();
  const { user, wishlistIds } = useAuth();
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);

  const isMenuOpen = controlledMobileMenuOpen !== undefined ? controlledMobileMenuOpen : internalMobileMenuOpen;
  const toggleMenu = () => {
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    } else {
      setInternalMobileMenuOpen(!internalMobileMenuOpen);
    }
  };
  const closeMenu = () => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    } else {
      setInternalMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'overview', label: 'Overview' },
    { id: 'about', label: 'About' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Slim Top Flash Sale announcement ticker */}
      <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-amber-50 border-b border-cyan-100 px-4 py-1.5 text-center text-[11px] text-slate-800 font-mono flex items-center justify-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
        <span>FLASH SALE: 20% OFF GA-N POWER &amp; TITANIUM WEARABLES · CODE: <span className="font-bold text-slate-900 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">FLASH20</span></span>
        <button
          onClick={() => onNavigate('explore')}
          className="text-cyan-700 hover:text-cyan-900 font-semibold underline underline-offset-2 ml-2 transition-colors cursor-pointer"
        >
          Explore Drop &rarr;
        </button>
      </div>

      {/* Main 3-Zone Navigation Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 text-left cursor-pointer group"
        >
          <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-cyan-600 transition-colors">
            NEXUS
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan-500 mt-0.5" />
          <span className="font-mono text-[10px] uppercase text-slate-400 tracking-widest ml-1 hidden sm:inline font-semibold">
            LABS
          </span>
        </button>

        {/* Zone 2: 4 Nav links with subtle hover states */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`transition-colors cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-cyan-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive Affordances (Search, Notification, Wishlist, Cart, Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer text-xs"
            title="Search gadgets (Press /)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden lg:inline text-slate-600">Search catalog...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-slate-500 bg-white rounded border border-slate-200 shadow-xs">
              /
            </kbd>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Push Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-white" />
            )}
          </button>

          {/* Wishlist Link */}
          <button
            onClick={() => onNavigate('profile')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hidden sm:flex"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer text-xs shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-300" />
            <span className="font-mono font-semibold text-white">{totalItems}</span>
          </button>

          {/* User Profile / Login Button */}
          {user ? (
            <button
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border ${
                currentTab === 'profile' ? 'border-cyan-500/50 bg-slate-100' : 'border-transparent'
              }`}
              title="Account & Orders"
            >
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden xl:inline truncate max-w-[90px]">
                {user.name.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-medium transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white p-4 space-y-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  closeMenu();
                }}
                className={`text-left py-2 px-3 rounded-lg text-sm font-medium ${
                  currentTab === link.id
                    ? 'bg-slate-100 text-cyan-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate('profile');
                closeMenu();
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>User Profile &amp; Orders</span>
              {wishlistIds.length > 0 && (
                <span className="text-xs font-mono text-rose-500 font-semibold">
                  {wishlistIds.length} Wishlist
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
