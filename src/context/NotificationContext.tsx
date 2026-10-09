import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  pushPermission: NotificationPermission | 'unsupported';
  requestPushPermission: () => Promise<boolean>;
  sendPushNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  activeToast: AppNotification | null;
  dismissToast: () => void;
  triggerFlashSaleAlert: () => void;
  triggerOrderUpdateAlert: (orderId?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚡ Flash Sale Live: Up to 35% Off',
    message: 'Quantum audio gear and titanium wearables are now on limited-batch flash pricing for the next 3 hours!',
    type: 'flash_sale',
    timestamp: '10m ago',
    read: false,
    productId: 'prod-vortex-aero'
  },
  {
    id: 'notif-2',
    title: '📦 Order #NX-8821 In Transit',
    message: 'Your AURA Gen-4 Cybernetic Watch departed our Munich Express fulfillment center. Track live coordinates.',
    type: 'order',
    timestamp: '1h ago',
    read: false,
    orderId: 'NX-8821'
  },
  {
    id: 'notif-3',
    title: '⚠️ Low Stock Alert: CYBERDECK Apex 75',
    message: 'Only 4 units remaining in today’s allocation. 11 people are currently viewing.',
    type: 'inventory',
    timestamp: '3h ago',
    read: true,
    productId: 'prod-cyberdeck-75'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission('unsupported');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  const requestPushPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        sendPushNotification({
          title: '🔔 Push Notifications Activated',
          message: 'You will receive real-time order tracking updates and limited flash sale drops.',
          type: 'system'
        });
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Notification permission error', err);
      return false;
    }
  };

  const sendPushNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast(curr => (curr?.id === newNotif.id ? null : curr));
    }, 6000);

    // Native Browser Push Notification if granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Safe fallback in sandboxed env
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (activeToast?.id === id) setActiveToast(null);
  };

  const clearAll = () => {
    setNotifications([]);
    setActiveToast(null);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const triggerFlashSaleAlert = () => {
    const randomGadgets = [
      'VORTEX Aero Pro Headphones (₹60 OFF)',
      'NEXUS Phantom 8K Cine Drone (Flash Drop)',
      'AURA Titanium Smartwatch (Last 3 units)'
    ];
    const picked = randomGadgets[Math.floor(Math.random() * randomGadgets.length)];
    sendPushNotification({
      title: '⚡ FLASH SALE DROP TRIGGERED',
      message: `Lightning Deal: ${picked}! Real-time inventory is draining fast.`,
      type: 'flash_sale',
      productId: 'prod-vortex-aero'
    });
  };

  const triggerOrderUpdateAlert = (orderId = 'NX-8821') => {
    sendPushNotification({
      title: `📦 Order #${orderId} Status Updated`,
      message: `Your package cleared regional logistics hub and is out for final delivery today!`,
      type: 'order',
      orderId
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        pushPermission,
        requestPushPermission,
        sendPushNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        activeToast,
        dismissToast,
        triggerFlashSaleAlert,
        triggerOrderUpdateAlert
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
