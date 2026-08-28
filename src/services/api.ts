import { mockDb } from './mockDb';
import { 
  Product, Category, Collection, Banner, HomepageSection, Order, 
  Coupon, ProductReview, Customer, BlogPost, StoreSettings, User, UserAddress, AnalyticsSummary, UserRole 
} from '../types';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    department?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    bestseller?: boolean;
    newArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    inStockOnly?: boolean;
    brand?: string;
    limit?: number;
  }): Promise<Product[]> {
    let products = mockDb.getProducts();

    if (params) {
      if (params.category && params.category !== 'all') {
        products = products.filter(p => p.categoryId === params.category || p.categoryName?.toLowerCase() === params.category?.toLowerCase() || p.slug.includes(params.category));
      }
      if (params.subcategory && params.subcategory !== 'all') {
        products = products.filter(p => p.subcategoryId === params.subcategory || p.subcategoryName?.toLowerCase() === params.subcategory?.toLowerCase());
      }
      if (params.department && params.department !== 'all') {
        products = products.filter(p => p.department === params.department || p.department === 'both');
      }
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        products = products.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.ingredients?.some(i => i.toLowerCase().includes(q))
        );
      }
      if (params.featured) {
        products = products.filter(p => p.featured);
      }
      if (params.bestseller) {
        products = products.filter(p => p.bestseller);
      }
      if (params.newArrival) {
        products = products.filter(p => p.newArrival);
      }
      if (params.minPrice !== undefined) {
        products = products.filter(p => (p.salePrice ?? p.price) >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        products = products.filter(p => (p.salePrice ?? p.price) <= params.maxPrice!);
      }
      if (params.rating !== undefined) {
        products = products.filter(p => p.rating >= params.rating!);
      }
      if (params.inStockOnly) {
        products = products.filter(p => p.stockQuantity > 0);
      }
      if (params.brand && params.brand !== 'all') {
        products = products.filter(p => p.brand === params.brand);
      }

      // Sort
      if (params.sort) {
        switch (params.sort) {
          case 'price-low':
            products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
            break;
          case 'price-high':
            products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
          case 'bestselling':
            products.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0) || b.reviewCount - a.reviewCount);
            break;
          case 'newest':
          default:
            products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        }
      }

      if (params.limit && params.limit > 0) {
        products = products.slice(0, params.limit);
      }
    }

    return products;
  },

  async getProductBySlugOrId(idOrSlug: string): Promise<Product | null> {
    const product = mockDb.getProductById(idOrSlug);
    return product || null;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    return mockDb.saveProduct(product);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    return mockDb.saveProduct(product);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return mockDb.saveProduct({ ...product, id });
  },

  async deleteProduct(id: string): Promise<void> {
    mockDb.deleteProduct(id);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return mockDb.getCategories().filter(c => c.status !== 'inactive').sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async getAllCategoriesAdmin(): Promise<Category[]> {
    return mockDb.getCategories().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    return mockDb.saveCategory(cat);
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    return mockDb.saveCategory(cat);
  },

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    return mockDb.saveCategory({ ...cat, id });
  },

  async deleteCategory(id: string): Promise<void> {
    mockDb.deleteCategory(id);
  },

  // Collections
  async getCollections(): Promise<Collection[]> {
    return mockDb.getCollections().filter(c => c.status !== 'inactive');
  },

  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    const col = mockDb.getCollections().find(c => c.slug === slug || c.id === slug);
    return col || null;
  },

  async saveCollection(col: Partial<Collection>): Promise<Collection> {
    return mockDb.saveCollection(col);
  },

  async deleteCollection(id: string): Promise<void> {
    mockDb.deleteCollection(id);
  },

  // Banners
  async getBanners(): Promise<Banner[]> {
    return mockDb.getBanners().filter(b => b.active !== false && b.status !== 'inactive');
  },

  async getAllBannersAdmin(): Promise<Banner[]> {
    return mockDb.getBanners();
  },

  async saveBanner(b: Partial<Banner>): Promise<Banner> {
    return mockDb.saveBanner(b);
  },

  async createBanner(b: Partial<Banner>): Promise<Banner> {
    return mockDb.saveBanner(b);
  },

  async updateBanner(id: string, b: Partial<Banner>): Promise<Banner> {
    return mockDb.saveBanner({ ...b, id });
  },

  async deleteBanner(id: string): Promise<void> {
    mockDb.deleteBanner(id);
  },

  // Homepage CMS
  async getHomepageSections(): Promise<HomepageSection[]> {
    return mockDb.getHomepageSections();
  },

  async saveHomepageSections(sections: HomepageSection[]): Promise<void> {
    mockDb.saveHomepageSections(sections);
  },

  async saveHomepageSection(section: Partial<HomepageSection>): Promise<HomepageSection> {
    return mockDb.saveHomepageSection(section);
  },

  async deleteHomepageSection(id: string): Promise<void> {
    mockDb.deleteHomepageSection(id);
  },

  // Orders
  async getOrders(params?: { customerId?: string; limit?: number; userId?: string }): Promise<Order[]> {
    let orders = mockDb.getOrders();
    if (params) {
      if (params.customerId || params.userId) {
        const uid = params.customerId || params.userId;
        orders = orders.filter(o => o.userId === uid || o.customerId === uid);
      }
      if (params.limit && params.limit > 0) {
        orders = orders.slice(0, params.limit);
      }
    }
    return orders;
  },

  async getCustomerOrders(userIdOrEmail?: string): Promise<Order[]> {
    const orders = mockDb.getOrders();
    if (!userIdOrEmail) return orders;
    return orders.filter(o => o.userId === userIdOrEmail || o.customerEmail.toLowerCase() === userIdOrEmail.toLowerCase());
  },

  async getOrderById(id: string): Promise<Order | null> {
    return mockDb.getOrderById(id) || null;
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return mockDb.createOrder(orderData);
  },

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    const updated = mockDb.updateOrder(orderId, updates);
    return updated || null;
  },

  async updateOrderStatus(orderId: string, status: Order['status'], note?: string, trackingNumber?: string, carrier?: string): Promise<Order | null> {
    const updated = mockDb.updateOrderStatus(orderId, status, note, trackingNumber, carrier);
    return updated || null;
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    return mockDb.getCoupons();
  },

  async validateCoupon(code: string, subtotal: number) {
    return mockDb.validateCoupon(code, subtotal);
  },

  async saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    return mockDb.saveCoupon(coupon);
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    return mockDb.saveCoupon(coupon);
  },

  async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    return mockDb.saveCoupon({ ...coupon, id });
  },

  async deleteCoupon(id: string): Promise<void> {
    mockDb.deleteCoupon(id);
  },

  // Reviews
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    return mockDb.getProductReviews(productId);
  },

  async getAllReviewsAdmin(): Promise<ProductReview[]> {
    return mockDb.getReviews();
  },

  async addReview(review: Partial<ProductReview>): Promise<ProductReview> {
    return mockDb.addReview(review);
  },

  async updateReviewStatus(id: string, status: ProductReview['status'], featured?: boolean): Promise<void> {
    mockDb.updateReviewStatus(id, status, featured);
  },

  async deleteReview(id: string): Promise<void> {
    mockDb.deleteReview(id);
  },

  // Customers & CRM
  async getCustomers(): Promise<Customer[]> {
    return mockDb.getCustomers();
  },

  async getCustomerById(id: string): Promise<Customer | null> {
    return mockDb.getCustomerById(id) || null;
  },

  async addCustomerNote(customerId: string, note: string, authorName?: string) {
    return mockDb.addCustomerNote(customerId, note, authorName);
  },

  async updateCustomerSegments(customerId: string, segments: string[]): Promise<void> {
    mockDb.updateCustomerSegments(customerId, segments);
  },

  // Blog Posts
  async getBlogPosts(): Promise<BlogPost[]> {
    return mockDb.getBlogPosts().filter(p => p.status === 'published' || p.published !== false);
  },

  async getAllBlogPostsAdmin(): Promise<BlogPost[]> {
    return mockDb.getBlogPosts();
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return mockDb.getBlogPostBySlug(slug) || null;
  },

  async saveBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    return mockDb.saveBlogPost(post);
  },

  async createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
    return mockDb.saveBlogPost(post);
  },

  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    return mockDb.saveBlogPost({ ...post, id });
  },

  async deleteBlogPost(id: string): Promise<void> {
    mockDb.deleteBlogPost(id);
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    return mockDb.getSettings();
  },

  async getStoreSettings(): Promise<StoreSettings> {
    return mockDb.getSettings();
  },

  async saveSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return mockDb.saveSettings(settings);
  },

  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return mockDb.saveSettings(settings);
  },

  // Staff & RBAC
  async getUsers(): Promise<User[]> {
    return mockDb.getUsers();
  },

  async saveUser(user: Partial<User>): Promise<User> {
    return mockDb.saveUser(user);
  },

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return mockDb.saveUser({ ...user, id });
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return mockDb.saveUser({ id: userId, role });
  },

  async deleteUser(id: string): Promise<void> {
    mockDb.deleteUser(id);
  },

  // Addresses
  async getAddresses(userId?: string): Promise<UserAddress[]> {
    return mockDb.getAddresses(userId);
  },

  async saveAddress(address: Partial<UserAddress>): Promise<UserAddress> {
    return mockDb.saveAddress(address);
  },

  // Inventory
  async adjustInventory(productId: string, changeAmount: number, reason: any, performedBy?: string): Promise<void> {
    mockDb.adjustInventory(productId, changeAmount, reason, performedBy);
  },

  async getInventoryLogs() {
    return mockDb.getInventoryLogs();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary> {
    const orders = mockDb.getOrders();
    const customers = mockDb.getCustomers();
    const totalRev = orders.reduce((sum, o) => sum + (o.totalAmount || o.grandTotal || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.fulfillmentStatus === 'unfulfilled');

    return {
      totalRevenue: totalRev,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? totalRev / orders.length : 0,
      pendingOrdersCount: pendingOrders.length,
      totalCustomers: customers.length
    };
  },

  // Stripe Checkout Session simulation
  async createStripePaymentIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret: string; paymentIntentId: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          clientSecret: `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
          paymentIntentId: `pi_test_${Date.now()}`
        });
      }, 400);
    });
  }
};
