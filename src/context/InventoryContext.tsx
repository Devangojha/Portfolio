import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';
import { useNotifications } from './NotificationContext';

interface InventoryContextType {
  products: Product[];
  reviews: Review[];
  getProductById: (id: string) => Product | undefined;
  getProductReviews: (productId: string) => Review[];
  addReview: (productId: string, rating: number, title: string, comment: string, author: string) => void;
  voteHelpful: (reviewId: string) => void;
  reserveStock: (productId: string, quantity: number) => boolean;
  releaseStock: (productId: string, quantity: number) => void;
  decrementStockForOrder: (items: { productId: string; quantity: number }[]) => void;
  flashSaleTimeLeft: { hours: number; minutes: number; seconds: number };
  lowStockThreshold: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendPushNotification } = useNotifications();

  // Load products with local persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_products_inventory');
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        return parsed.map(p => {
          const initial = INITIAL_PRODUCTS.find(i => i.id === p.id);
          return {
            ...p,
            imageUrl: initial?.imageUrl || p.imageUrl || '',
            galleryImages: initial?.galleryImages || p.galleryImages || [],
          };
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load reviews with local persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_reviews');
      return stored ? JSON.parse(stored) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Flash sale countdown state (starts at 3h 48m 15s)
  const [totalSeconds, setTotalSeconds] = useState(3 * 3600 + 48 * 60 + 15);

  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(prev => (prev > 0 ? prev - 1 : 4 * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashSaleTimeLeft = {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };

  // Persist products and reviews
  useEffect(() => {
    try {
      localStorage.setItem('nexus_products_inventory', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('nexus_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  // Subtle real-time live inventory & viewer telemetry pulse
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setProducts(prevProducts => {
        return prevProducts.map(prod => {
          // Subtle active viewers oscillation (+/- 1-2)
          const viewerDelta = Math.floor(Math.random() * 3) - 1;
          const newViewers = Math.max(3, prod.activeViewers + viewerDelta);

          // Rare live simulated inventory purchase (5% chance on random item with > 3 stock)
          const shouldSimulatePurchase = Math.random() < 0.05 && prod.stockCount > 2;
          let newStock = prod.stockCount;
          let newReserved = prod.reservedCount;

          if (shouldSimulatePurchase) {
            newStock = Math.max(1, prod.stockCount - 1);
            if (newStock <= 3 && prod.stockCount > 3) {
              // Trigger low stock push alert
              setTimeout(() => {
                sendPushNotification({
                  title: `🔥 High Demand: ${prod.name}`,
                  message: `Inventory dropped to ${newStock} units. ${newViewers} customers viewing right now.`,
                  type: 'inventory',
                  productId: prod.id,
                });
              }, 100);
            }
          }

          return {
            ...prod,
            activeViewers: newViewers,
            stockCount: newStock,
            inStock: newStock > 0,
            reservedCount: newReserved,
          };
        });
      });
    }, 12000); // Pulse every 12 seconds

    return () => clearInterval(pulseInterval);
  }, [sendPushNotification]);

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId);
  };

  const addReview = (
    productId: string,
    rating: number,
    title: string,
    comment: string,
    author: string
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      author,
      rating,
      date: 'Just now',
      title,
      comment,
      verifiedPurchase: true,
      helpfulVotes: 0,
      userHelpful: false,
    };

    setReviews(prev => [newRev, ...prev]);

    // Recalculate product rating & review count
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const currentReviews = reviews.filter(r => r.productId === productId);
          const totalRating = currentReviews.reduce((sum, r) => sum + r.rating, 0) + rating;
          const newCount = currentReviews.length + 1;
          const newAvg = Number((totalRating / newCount).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            reviewCount: newCount,
          };
        }
        return p;
      })
    );

    sendPushNotification({
      title: '⭐ Review Published',
      message: `Thank you, ${author}! Your verified product feedback is now live on NEXUS Tech.`,
      type: 'system',
      productId,
    });
  };

  const voteHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => {
        if (r.id === reviewId) {
          const already = r.userHelpful;
          return {
            ...r,
            helpfulVotes: already ? r.helpfulVotes - 1 : r.helpfulVotes + 1,
            userHelpful: !already,
          };
        }
        return r;
      })
    );
  };

  const reserveStock = (productId: string, quantity: number): boolean => {
    let success = false;
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          if (p.stockCount >= quantity) {
            success = true;
            return {
              ...p,
              stockCount: p.stockCount - quantity,
              reservedCount: p.reservedCount + quantity,
              inStock: p.stockCount - quantity > 0,
            };
          }
        }
        return p;
      })
    );
    return success;
  };

  const releaseStock = (productId: string, quantity: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            stockCount: p.stockCount + quantity,
            reservedCount: Math.max(0, p.reservedCount - quantity),
            inStock: true,
          };
        }
        return p;
      })
    );
  };

  const decrementStockForOrder = (items: { productId: string; quantity: number }[]) => {
    setProducts(prev =>
      prev.map(p => {
        const item = items.find(i => i.productId === p.id);
        if (item) {
          const newStock = Math.max(0, p.stockCount - item.quantity);
          return {
            ...p,
            stockCount: newStock,
            reservedCount: Math.max(0, p.reservedCount - item.quantity),
            inStock: newStock > 0,
          };
        }
        return p;
      })
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        reviews,
        getProductById,
        getProductReviews,
        addReview,
        voteHelpful,
        reserveStock,
        releaseStock,
        decrementStockForOrder,
        flashSaleTimeLeft,
        lowStockThreshold: 5,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
