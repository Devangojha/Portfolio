import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useInventory } from './InventoryContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  couponDiscount: number;
  reservationTimeRemaining: number; // in seconds
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { reserveStock, releaseStock } = useInventory();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);

  // 10-minute reservation lock timer (600 seconds)
  const [reservationTimeRemaining, setReservationTimeRemaining] = useState(600);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Reservation countdown ticker
  useEffect(() => {
    if (cart.length === 0) {
      setReservationTimeRemaining(600);
      return;
    }

    const timer = setInterval(() => {
      setReservationTimeRemaining(prev => {
        if (prev <= 1) {
          // Reset timer when reached 0
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cart.length]);

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    const chosenColor = color || (product.colorOptions ? product.colorOptions[0].name : undefined);

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        reserveStock(product.id, quantity);
        return [...prev, { product, quantity, selectedColor: chosenColor }];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const target = prev.find(item => item.product.id === productId);
      if (target) {
        releaseStock(productId, target.quantity);
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const diff = quantity - item.quantity;
          if (diff > 0) {
            reserveStock(productId, diff);
          } else if (diff < 0) {
            releaseStock(productId, Math.abs(diff));
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setCouponDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NEXUS10' || clean === 'FLASH20' || clean === 'CYBER15') {
      const rate = clean === 'FLASH20' ? 0.20 : clean === 'CYBER15' ? 0.15 : 0.10;
      setCouponCode(clean);
      setCouponDiscount(rate);
      return true;
    }
    return false;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * couponDiscount);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.08); // 8% sales tax
  const total = Math.max(0, taxableAmount + shipping + tax);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        couponCode,
        applyCoupon,
        couponDiscount,
        reservationTimeRemaining,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
