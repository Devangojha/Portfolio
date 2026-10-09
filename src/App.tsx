import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NotificationProvider } from './context/NotificationContext';
import { InventoryProvider } from './context/InventoryContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PushToast } from './components/PushToast';
import { NotificationDrawer } from './components/NotificationDrawer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { OverviewPage } from './pages/OverviewPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { Order } from './types';

type TabType = 'home' | 'explore' | 'overview' | 'about' | 'profile' | 'login';

function parseHash(): { tab: TabType; productId: string; modal?: string } {
  const hash = window.location.hash || '';
  if (hash.startsWith('#overview')) {
    const query = hash.split('?')[1] || '';
    const params = new URLSearchParams(query);
    const pid = params.get('id') || 'prod-vortex-aero';
    return { tab: 'overview', productId: pid };
  }
  if (hash === '#explore') return { tab: 'explore', productId: 'prod-vortex-aero' };
  if (hash === '#about') return { tab: 'about', productId: 'prod-vortex-aero' };
  if (hash === '#profile') return { tab: 'profile', productId: 'prod-vortex-aero' };
  if (hash === '#login') return { tab: 'login', productId: 'prod-vortex-aero' };
  if (hash === '#cart') return { tab: 'home', productId: 'prod-vortex-aero', modal: 'cart' };
  if (hash === '#search') return { tab: 'home', productId: 'prod-vortex-aero', modal: 'search' };
  if (hash === '#notifications') return { tab: 'home', productId: 'prod-vortex-aero', modal: 'notifications' };
  if (hash === '#checkout') return { tab: 'home', productId: 'prod-vortex-aero', modal: 'checkout' };
  return { tab: 'home', productId: 'prod-vortex-aero' };
}

function AppContent() {
  const initial = parseHash();
  const [currentTab, setCurrentTab] = useState<TabType>(initial.tab);
  const [selectedProductId, setSelectedProductId] = useState<string>(initial.productId);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(initial.modal === 'search');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(initial.modal === 'notifications');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCartOpen, setIsCartOpen, isCheckoutOpen, setIsCheckoutOpen } = useCart();
  const { activeOrderToTrack, setActiveOrderToTrack } = useAuth();

  // Mobile Back button protection state
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressTimeRef = useRef<number>(0);

  // Sync refs for event listeners
  const currentTabRef = useRef(currentTab);
  currentTabRef.current = currentTab;
  const selectedProductIdRef = useRef(selectedProductId);
  selectedProductIdRef.current = selectedProductId;

  const isCartOpenRef = useRef(isCartOpen);
  isCartOpenRef.current = isCartOpen;
  const isSearchOpenRef = useRef(isSearchOpen);
  isSearchOpenRef.current = isSearchOpen;
  const isNotificationsOpenRef = useRef(isNotificationsOpen);
  isNotificationsOpenRef.current = isNotificationsOpen;
  const isCheckoutOpenRef = useRef(isCheckoutOpen);
  isCheckoutOpenRef.current = isCheckoutOpen;
  const activeOrderToTrackRef = useRef(activeOrderToTrack);
  activeOrderToTrackRef.current = activeOrderToTrack;
  const mobileMenuOpenRef = useRef(mobileMenuOpen);
  mobileMenuOpenRef.current = mobileMenuOpen;

  // Initialize browser history stack on first mount to prevent mobile back exiting app immediately
  useEffect(() => {
    const currentHash = window.location.hash || '#home';
    window.history.replaceState({ tab: 'home', root: true }, '', currentHash);
    // Push an active entry so Android back button triggers popstate inside app
    window.history.pushState({ tab: currentTabRef.current, productId: selectedProductIdRef.current }, '', currentHash);
  }, []);

  // Global mobile back button & browser history handler
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // 1. If any modal/drawer is open, back button CLOSES it first (does NOT close the website)
      if (mobileMenuOpenRef.current) {
        setMobileMenuOpen(false);
        return;
      }
      if (activeOrderToTrackRef.current) {
        setActiveOrderToTrack(null);
        return;
      }
      if (isCheckoutOpenRef.current) {
        setIsCheckoutOpen(false);
        return;
      }
      if (isCartOpenRef.current) {
        setIsCartOpen(false);
        return;
      }
      if (isSearchOpenRef.current) {
        setIsSearchOpen(false);
        return;
      }
      if (isNotificationsOpenRef.current) {
        setIsNotificationsOpen(false);
        return;
      }

      // 2. No modals open: Inspect destination hash / state
      const hash = window.location.hash || '';
      if (hash.startsWith('#overview')) {
        const query = hash.split('?')[1] || '';
        const params = new URLSearchParams(query);
        const pid = params.get('id') || e.state?.productId || 'prod-vortex-aero';
        setSelectedProductId(pid);
        setCurrentTab('overview');
      } else if (hash === '#explore') {
        setCurrentTab('explore');
      } else if (hash === '#about') {
        setCurrentTab('about');
      } else if (hash === '#profile') {
        setCurrentTab('profile');
      } else if (hash === '#login') {
        setCurrentTab('login');
      } else {
        // Destination is root or #home
        if (currentTabRef.current === 'home') {
          // User is on Home page and pressed Android/mobile Back button:
          const now = Date.now();
          if (now - lastBackPressTimeRef.current < 2000) {
            // Second back press within 2s: allow normal browser exit!
            return;
          }
          // First back press on home: show non-intrusive alert and retain page
          lastBackPressTimeRef.current = now;
          setShowExitToast(true);
          setTimeout(() => setShowExitToast(false), 2000);
          window.history.pushState({ tab: 'home' }, '', '#home');
          return;
        }
        setCurrentTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setIsCartOpen, setIsCheckoutOpen, setActiveOrderToTrack]);

  // Tab navigation with history push
  const navigateTo = useCallback((tab: TabType, productId?: string) => {
    // Close mobile menu if open
    if (mobileMenuOpenRef.current) {
      setMobileMenuOpen(false);
    }
    // Close any drawers if open
    if (isSearchOpenRef.current) setIsSearchOpen(false);
    if (isNotificationsOpenRef.current) setIsNotificationsOpen(false);
    if (isCartOpenRef.current) setIsCartOpen(false);
    if (isCheckoutOpenRef.current) setIsCheckoutOpen(false);
    if (activeOrderToTrackRef.current) setActiveOrderToTrack(null);

    const targetProduct = productId || selectedProductIdRef.current;
    const targetHash = tab === 'overview' ? `#overview?id=${targetProduct}` : `#${tab}`;

    if (window.location.hash !== targetHash) {
      window.history.pushState({ tab, productId: targetProduct }, '', targetHash);
    }

    if (productId) {
      setSelectedProductId(productId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setIsCartOpen, setIsCheckoutOpen, setActiveOrderToTrack]);

  // Modal Open Handlers (pushes history entry so mobile back closes the modal)
  const handleOpenCart = () => {
    window.history.pushState({ modal: 'cart' }, '', '#cart');
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    if (window.location.hash === '#cart') {
      window.history.back();
    } else {
      setIsCartOpen(false);
    }
  };

  const handleOpenSearch = () => {
    window.history.pushState({ modal: 'search' }, '', '#search');
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    if (window.location.hash === '#search') {
      window.history.back();
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleOpenNotifications = () => {
    window.history.pushState({ modal: 'notifications' }, '', '#notifications');
    setIsNotificationsOpen(true);
  };

  const handleCloseNotifications = () => {
    if (window.location.hash === '#notifications') {
      window.history.back();
    } else {
      setIsNotificationsOpen(false);
    }
  };

  const handleOpenCheckout = () => {
    window.history.pushState({ modal: 'checkout' }, '', '#checkout');
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    if (window.location.hash === '#checkout') {
      window.history.back();
    } else {
      setIsCheckoutOpen(false);
    }
  };

  const handleOpenTracking = (order: Order) => {
    window.history.pushState({ modal: 'track', orderId: order.id }, '', `#track?id=${order.id}`);
    setActiveOrderToTrack(order);
  };

  const handleCloseTracking = () => {
    if (window.location.hash.startsWith('#track')) {
      window.history.back();
    } else {
      setActiveOrderToTrack(null);
    }
  };

  const handleToggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      window.history.pushState({ modal: 'menu' }, '', '#menu');
      setMobileMenuOpen(true);
    } else {
      if (window.location.hash === '#menu') {
        window.history.back();
      } else {
        setMobileMenuOpen(false);
      }
    }
  };

  const handleCloseMobileMenu = () => {
    if (window.location.hash === '#menu') {
      window.history.back();
    } else {
      setMobileMenuOpen(false);
    }
  };

  // Global keyboard shortcut to open search (/ or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        handleOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectProduct = (productId: string) => {
    navigateTo('overview', productId);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    navigateTo('explore');
  };

  const handleOrderSuccess = (order: Order) => {
    handleOpenTracking(order);
    setCurrentTab('profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 1. Header with Top Bar Contract & Mobile Menu Support */}
      <Navbar
        currentTab={currentTab}
        onNavigate={tab => navigateTo(tab)}
        onOpenSearch={handleOpenSearch}
        onOpenNotifications={handleOpenNotifications}
        onOpenCart={handleOpenCart}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={handleToggleMobileMenu}
        onCloseMobileMenu={handleCloseMobileMenu}
      />

      {/* 2. Main Page View Routing */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={tab => navigateTo(tab)}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {currentTab === 'explore' && (
          <ExplorePage
            onSelectProduct={handleSelectProduct}
            selectedCategoryFromParent={selectedCategory}
            onClearParentCategory={() => setSelectedCategory('All')}
          />
        )}

        {currentTab === 'overview' && (
          <OverviewPage
            productId={selectedProductId}
            onSelectProduct={handleSelectProduct}
            onProceedToCheckout={handleOpenCheckout}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage
            onNavigateToExplore={() => navigateTo('explore')}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => navigateTo('profile')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            onSelectProduct={handleSelectProduct}
            onNavigateToExplore={() => navigateTo('explore')}
            onNavigateToLogin={() => navigateTo('login')}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer
        onNavigate={tab => navigateTo(tab)}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        onSelectProduct={handleSelectProduct}
        onViewCategory={handleSelectCategory}
      />

      {/* 5. Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={handleCloseNotifications}
        onSelectOrder={() => {
          handleCloseNotifications();
          navigateTo('profile');
        }}
        onSelectProduct={productId => {
          handleCloseNotifications();
          handleSelectProduct(productId);
        }}
      />

      {/* 6. Hardware Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={handleOpenCheckout}
        onExploreMore={() => {
          handleCloseCart();
          navigateTo('explore');
        }}
      />

      {/* 7. Encrypted Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 8. Order Tracking Telemetry Modal */}
      {activeOrderToTrack && (
        <OrderTrackingModal
          order={activeOrderToTrack}
          onClose={handleCloseTracking}
        />
      )}

      {/* 9. Floating Push Notification Toast */}
      <PushToast
        onNavigateToOrder={() => navigateTo('profile')}
        onNavigateToProduct={handleSelectProduct}
      />

      {/* 10. Mobile Double-Back Exit Toast Guard */}
      {showExitToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-2xl border border-slate-700 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
          Press back again to exit NEXUS Tech
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <InventoryProvider>
        <CartProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </CartProvider>
      </InventoryProvider>
    </NotificationProvider>
  );
}
