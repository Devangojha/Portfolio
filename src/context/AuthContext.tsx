import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Order, Address, CartItem } from '../types';
import { useNotifications } from './NotificationContext';
import { useInventory } from './InventoryContext';

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: UserProfile;
  orders: Order[];
  wishlistIds: string[];
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  orders: Order[];
  wishlistIds: string[];
  login: (email: string, password?: string) => AuthResult;
  loginDemoUser: () => void;
  signup: (name: string, email: string, password?: string) => AuthResult;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addOrder: (orderData: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    paymentMethod: string;
  }) => Order;
  updateNotificationSettings: (settings: { orderUpdates: boolean; flashSales: boolean; inventoryDrops: boolean }) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  activeOrderToTrack: Order | null;
  setActiveOrderToTrack: (order: Order | null) => void;
}

const DEMO_USER: UserProfile = {
  id: 'usr-901',
  name: 'Alex Vance',
  email: 'alex.vance@nexus-tech.io',
  phone: '+1 (415) 890-2194',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  memberTier: 'Nexus Prime VIP',
  memberSince: 'October 2025',
  wishlistIds: ['prod-vortex-aero', 'prod-spectrum-ar'],
  addresses: [
    {
      fullName: 'Alex Vance',
      street: '450 Mission Street, Suite 1200',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'United States',
      isDefault: true,
    },
    {
      fullName: 'Alex Vance (Lab Office)',
      street: '180 Montgomery St, Floor 8',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94104',
      country: 'United States',
      isDefault: false,
    }
  ],
  notificationSettings: {
    orderUpdates: true,
    flashSales: true,
    inventoryDrops: true,
  }
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'NX-8821',
    date: '2026-10-04',
    items: [
      {
        product: {
          id: 'prod-aura-watch',
          name: 'AURA Gen-4 Cybernetic Watch',
          tagline: 'Titanium Smartwatch with Micro-OLED',
          description: '',
          price: 499,
          category: 'Wearables',
          brand: 'NEXUS Biometrics',
          rating: 4.8,
          reviewCount: 98,
          inStock: true,
          stockCount: 4,
          reservedCount: 2,
          activeViewers: 19,
          sku: 'NX-BIO-410',
          accentColor: '#10b981',
          iconType: 'watch',
          warranty: '3-Year Guarantee',
          specs: [],
          features: [],
          imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
          galleryImages: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80']
        },
        quantity: 1,
        selectedColor: 'Raw Titanium',
      }
    ],
    subtotal: 499,
    discount: 0,
    shipping: 0,
    tax: 40,
    total: 539,
    status: 'In Transit',
    trackingNumber: 'NEX-9824-7712-US',
    shippingAddress: DEMO_USER.addresses[0],
    paymentMethod: 'Apple Pay (•••• 9021)',
    estimatedDelivery: 'Oct 8, 2026 by 7:00 PM',
    trackingUpdates: [
      { stage: 'Order Placed & Verified', location: 'Nexus Cloud Core', timestamp: 'Oct 4, 10:14 AM', completed: true },
      { stage: 'Robotic Assembly & QA Inspection', location: 'Munich Micro-Hub', timestamp: 'Oct 4, 02:40 PM', completed: true },
      { stage: 'Dispatched via Air Priority Express', location: 'Frankfurt Int Airport', timestamp: 'Oct 5, 08:30 AM', completed: true },
      { stage: 'Regional Sort Center & Customs Clearance', location: 'San Francisco Hub', timestamp: 'Oct 6, 06:15 PM', completed: true },
      { stage: 'Out for Final Delivery', location: 'Bay Area Delivery Fleet', timestamp: 'Estimated Oct 8', completed: false }
    ]
  },
  {
    id: 'NX-7409',
    date: '2026-09-18',
    items: [
      {
        product: {
          id: 'prod-pulse-core',
          name: 'PULSE Core 200W GaN Station',
          tagline: 'Desktop GaN III Fast Charger',
          description: '',
          price: 119,
          category: 'Power',
          brand: 'NEXUS PowerLab',
          rating: 4.9,
          reviewCount: 312,
          inStock: true,
          stockCount: 12,
          reservedCount: 3,
          activeViewers: 8,
          sku: 'NX-PWR-200',
          accentColor: '#a855f7',
          iconType: 'power',
          warranty: '3-Year Guarantee',
          specs: [],
          features: [],
          imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
          galleryImages: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80']
        },
        quantity: 1,
        selectedColor: 'Obsidian Gray',
      }
    ],
    subtotal: 119,
    discount: 12,
    shipping: 0,
    tax: 8,
    total: 115,
    status: 'Delivered',
    trackingNumber: 'NEX-4112-9011-US',
    shippingAddress: DEMO_USER.addresses[0],
    paymentMethod: 'Visa ending in 4092',
    estimatedDelivery: 'Delivered on Sep 21, 2026',
    trackingUpdates: [
      { stage: 'Order Placed', location: 'Nexus Online', timestamp: 'Sep 18, 09:00 AM', completed: true },
      { stage: 'Shipped', location: 'Austin Hub', timestamp: 'Sep 19, 01:20 PM', completed: true },
      { stage: 'Delivered', location: 'Front Door SF', timestamp: 'Sep 21, 11:45 AM', completed: true }
    ]
  }
];

const DEMO_ACCOUNT: StoredUserAccount = {
  id: 'usr-901',
  name: 'Alex Vance',
  email: 'alex.vance@nexus-tech.io',
  password: 'password123',
  profile: DEMO_USER,
  orders: INITIAL_ORDERS,
  wishlistIds: DEMO_USER.wishlistIds,
  createdAt: '2025-10-01',
};

const getStoredUsers = (): StoredUserAccount[] => {
  try {
    const raw = localStorage.getItem('nexus_registered_users');
    if (!raw) {
      const initial = [DEMO_ACCOUNT];
      localStorage.setItem('nexus_registered_users', JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [DEMO_ACCOUNT];
      localStorage.setItem('nexus_registered_users', JSON.stringify(initial));
      return initial;
    }
    // Ensure demo account is present for reference/evaluation
    if (!parsed.some((u: StoredUserAccount) => u.email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase())) {
      parsed.push(DEMO_ACCOUNT);
      localStorage.setItem('nexus_registered_users', JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEMO_ACCOUNT];
  }
};

const saveStoredUsers = (users: StoredUserAccount[]) => {
  try {
    localStorage.setItem('nexus_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users:', e);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendPushNotification } = useNotifications();
  const { decrementStockForOrder } = useInventory();

  // Initial State: NO account is logged in by default unless active session was explicitly established
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const activeId = localStorage.getItem('nexus_active_user_id');
      if (!activeId) {
        // Clean up legacy default if active session was never created
        localStorage.removeItem('nexus_user_profile');
        return null;
      }
      const users = getStoredUsers();
      const match = users.find(u => u.id === activeId);
      return match ? match.profile : null;
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const activeId = localStorage.getItem('nexus_active_user_id');
      if (!activeId) return [];
      const users = getStoredUsers();
      const match = users.find(u => u.id === activeId);
      return match ? match.orders || [] : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const activeId = localStorage.getItem('nexus_active_user_id');
      if (!activeId) return [];
      const users = getStoredUsers();
      const match = users.find(u => u.id === activeId);
      return match ? match.wishlistIds || [] : [];
    } catch {
      return [];
    }
  });

  const [activeOrderToTrack, setActiveOrderToTrack] = useState<Order | null>(null);

  // Sync user state to localStorage and user database
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('nexus_active_user_id', user.id);
        localStorage.setItem('nexus_user_profile', JSON.stringify(user));
        const users = getStoredUsers();
        const updated = users.map(u => {
          if (u.id === user.id) {
            return { ...u, profile: user, name: user.name, email: user.email.toLowerCase() };
          }
          return u;
        });
        saveStoredUsers(updated);
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.removeItem('nexus_active_user_id');
      localStorage.removeItem('nexus_user_profile');
    }
  }, [user]);

  // Sync orders to current logged-in account
  useEffect(() => {
    if (user) {
      const users = getStoredUsers();
      const updated = users.map(u => {
        if (u.id === user.id) {
          return { ...u, orders };
        }
        return u;
      });
      saveStoredUsers(updated);
    }
  }, [orders, user]);

  // Sync wishlist to current logged-in account
  useEffect(() => {
    if (user) {
      const users = getStoredUsers();
      const updated = users.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            wishlistIds,
            profile: { ...u.profile, wishlistIds },
          };
        }
        return u;
      });
      saveStoredUsers(updated);
    }
  }, [wishlistIds, user]);

  // Verify email and password against stored user accounts
  const login = (email: string, password?: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    const users = getStoredUsers();
    const account = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!account) {
      return {
        success: false,
        error: 'No registered account found with this email. Please verify your address or create an account.',
      };
    }

    // Explicit password verification check
    if (account.password !== cleanPassword) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your password and try again.',
      };
    }

    // Credentials validated!
    localStorage.setItem('nexus_active_user_id', account.id);
    localStorage.setItem('nexus_user_profile', JSON.stringify(account.profile));
    setUser(account.profile);
    setOrders(account.orders || []);
    setWishlistIds(account.wishlistIds || []);

    sendPushNotification({
      title: '🔐 Secure Session Started',
      message: `Welcome back to NEXUS, ${account.name}. Hardware telemetry synchronized.`,
      type: 'system',
    });

    return { success: true };
  };

  const loginDemoUser = () => {
    const users = getStoredUsers();
    let demo = users.find(u => u.id === DEMO_ACCOUNT.id || u.email.toLowerCase() === DEMO_ACCOUNT.email.toLowerCase());
    if (!demo) {
      demo = DEMO_ACCOUNT;
      saveStoredUsers([...users, DEMO_ACCOUNT]);
    }

    localStorage.setItem('nexus_active_user_id', demo.id);
    localStorage.setItem('nexus_user_profile', JSON.stringify(demo.profile));
    setUser(demo.profile);
    setOrders(demo.orders || INITIAL_ORDERS);
    setWishlistIds(demo.wishlistIds || DEMO_USER.wishlistIds);

    sendPushNotification({
      title: '⚡ Authenticated as Alex Vance',
      message: 'Nexus Prime VIP account loaded with active orders and hardware wishlist.',
      type: 'system',
    });
  };

  const signup = (name: string, email: string, password?: string): AuthResult => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const users = getStoredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const newUserId = `usr-${Date.now()}`;
    const newProfile: UserProfile = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      phone: '+1 (555) 019-2834',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      memberTier: 'Nexus Elite',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      addresses: [
        {
          fullName: cleanName,
          street: '100 Innovation Way',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95113',
          country: 'United States',
          isDefault: true,
        }
      ],
      wishlistIds: [],
      notificationSettings: {
        orderUpdates: true,
        flashSales: true,
        inventoryDrops: true,
      }
    };

    const newAccount: StoredUserAccount = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword, // Correctly stored password
      profile: newProfile,
      orders: [],
      wishlistIds: [],
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newAccount];
    saveStoredUsers(updatedUsers);

    // Set active session for the newly created user
    localStorage.setItem('nexus_active_user_id', newUserId);
    localStorage.setItem('nexus_user_profile', JSON.stringify(newProfile));
    setUser(newProfile);
    setOrders([]);
    setWishlistIds([]);

    sendPushNotification({
      title: '🚀 Welcome to NEXUS Tech',
      message: `Account activated for ${cleanName}. 10% coupon code NEXUS10 applied to your profile.`,
      type: 'system',
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('nexus_active_user_id');
    localStorage.removeItem('nexus_user_profile');
    setUser(null);
    setOrders([]);
    setWishlistIds([]);
    sendPushNotification({
      title: '🔒 Signed Out',
      message: 'Your secure session has been terminated.',
      type: 'system',
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      if (!exists) {
        sendPushNotification({
          title: '❤️ Added to Wishlist',
          message: 'We will notify you when price changes or stock gets low.',
          type: 'inventory',
          productId,
        });
      }
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const addOrder = (orderData: {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    paymentMethod: string;
  }): Order => {
    const orderNumber = `NX-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `NEX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-US`;

    const newOrder: Order = {
      id: orderNumber,
      date: new Date().toISOString().split('T')[0],
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: 'Confirmed',
      trackingNumber,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      estimatedDelivery: 'Oct 11, 2026 by 8:00 PM',
      trackingUpdates: [
        {
          stage: 'Order Confirmed & Payment Verified',
          location: 'Nexus Secure Processing Gateway',
          timestamp: 'Just now',
          completed: true,
        },
        {
          stage: 'Automated Micro-Hub Pick & Pack',
          location: 'Munich Hardware Lab',
          timestamp: 'Queued for immediate dispatch',
          completed: false,
        },
        {
          stage: 'Express Carrier Ingestion',
          location: 'Pending handover',
          timestamp: 'Tomorrow 9:00 AM',
          completed: false,
        },
        {
          stage: 'Final Delivery to Destination',
          location: orderData.shippingAddress.city,
          timestamp: 'Oct 11, 2026',
          completed: false,
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Decrement inventory stock
    decrementStockForOrder(
      orderData.items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))
    );

    // Fire instant Order Push Notification
    sendPushNotification({
      title: `🎉 Order Confirmed #${orderNumber}`,
      message: `Total ₹${orderData.total.toLocaleString('en-IN')} processed securely. Live telemetry tracking initialized!`,
      type: 'order',
      orderId: orderNumber,
    });

    return newOrder;
  };

  const updateNotificationSettings = (settings: { orderUpdates: boolean; flashSales: boolean; inventoryDrops: boolean }) => {
    if (user) {
      setUser({
        ...user,
        notificationSettings: settings,
      });
      sendPushNotification({
        title: '⚙️ Push Preferences Saved',
        message: 'Your notification channels have been updated.',
        type: 'system',
      });
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (user) {
      setUser({
        ...user,
        ...updated,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        orders,
        wishlistIds,
        login,
        loginDemoUser,
        signup,
        logout,
        toggleWishlist,
        isInWishlist,
        addOrder,
        updateNotificationSettings,
        updateProfile,
        activeOrderToTrack,
        setActiveOrderToTrack,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
