import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { useQuickView } from './context/QuickViewContext';
import { useToast } from './context/ToastContext';
import { api } from './services/api';
import { Product, Category, StoreSettings, BlogPost, HomepageSectionConfig, Banner } from './types';

// Storefront Components
import { TopAnnouncementBar } from './components/storefront/TopAnnouncementBar';
import { Navbar } from './components/storefront/Navbar';
import { Footer } from './components/storefront/Footer';
import { SearchModal } from './components/storefront/SearchModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { WishlistDrawer } from './components/storefront/WishlistDrawer';
import { QuickViewModal } from './components/storefront/QuickViewModal';

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { ShopPage } from './pages/storefront/ShopPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { CartPage } from './pages/storefront/CartPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { OrderConfirmationPage } from './pages/storefront/OrderConfirmationPage';
import { AccountPage } from './pages/storefront/AccountPage';
import { AboutPage } from './pages/storefront/AboutPage';
import { BlogPage } from './pages/storefront/BlogPage';
import { BlogPostPage } from './pages/storefront/BlogPostPage';
import { ContactPage } from './pages/storefront/ContactPage';
import { AuthPages } from './pages/storefront/AuthPages';
import { PolicyPages } from './pages/storefront/PolicyPages';

// Admin Portal
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminHomepageBuilder } from './pages/admin/AdminHomepageBuilder';
import { AdminBanners } from './pages/admin/AdminBanners';
import { AdminBlog } from './pages/admin/AdminBlog';
import { AdminSettings } from './pages/admin/AdminSettings';

export const App: React.FC = () => {
  const { currentUser, isStaff, role } = useAuth();
  const { openCart } = useCart();
  const { openWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const { showToast } = useToast();

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    return hash;
  });

  // Admin sub-tab
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Loaded Data
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = `#${path}`;
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [sett, cats, sections, ban, posts, prods, cols] = await Promise.all([
        api.getStoreSettings(),
        api.getCategories(),
        api.getHomepageSections(),
        api.getBanners(),
        api.getBlogPosts(),
        api.getProducts(),
        api.getCollections()
      ]);
      setSettings(sett);
      setCategories(cats);
      setHomepageSections(sections);
      setBanners(ban);
      setBlogPosts(posts);
      setProducts(prods);
      setCollections(cols);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#1C3829] border-t-transparent rounded-full animate-spin mx-auto" />
          <span className="text-sm font-serif font-bold uppercase tracking-[0.2em] text-[#1C3829] block">
            PURELIS BOTANICALS
          </span>
          <p className="text-xs text-[#7A8A7F]">Preparing curated formulas...</p>
        </div>
      </div>
    );
  }

  // Determine active route rendering with path and query separation
  const [pathPart, queryPart] = currentRoute.split('?');
  const isProductDetail = pathPart.startsWith('/product/');
  const productSlug = isProductDetail ? pathPart.replace('/product/', '') : '';

  const isBlogPostDetail = pathPart.startsWith('/blog/') && pathPart !== '/blog';
  const blogSlug = isBlogPostDetail ? pathPart.replace('/blog/', '') : '';

  const isOrderConfirmation = pathPart.startsWith('/order-confirmation/');
  const orderConfirmId = isOrderConfirmation ? pathPart.replace('/order-confirmation/', '') : '';

  const isAdminRoute = pathPart.startsWith('/admin');

  // Handle Admin Portal Route
  if (isAdminRoute) {
    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={setAdminTab}
        onNavigateToStorefront={() => navigate('/')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard onNavigateToTab={setAdminTab} />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            categories={categories}
            onProductClick={(slug) => navigate(`/product/${slug}`)}
          />
        )}
        {adminTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onReloadCategories={loadInitialData}
          />
        )}
        {adminTab === 'orders' && (
          <AdminOrders />
        )}
        {adminTab === 'customers' && (
          <AdminCustomers />
        )}
        {adminTab === 'coupons' && (
          <AdminCoupons />
        )}
        {adminTab === 'homepage_cms' && (
          <AdminHomepageBuilder />
        )}
        {adminTab === 'banners' && (
          <AdminBanners />
        )}
        {adminTab === 'blog' && (
          <AdminBlog />
        )}
        {adminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onUpdateSettings={(newS) => setSettings(newS)}
          />
        )}
      </AdminLayout>
    );
  }

  // Storefront Render
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C3829] flex flex-col selection:bg-[#EAEFEA] selection:text-[#1C3829]">
      
      {/* 1. Announcement Ticker Bar */}
      <TopAnnouncementBar
        settings={settings}
        onCouponClick={(code) => {
          showToast('Coupon Copied!', `Code ${code} ready to use at checkout.`, 'info');
        }}
      />

      {/* 2. Primary Navigation */}
      <Navbar
        settings={settings}
        categories={categories}
        collections={collections}
        activePath={currentRoute}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCart={openCart}
        onOpenWishlist={openWishlist}
        onNavigate={navigate}
      />

      {/* 3. Main Route Content */}
      <main className="flex-1">
        
        {/* Home */}
        {(currentRoute === '/' || currentRoute === '') && (
          <HomePage
            homepageSections={homepageSections}
            banners={banners}
            categories={categories}
            collections={collections}
            products={products}
            settings={settings}
            posts={blogPosts}
            onNavigate={navigate}
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToCategory={(catId) => navigate(`/category/${catId}`)}
            onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
            onNavigateToPost={(slug) => navigate(`/blog/${slug}`)}
          />
        )}

        {/* Shop All Catalog & Category Routes */}
        {(pathPart.startsWith('/shop') || pathPart.startsWith('/category/')) && (
          (() => {
            const isCatRoute = pathPart.startsWith('/category/');
            const catSlug = isCatRoute ? pathPart.replace('/category/', '').trim() : undefined;
            const searchParams = new URLSearchParams(queryPart || '');
            const queryCategory = searchParams.get('category') || (catSlug && catSlug !== '' ? catSlug : undefined);
            const queryDepartment = searchParams.get('department') || undefined;
            const querySearch = searchParams.get('search') || undefined;
            const querySale = searchParams.get('sale') === 'true';

            return (
              <ShopPage
                products={products}
                categories={categories}
                initialCategorySlug={queryCategory}
                initialDepartment={queryDepartment}
                initialSearch={querySearch}
                initialSaleOnly={querySale}
                onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
                onNavigateToCategory={(slug) => navigate(slug ? `/category/${slug}` : '/shop')}
              />
            );
          })()
        )}

        {/* Product Detail */}
        {isProductDetail && (
          <ProductDetailPage
            slug={productSlug}
            allProducts={products}
            onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToCart={() => navigate('/cart')}
            onNavigateToCheckout={() => navigate('/checkout')}
            onNavigateToCategory={(slug) => navigate(`/category/${slug}`)}
          />
        )}

        {/* Cart Page */}
        {currentRoute === '/cart' && (
          <CartPage
            settings={settings}
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToCheckout={() => navigate('/checkout')}
            onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
          />
        )}

        {/* Checkout Page */}
        {currentRoute === '/checkout' && (
          <CheckoutPage
            settings={settings}
            onNavigateToConfirmation={(orderId) => navigate(`/order-confirmation/${orderId}`)}
            onNavigateToCart={() => navigate('/cart')}
          />
        )}

        {/* Order Confirmation */}
        {isOrderConfirmation && (
          <OrderConfirmationPage
            orderId={orderConfirmId}
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToAccount={() => navigate('/account')}
          />
        )}

        {/* Customer Portal Account */}
        {currentRoute === '/account' && (
          <AccountPage
            onNavigateToShop={() => navigate('/shop')}
            onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
            onNavigateToConfirmation={(orderId) => navigate(`/order-confirmation/${orderId}`)}
          />
        )}

        {/* About Brand Manifesto */}
        {currentRoute === '/about' && (
          <AboutPage onNavigateToShop={() => navigate('/shop')} />
        )}

        {/* The Botanical Journal Blog Index */}
        {currentRoute === '/blog' && (
          <BlogPage
            posts={blogPosts}
            onSelectPost={(slug) => navigate(`/blog/${slug}`)}
          />
        )}

        {/* Single Blog Article */}
        {isBlogPostDetail && (
          (() => {
            const foundPost = blogPosts.find(p => p.slug === blogSlug) || blogPosts[0];
            return (
              <BlogPostPage
                post={foundPost}
                onBackToBlog={() => navigate('/blog')}
                onNavigateToShop={() => navigate('/shop')}
              />
            );
          })()
        )}

        {/* Contact Concierge */}
        {currentRoute === '/contact' && (
          <ContactPage settings={settings} />
        )}

        {/* Auth Pages */}
        {currentRoute === '/login' && (
          <AuthPages mode="login" onNavigate={navigate} />
        )}
        {currentRoute === '/register' && (
          <AuthPages mode="register" onNavigate={navigate} />
        )}
        {currentRoute === '/forgot-password' && (
          <AuthPages mode="forgot-password" onNavigate={navigate} />
        )}

        {/* Policy Pages */}
        {currentRoute === '/privacy' && (
          <PolicyPages type="privacy" settings={settings} />
        )}
        {currentRoute === '/terms' && (
          <PolicyPages type="terms" settings={settings} />
        )}
        {currentRoute === '/shipping' && (
          <PolicyPages type="shipping" settings={settings} />
        )}
        {currentRoute === '/refund' && (
          <PolicyPages type="refund" settings={settings} />
        )}

      </main>

      {/* 4. Global Footer */}
      <Footer
        settings={settings}
        categories={categories}
        onNavigate={navigate}
      />

      {/* 5. Global Drawers & Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(slug) => navigate(`/product/${slug}`)}
        onSearchSubmit={(query) => navigate(`/shop?search=${encodeURIComponent(query)}`)}
      />

      <CartDrawer
        onNavigateToCart={() => navigate('/cart')}
        onNavigateToCheckout={() => navigate('/checkout')}
        onNavigateToShop={() => navigate('/shop')}
      />

      <WishlistDrawer
        onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
        onNavigateToShop={() => navigate('/shop')}
      />

      <QuickViewModal
        onNavigateToProduct={(slug) => navigate(`/product/${slug}`)}
      />

    </div>
  );
};

export default App;
