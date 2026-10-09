export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulVotes: number;
  userHelpful?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Audio' | 'Wearables' | 'Computing' | 'Optics' | 'Drones' | 'Power' | 'Robotics';
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  reservedCount: number;
  activeViewers: number;
  sku: string;
  specs: ProductSpec[];
  features: string[];
  colorOptions?: { name: string; hex: string }[];
  badge?: 'Flash Sale' | 'Bestseller' | 'New Release' | 'Limited Batch';
  warranty: string;
  accentColor: string;
  iconType: 'headphone' | 'watch' | 'keyboard' | 'glasses' | 'drone' | 'power' | 'mouse' | 'audio-dac' | 'robot' | 'display';
  imageUrl: string;
  galleryImages?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  reservationExpiry?: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Confirmed' | 'Assembled' | 'In Transit' | 'Delivered';
  trackingNumber: string;
  shippingAddress: Address;
  paymentMethod: string;
  estimatedDelivery: string;
  trackingUpdates: {
    stage: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'flash_sale' | 'inventory' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
  orderId?: string;
  productId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberTier: 'Standard' | 'Nexus Elite' | 'Nexus Prime VIP';
  memberSince: string;
  addresses: Address[];
  wishlistIds: string[];
  notificationSettings: {
    orderUpdates: boolean;
    flashSales: boolean;
    inventoryDrops: boolean;
  };
}
