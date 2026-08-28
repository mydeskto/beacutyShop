import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, User as UserIcon, Heart, ShoppingBag, 
  Menu, X, ChevronDown, ChevronRight, LayoutDashboard, 
  LogOut, ShieldCheck, Tag, Droplets, Sparkles, Check, Copy, Flame, Gift, Compass
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Category, Collection, StoreSettings } from '../../types';

interface NavbarProps {
  categories?: Category[];
  collections?: Collection[];
  settings?: StoreSettings;
  onOpenSearch: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  activePath?: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories = [],
  collections = [],
  settings = {} as StoreSettings,
  onOpenSearch,
  onOpenCart,
  onOpenWishlist,
  activePath = '/',
  onNavigate
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const { currentUser, role, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const shopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const collectionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    setCollectionsDropdownOpen(false);
    setUserMenuOpen(false);
  };

  const handleSidebarSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sidebarSearch.trim()) {
      handleNav(`/shop?search=${encodeURIComponent(sidebarSearch.trim())}`);
      setSidebarSearch('');
    }
  };

  const copyPromo = () => {
    navigator.clipboard.writeText('PURE20');
    setCopiedCode(true);
    showToast('Code Copied!', 'Use PURE20 at checkout for 20% OFF.', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const triggerCart = () => {
    if (onOpenCart) onOpenCart();
    else setIsCartOpen(true);
  };

  const triggerWishlist = () => {
    if (onOpenWishlist) onOpenWishlist();
    else setIsWishlistOpen(true);
  };

  const primaryCategories = [
    { name: 'Cleansers', slug: 'cleansers', desc: 'Gentle clarifying botanical washes', icon: Droplets },
    { name: 'Serums & Actives', slug: 'serums', desc: 'High potency vitamin C & glow elixirs', icon: Sparkles },
    { name: 'Moisturizers', slug: 'moisturizers', desc: 'Deep hydration & barrier repair', icon: Flame },
    { name: 'Sun Care', slug: 'sun-care', desc: 'Mineral broad-spectrum SPF defense', icon: Compass },
    { name: 'Skin Care Kits', slug: 'skin-care-kits', desc: 'Complete 3-step daily ritual sets', icon: Gift },
    { name: 'Best Sellers', slug: 'best-sellers', desc: 'Award-winning client favorites', icon: Tag }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#ECE7DE] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Mobile Hamburger & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#1C3829] hover:bg-[#FAF8F5] rounded-md transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              onClick={() => handleNav('/')}
              className="flex flex-col items-start group text-left cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-5 h-5 text-[#2D5A3D] fill-none stroke-current stroke-[1.8]"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2-1.3 7.7-6 8.8-9 8.8z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                <span className="text-xl sm:text-2xl font-serif font-bold tracking-[0.18em] text-[#1C3829] group-hover:text-[#285038] transition-colors leading-none">
                  PURELIS
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.32em] text-[#6E7E73] font-semibold leading-none pl-6.5 mt-0.5">
                SKINCARE
              </span>
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => handleNav('/')}
              className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors py-1 cursor-pointer ${
                activePath === '/' || activePath === '' ? 'text-[#1C3829] font-bold' : 'text-[#3E4F44] hover:text-[#1C3829]'
              }`}
            >
              HOME
            </button>

            <div 
              className="relative"
              onMouseEnter={() => {
                if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                setShopDropdownOpen(true);
              }}
              onMouseLeave={() => {
                shopTimeoutRef.current = setTimeout(() => setShopDropdownOpen(false), 150);
              }}
            >
              <button
                onClick={() => handleNav('/shop')}
                className={`flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors py-2 cursor-pointer ${
                  activePath.startsWith('/shop') || activePath.startsWith('/category')
                    ? 'text-[#1C3829] font-bold'
                    : 'text-[#3E4F44] hover:text-[#1C3829]'
                }`}
              >
                <span>SHOP</span>
                <ChevronDown className={`w-3 h-3 text-[#6E7E73] transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {shopDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[420px] bg-white rounded-2xl shadow-2xl border border-[#EAE5DA] p-4 z-50 animate-fadeIn">
                  <div className="pb-3 mb-3 border-b border-[#ECE7DE] px-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#1C3829] block">
                        Curated Categories
                      </span>
                      <span className="text-[10px] text-[#7A8A7F]">Explore our botanical and home formulas</span>
                    </div>
                    <button
                      onClick={() => handleNav('/shop')}
                      className="text-[11px] font-bold text-[#1C3829] bg-[#FAF8F5] hover:bg-[#ECE7DE] px-3 py-1.5 rounded-lg border border-[#DDD5C7] transition-colors"
                    >
                      All Catalog →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {primaryCategories.map((cat) => {
                      const IconComp = cat.icon;
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => handleNav(`/category/${cat.slug}`)}
                          className="text-left p-2.5 rounded-xl bg-[#FAF8F5]/60 hover:bg-[#EAEFEA] transition-all group flex items-start gap-2.5 cursor-pointer border border-[#EAE5DA]/50 hover:border-[#8DA792]"
                        >
                          <div className="w-7 h-7 rounded-lg bg-white shadow-2xs text-[#1C3829] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-serif font-bold text-[#1C3829] truncate group-hover:text-[#2A5237]">
                              {cat.name}
                            </div>
                            <div className="text-[10px] text-[#7A8A7F] line-clamp-1">
                              {cat.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div 
              className="relative"
              onMouseEnter={() => {
                if (collectionsTimeoutRef.current) clearTimeout(collectionsTimeoutRef.current);
                setCollectionsDropdownOpen(true);
              }}
              onMouseLeave={() => {
                collectionsTimeoutRef.current = setTimeout(() => setCollectionsDropdownOpen(false), 150);
              }}
            >
              <button
                onClick={() => handleNav('/shop')}
                className={`flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors py-2 cursor-pointer ${
                  activePath.startsWith('/collection')
                    ? 'text-[#1C3829] font-bold'
                    : 'text-[#3E4F44] hover:text-[#1C3829]'
                }`}
              >
                <span>COLLECTIONS</span>
                <ChevronDown className={`w-3 h-3 text-[#6E7E73] transition-transform duration-200 ${collectionsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {collectionsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[360px] bg-white rounded-2xl shadow-2xl border border-[#EAE5DA] p-4 space-y-2 z-50 animate-fadeIn">
                  <div className="pb-3 mb-2 border-b border-[#ECE7DE] px-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif font-bold uppercase tracking-wider text-[#1C3829] block">
                        Featured Rituals
                      </span>
                      <span className="text-[10px] text-[#7A8A7F]">Curated bundles &amp; living essentials</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {collections.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => handleNav(`/collection/${col.slug}`)}
                        className="w-full text-left p-2.5 rounded-xl bg-[#FAF8F5]/60 hover:bg-[#EAEFEA] transition-all flex items-center justify-between group cursor-pointer border border-[#EAE5DA]/50"
                      >
                        <div>
                          <div className="text-xs font-serif font-bold text-[#1C3829] group-hover:text-[#2A5237]">{col.title}</div>
                          {col.subtitle && <div className="text-[10px] text-[#7A8A7F] truncate max-w-[240px]">{col.subtitle}</div>}
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8DA792] group-hover:translate-x-1 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleNav('/shop')}
                    className="w-full text-center py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white rounded-xl text-xs font-bold uppercase tracking-wider mt-2 transition-colors block cursor-pointer shadow-sm"
                  >
                    View All Collections →
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('/about')}
              className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors py-1 cursor-pointer ${
                activePath === '/about' ? 'text-[#1C3829] font-bold' : 'text-[#3E4F44] hover:text-[#1C3829]'
              }`}
            >
              ABOUT US
            </button>

            <button
              onClick={() => handleNav('/blog')}
              className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors py-1 cursor-pointer ${
                activePath.startsWith('/blog') ? 'text-[#1C3829] font-bold' : 'text-[#3E4F44] hover:text-[#1C3829]'
              }`}
            >
              BLOG
            </button>

            <button
              onClick={() => handleNav('/contact')}
              className={`text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors py-1 cursor-pointer ${
                activePath === '/contact' ? 'text-[#1C3829] font-bold' : 'text-[#3E4F44] hover:text-[#1C3829]'
              }`}
            >
              CONTACT
            </button>
          </nav>

          {/* Right: Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#1C3829] hover:text-[#285038] hover:bg-[#FAF8F5] rounded-full transition-colors cursor-pointer"
              aria-label="Search products"
              title="Search Catalog"
            >
              <Search className="w-4.5 h-4.5 stroke-[1.8]" />
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-[#1C3829] hover:text-[#285038] hover:bg-[#FAF8F5] rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                aria-label="Account Settings"
                title="Account"
              >
                <UserIcon className="w-4.5 h-4.5 stroke-[1.8]" />
                {isAdmin && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ring-1 ring-white" />
                )}
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-[#EAE5DA] p-3 z-50 animate-fadeIn"
                >
                  {currentUser ? (
                    <div className="border-b border-[#ECE7DE] pb-3 mb-2 px-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#1C3829]">{currentUser.firstName} {currentUser.lastName}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAEFEA] text-[#1C3829]">
                          {currentUser.role}
                        </span>
                      </div>
                      <span className="text-xs text-[#6B7B71] truncate block">{currentUser.email}</span>
                    </div>
                  ) : (
                    <div className="px-2 pb-3 mb-2 border-b border-[#ECE7DE]">
                      <span className="text-xs text-[#5E6E64] block mb-2 font-medium">Welcome to PURELIS • Sign in or register to manage orders</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleNav('/login')}
                          className="w-full py-2 bg-[#1C3829] hover:bg-[#2D543F] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => handleNav('/register')}
                          className="w-full py-2 bg-[#FAF8F5] hover:bg-[#ECE7DE] text-[#1C3829] text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center border border-[#DDD5C7]"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <button
                      onClick={() => handleNav('/account')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#222E26] hover:bg-[#FAF8F5] rounded-lg text-left cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-[#8DA792]" />
                      <span>My Account &amp; Orders</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('/admin/dashboard')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-left cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                        <span className="font-semibold">Go to Admin Dashboard</span>
                      </button>
                    )}

                    {currentUser && (
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-lg text-left mt-1 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={triggerWishlist}
              className="relative p-2 text-[#1C3829] hover:text-[#285038] hover:bg-[#FAF8F5] rounded-full transition-colors cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-4.5 h-4.5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute 1 right-1 bg-[#8DA792] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={triggerCart}
              className="relative p-2 text-[#1C3829] hover:text-[#285038] hover:bg-[#FAF8F5] rounded-full transition-all flex items-center justify-center cursor-pointer ml-0.5"
              aria-label="Shopping Bag"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute top-1 right-0.5 bg-[#1C3829] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fadeIn">
          <div 
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-[82vw] sm:max-w-sm w-full bg-[#FAF8F5] shadow-2xl flex flex-col z-10 animate-slideRight overflow-hidden border-r border-[#ECE7DE]">
            
            <div className="p-4 bg-white flex items-center justify-between border-b border-[#ECE7DE]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#2D5A3D] fill-none stroke-current stroke-[1.8]"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2-1.3 7.7-6 8.8-9 8.8z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
                <span className="font-serif font-bold text-lg tracking-[0.16em] text-[#1C3829] leading-tight">
                  PURELIS
                </span>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-md hover:bg-stone-100 text-[#1C3829] transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>

            <div className="p-3.5 bg-[#FAF8F5] border-b border-[#ECE7DE]">
              <form onSubmit={handleSidebarSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search botanical formulas..."
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-lg text-xs text-[#1C3829] placeholder-[#8DA792] border border-[#EAE5DA] focus:outline-hidden focus:border-[#1C3829] transition-all"
                />
                <Search className="w-4 h-4 text-[#7A8A7F] absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => handleNav('/')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:bg-white transition-colors"
              >
                HOME
              </button>

              <div>
                <button
                  onClick={() => setMobileShopOpen(!mobileShopOpen)}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:bg-white transition-colors flex items-center justify-between"
                >
                  <span>SHOP</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#6E7E73] transition-transform duration-200 ${mobileShopOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileShopOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-white/80 rounded-lg my-1 border border-[#EAE5DA]">
                    <button
                      onClick={() => handleNav('/shop')}
                      className="w-full text-left py-2 px-2 text-xs font-bold text-[#1C3829] hover:underline"
                    >
                      All Skincare Catalog →
                    </button>
                    {primaryCategories.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => handleNav(`/category/${c.slug}`)}
                        className="w-full text-left py-1.5 px-2 text-xs text-[#55695C] hover:text-[#1C3829] block"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                  className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:bg-white transition-colors flex items-center justify-between"
                >
                  <span>COLLECTIONS</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#6E7E73] transition-transform duration-200 ${mobileCollectionsOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileCollectionsOpen && (
                  <div className="pl-4 pr-2 py-1 space-y-1 bg-white/80 rounded-lg my-1 border border-[#EAE5DA]">
                    {collections.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => handleNav(`/collection/${col.slug}`)}
                        className="w-full text-left py-1.5 px-2 text-xs text-[#55695C] hover:text-[#1C3829] block"
                      >
                        {col.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNav('/about')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:bg-white transition-colors"
              >
                ABOUT US
              </button>

              <button
                onClick={() => handleNav('/blog')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:bg-white transition-colors"
              >
                BLOG
              </button>

              <button
                onClick={() => handleNav('/contact')}
                className="w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-[0.14em] text-[#1C3829] hover:bg-white transition-colors"
              >
                CONTACT
              </button>

              <div className="pt-4 border-t border-[#ECE7DE] space-y-1.5">
                <button
                  onClick={() => handleNav('/account')}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#1C3829] hover:bg-white flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-[#8DA792]" />
                  <span>My Orders &amp; Profile</span>
                </button>

                <button
                  onClick={() => { triggerWishlist(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#1C3829] hover:bg-white flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-[#8DA792]" />
                  <span>Wishlist ({wishlistCount})</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => handleNav('/admin/dashboard')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                {!currentUser ? (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleNav('/login')}
                      className="py-2 bg-[#1C3829] text-white rounded text-xs font-bold text-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => handleNav('/register')}
                      className="py-2 bg-white border border-[#DDD5C7] text-[#1C3829] rounded text-xs font-bold text-center"
                    >
                      Register
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={logout}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 bg-white border-t border-[#ECE7DE]">
              <div className="flex items-center justify-between bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE5DA]">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6E7E73]">Special Promo</div>
                  <div className="text-xs font-bold text-[#1C3829]">PURE20 (20% OFF)</div>
                </div>
                <button
                  onClick={copyPromo}
                  className="px-2.5 py-1 bg-[#1C3829] text-white rounded text-[10px] font-bold hover:bg-[#285038] transition-colors cursor-pointer"
                >
                  {copiedCode ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
