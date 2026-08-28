export type UserRole = 'customer' | 'admin' | 'manager' | 'staff';

export interface SavedPaymentCard {
  id: string;
  userId?: string;
  cardHolder: string;
  last4: string;
  brand: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'Card';
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'active' | 'suspended' | 'inactive';
  addresses?: UserAddress[];
  savedCards?: SavedPaymentCard[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  id: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  address1?: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type CustomerAddress = UserAddress;
export type ShippingAddress = UserAddress;

export interface ProductVariant {
  id: string;
  name: string; // e.g. "100ml", "200ml", "Rose Sand", "Set of 3"
  sku: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  categoryId: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  brand: string;
  department: 'beauty' | 'home-kitchen' | 'both';
  images: string[];
  videoUrl?: string;
  status?: 'active' | 'draft' | 'archived';
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  isOrganic?: boolean;
  isCrueltyFree?: boolean;
  isVegan?: boolean;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  ingredients?: string[];
  specifications?: Record<string, string>;
  howToUse?: string;
  volumeOrWeight?: string;
  benefits?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  department: 'beauty' | 'home-kitchen';
  image: string;
  bannerImage?: string;
  status?: 'active' | 'inactive';
  displayOrder?: number;
  subcategories: Subcategory[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  bannerImage: string;
  productIds: string[];
  status?: 'active' | 'inactive';
  featured?: boolean;
  discountBadge?: string;
}

export type HomepageSectionType = 
  | 'hero' 
  | 'trust_badges' 
  | 'categories' 
  | 'featured_products' 
  | 'promo_banner' 
  | 'new_arrivals' 
  | 'bestsellers' 
  | 'collections_spotlight'
  | 'kitchen_spotlight'
  | 'testimonials' 
  | 'newsletter'
  | 'custom_html';

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string;
  subtitle?: string;
  active?: boolean;
  enabled?: boolean;
  order: number;
  data?: Record<string, any>;
}

export type HomepageSectionConfig = HomepageSection;

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  buttonText?: string;
  buttonUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  desktopImage?: string;
  mobileImage?: string;
  imageUrl?: string;
  tag?: string;
  placement?: 'hero' | 'promo' | 'category_top';
  type?: 'hero' | 'promotional' | 'sidebar';
  status?: 'active' | 'inactive';
  active?: boolean;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  unitPrice: number;
  totalPrice: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Payment Pending' 
  | 'Paid' 
  | 'Processing' 
  | 'Packed' 
  | 'Shipped' 
  | 'Out For Delivery' 
  | 'Delivered' 
  | 'Cancelled' 
  | 'Refunded'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName?: string;
  productImage?: string;
  product?: Product;
  sku?: string;
  variantId?: string;
  variantName?: string;
  selectedVariant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: UserAddress;
  billingAddress?: UserAddress;
  items: (CartItem | OrderItem)[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingAmount: number;
  shippingMethod?: string;
  taxAmount: number;
  totalAmount?: number;
  grandTotal?: number;
  paymentMethod: 'stripe_card' | 'cod' | 'apple_pay' | 'stripe_credit_card';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  fulfillmentStatus?: 'unfulfilled' | 'fulfilled';
  paymentDetails?: {
    last4?: string;
    brand?: string;
    transactionId?: string;
  };
  stripePaymentIntentId?: string;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'fixed_amount';
  discountValue: number;
  minimumSpend?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  maxUses?: number;
  usageCount?: number;
  usedCount?: number;
  perUserLimit?: number;
  startDate?: string;
  expiresAt?: string;
  expiryDate?: string;
  isActive?: boolean;
  status?: 'active' | 'inactive';
}

export interface ProductReview {
  id: string;
  productId: string;
  productName?: string;
  userId?: string;
  authorName: string;
  authorEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  images?: string[];
  verifiedPurchase: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  featured?: boolean;
  createdAt: string;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'vip';
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  segments?: string[];
  notes?: CustomerNote[];
  registeredAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  featuredImage?: string;
  author?: string;
  authorName?: string;
  category: string;
  tags: string[];
  status?: 'published' | 'draft';
  published?: boolean;
  publishedAt: string;
  readTime?: string;
  readTimeMinutes?: number;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  logoUrl?: string;
  currency: string;
  currencySymbol: string;
  supportEmail: string;
  supportPhone: string;
  storeAddress: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee?: number;
  taxRatePercentage: number;
  stripePublishableKey?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  announcementText?: string;
  announcementBarText?: string;
  announcementActive?: boolean;
  announcementBarEnabled?: boolean;
  announcementCoupon?: string;
  announcementBarCoupon?: string;
  privacyPolicy?: string;
  termsOfService?: string;
  shippingPolicy?: string;
  refundPolicy?: string;
  policies?: {
    privacyPolicy: string;
    termsAndConditions: string;
    shippingPolicy: string;
    refundPolicy: string;
  };
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrdersCount: number;
  totalCustomers: number;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  changeAmount: number;
  reason: 'sale' | 'restock' | 'manual_adjustment' | 'return' | 'damage';
  previousStock: number;
  newStock: number;
  performedBy: string;
  timestamp: string;
}
