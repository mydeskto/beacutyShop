import React, { useState, useEffect } from 'react';
import { 
  Star, Heart, ShoppingBag, Truck, RotateCcw, 
  Leaf, Sparkles, ChevronRight, Check, 
  Plus, Minus, Share2, ShieldCheck, ArrowRight
} from 'lucide-react';
import { Product, ProductVariant, ProductReview } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { ProductCard } from '../../components/storefront/ProductCard';

interface Props {
  slug?: string;
  product?: Product;
  allProducts?: Product[];
  onNavigateToProduct: (slug: string) => void;
  onNavigateToCheckout?: () => void;
  onNavigateToCategory?: (slug: string) => void;
  onNavigateToShop?: () => void;
  onNavigateToCart?: () => void;
}

export const ProductDetailPage: React.FC<Props> = ({
  slug,
  product: initialProduct,
  allProducts: initialAllProducts,
  onNavigateToProduct,
  onNavigateToCheckout,
  onNavigateToCategory,
  onNavigateToShop,
  onNavigateToCart
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [allProducts, setAllProducts] = useState<Product[]>(initialAllProducts || []);
  const [loading, setLoading] = useState(!initialProduct);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'howToUse' | 'shipping'>('description');
  
  // Reviews state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');

  // Sync initialAllProducts when available
  useEffect(() => {
    if (initialAllProducts && initialAllProducts.length > 0) {
      setAllProducts(initialAllProducts);
    }
  }, [initialAllProducts]);

  useEffect(() => {
    let isMounted = true;

    const fetchProductData = async () => {
      if (initialProduct) {
        if (isMounted) {
          setProduct(initialProduct);
          setLoading(false);
        }
      } else if (slug) {
        if (isMounted) setLoading(true);
        try {
          const found = await api.getProductBySlugOrId(slug);
          if (isMounted) {
            setProduct(found);
            setLoading(false);
          }
        } catch (err) {
          console.error('Failed to fetch product:', err);
          if (isMounted) setLoading(false);
        }
      }
      
      if (!initialAllProducts || initialAllProducts.length === 0) {
        try {
          const prods = await api.getProducts();
          if (isMounted) setAllProducts(prods);
        } catch (err) {
          console.error('Failed to fetch all products:', err);
        }
      }
    };

    fetchProductData();

    return () => {
      isMounted = false;
    };
  }, [slug, initialProduct]);

  useEffect(() => {
    if (product) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveImageIdx(0);
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
      setQuantity(1);
      loadReviews(product.id);
    }
  }, [product?.id]);

  const loadReviews = async (pId: string) => {
    try {
      const revs = await api.getProductReviews(pId);
      setReviews(revs || []);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const formatPrice = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(Number(val))) return '₹0';
    const num = Number(val);
    return `₹${Number.isInteger(num) ? num : num.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#1C3829] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#1C3829] tracking-widest uppercase">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EAEFEA] flex items-center justify-center text-[#1C3829] mb-4">
          <Leaf className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829]">Product Not Found</h2>
        <p className="text-xs sm:text-sm text-[#5E6E64] mt-2 mb-6 max-w-md">
          The skincare item or botanical formula you are looking for may have been moved or updated.
        </p>
        <button
          onClick={() => (onNavigateToShop ? onNavigateToShop() : onNavigateToProduct('/shop'))}
          className="px-6 py-3 bg-[#1C3829] text-white text-xs font-bold uppercase tracking-wider transition-colors hover:bg-[#2A4E3B] cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const currentPrice = Number(
    selectedVariant 
      ? (selectedVariant.salePrice ?? selectedVariant.price ?? 0) 
      : (product.salePrice ?? product.price ?? 0)
  );
  
  const originalPrice = selectedVariant 
    ? (selectedVariant.salePrice ? Number(selectedVariant.price) : null) 
    : (product.salePrice && product.price && product.price > product.salePrice ? Number(product.price) : null);

  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'];

  // Frequently bought together bundle item
  const bundleProduct = (allProducts || []).find(p => p.id !== product.id && p.department === product.department) || (allProducts && allProducts.length > 0 ? allProducts.find(p => p.id !== product.id) : undefined);

  const relatedProducts = (allProducts || [])
    .filter(p => p.id !== product.id && (p.categoryId === product.categoryId || p.department === product.department))
    .slice(0, 4);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    } else if (onNavigateToCart) {
      onNavigateToCart();
    } else {
      window.location.hash = '#/checkout';
    }
  };

  const handleAddBundleToBag = () => {
    addToCart(product, quantity, selectedVariant);
    if (bundleProduct) {
      addToCart(bundleProduct, 1, bundleProduct.variants?.[0]);
    }
    showToast('Bundle Added! 🌿', 'Routine essentials successfully added to your bag.', 'success');
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied!', 'Product URL copied to clipboard.', 'info');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle.trim() || !newReviewComment.trim()) {
      showToast('Missing Fields', 'Please complete the review title and comments.', 'error');
      return;
    }
    try {
      await api.addReview({
        productId: product.id,
        productName: product.name,
        authorName: newReviewAuthor.trim() || 'Verified Customer',
        rating: newRating,
        title: newReviewTitle.trim(),
        comment: newReviewComment.trim()
      });
      showToast('Review Submitted!', 'Thank you for sharing your experience.', 'success');
      setShowReviewModal(false);
      setNewReviewTitle('');
      setNewReviewComment('');
      loadReviews(product.id);
    } catch (err) {
      console.error('Failed to post review:', err);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-4 sm:py-8 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#7A8A7F] mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <button 
            onClick={() => { window.location.hash = '#/'; }} 
            className="hover:text-[#1C3829] cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <button 
            onClick={() => {
              if (onNavigateToCategory) {
                onNavigateToCategory(product.categoryId || 'all');
              } else {
                window.location.hash = `#/category/${product.categoryId || ''}`;
              }
            }} 
            className="hover:text-[#1C3829] cursor-pointer truncate max-w-[120px] sm:max-w-none"
          >
            {product.categoryName || 'Catalog'}
          </button>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-[#1C3829] font-semibold truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
        </nav>

        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 pb-10 sm:pb-16">
          
          {/* Left Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-[#EAE5DA] p-2 sm:p-4 shadow-xs flex items-center justify-center">
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 z-10 bg-[#1C3829] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 uppercase tracking-wider">
                  {discountPercent}% OFF
                </div>
              )}
              <img
                src={productImages[activeImageIdx] || productImages[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg sm:rounded-xl transition-all duration-300"
              />
            </div>

            {/* Thumbnail selector */}
            {productImages.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden bg-white p-1 border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIdx === i ? 'border-[#1C3829] shadow-xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded" />
                  </button>
                ))}
              </div>
            )}

            {/* Value Guarantees Box */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#EAEFEA] border border-[#D5DFD7] text-center">
                <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C3829] mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1C3829] block">100% Clean</span>
                <span className="text-[8px] sm:text-[9px] text-[#5E6E64] block">Botanical Actives</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#EAEFEA] border border-[#D5DFD7] text-center">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C3829] mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1C3829] block">Fast Shipping</span>
                <span className="text-[8px] sm:text-[9px] text-[#5E6E64] block">Eco Packaged</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#EAEFEA] border border-[#D5DFD7] text-center">
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1C3829] mx-auto mb-1" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1C3829] block">30-Day Returns</span>
                <span className="text-[8px] sm:text-[9px] text-[#5E6E64] block">Satisfaction Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Buy Box (6 cols) */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-[#6E7E73]">
                    {product.brand || 'PURELIS'}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-[10px] sm:text-xs text-[#7A8A7F]">{product.categoryName}</span>
                </div>
                <button
                  onClick={handleShareProduct}
                  className="text-stone-400 hover:text-[#1C3829] p-1 transition-colors cursor-pointer"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C3829] leading-tight">
                {product.name}
              </h1>

              {/* Reviews Summary */}
              <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1C3829]">{product.rating || '5.0'} / 5.0</span>
                <span className="text-xs text-[#7A8A7F]">({product.reviewCount || reviews.length || 0} reviews)</span>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-xs font-semibold text-[#1C3829] underline hover:text-[#2A4E3B] cursor-pointer"
                >
                  Write a review
                </button>
              </div>
            </div>

            {/* Price Row */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#EAE5DA] flex items-baseline justify-between shadow-2xs">
              <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829]">
                  {formatPrice(currentPrice)}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-sm sm:text-base text-[#8A9B8F] line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-[#1C3829] text-white">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              {product.volumeOrWeight && (
                <span className="text-[11px] sm:text-xs text-[#7A8A7F]">{product.volumeOrWeight}</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#47584E] leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1C3829] block">
                  Select Size / Option:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-2 sm:p-2.5 rounded-lg text-xs text-left border transition-all cursor-pointer ${
                        selectedVariant?.id === v.id
                          ? 'border-[#1C3829] bg-[#1C3829] text-white shadow-2xs'
                          : 'border-[#DDD5C7] bg-white text-[#222E26] hover:border-stone-400'
                      }`}
                    >
                      <span className="font-bold block truncate">{v.name}</span>
                      <span className="text-[11px] opacity-80 mt-0.5 block">
                        {formatPrice(v.salePrice ?? v.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Level Indicator */}
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-semibold text-emerald-950 text-xs">
                {(product.stockQuantity || 0) > 10 ? 'In Stock — Ready to ship' : `Low Stock: Only ${product.stockQuantity || 5} remaining`}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#DDD5C7] rounded bg-white h-11 sm:h-12 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 h-full text-[#1C3829] hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#1C3829] min-w-[20px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 h-full text-[#1C3829] hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={() => addToCart(product, quantity, selectedVariant)}
                  className="flex-1 h-11 sm:h-12 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] rounded-none transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer truncate px-3"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">ADD TO BAG • {formatPrice(currentPrice * quantity)}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`h-11 sm:h-12 w-11 sm:w-12 rounded border flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    isSaved ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-2xs' : 'bg-white border-[#DDD5C7] text-stone-600 hover:text-rose-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full h-11 sm:h-12 bg-[#2D4A38] hover:bg-[#1C3829] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] rounded-none transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡ BUY NOW WITH 1-CLICK</span>
              </button>
            </div>

            {/* Frequently Bought Together Widget */}
            {bundleProduct && (
              <div className="mt-6 p-3.5 sm:p-4 rounded-xl bg-white border border-[#EAE5DA] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C3829]">
                  <Sparkles className="w-3.5 h-3.5 text-[#8DA792]" />
                  <span>Frequently Paired Together</span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={bundleProduct.images?.[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'}
                    alt={bundleProduct.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded object-cover bg-[#FAF8F5] border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#1C3829] truncate">{bundleProduct.name}</h4>
                    <span className="text-xs font-semibold text-[#1C3829] mt-0.5 block">
                      +{formatPrice(bundleProduct.salePrice ?? bundleProduct.price)}
                    </span>
                  </div>
                  <button
                    onClick={handleAddBundleToBag}
                    className="px-3 py-2 bg-[#EAEFEA] hover:bg-[#D5DFD7] text-[#1C3829] text-[11px] sm:text-xs font-bold uppercase rounded-none transition-colors shrink-0 cursor-pointer"
                  >
                    Add Pair
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Detailed Tabs Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#EAE5DA] p-4 sm:p-8 lg:p-10 shadow-2xs mb-10 sm:mb-16">
          <div className="flex border-b border-[#ECE7DE] gap-4 sm:gap-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: 'description', label: 'Full Description' },
              { id: 'ingredients', label: 'Key Ingredients & Specs' },
              { id: 'howToUse', label: 'How to Use Ritual' },
              { id: 'shipping', label: 'Shipping & Returns' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 text-xs sm:text-sm uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#1C3829] border-b-2 border-[#1C3829]'
                    : 'text-[#7A8A7F] hover:text-[#1C3829]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-5 sm:pt-6">
            {activeTab === 'description' && (
              <div className="space-y-5 max-w-3xl">
                <p className="text-xs sm:text-sm text-[#222E26] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
                {product.benefits && product.benefits.length > 0 && (
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C3829] mb-2.5">Key Formula Benefits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#3E5044]">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-5 max-w-3xl">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C3829] mb-1.5">Botanical & Active Ingredients</h4>
                    <p className="text-xs text-[#5E6E64] mb-3">
                      Formulated strictly without sulfates, parabens, phthalates, synthetic dyes, or harsh denatured alcohols.
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#222E26]">
                      {product.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8DA792]" />
                          <span>{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="pt-4 border-t border-stone-100">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C3829] mb-3">Product Specifications</h4>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <div key={key} className="p-2.5 rounded bg-[#FAF8F5] border border-[#ECE7DE]">
                          <dt className="text-[10px] sm:text-[11px] font-bold text-[#7A8A7F] uppercase">{key}</dt>
                          <dd className="font-semibold text-[#1C3829] mt-0.5">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div className="max-w-3xl space-y-3 text-xs sm:text-sm text-[#222E26] leading-relaxed">
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C3829]">Recommended Ritual</h4>
                <p>{product.howToUse || 'Apply 2-3 drops or a dime-sized amount onto cleansed skin morning and night. Gently massage in upward motions until fully absorbed.'}</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-3xl space-y-3 text-xs sm:text-sm text-[#222E26] leading-relaxed">
                <h4 className="font-serif font-bold text-sm sm:text-base text-[#1C3829]">Shipping & Guarantee</h4>
                <p>
                  Every order is packed by hand in biodegradable materials. Free standard shipping applies on all qualifying orders.
                </p>
                <p>
                  If you are not delighted with your results, return the item within 30 days of delivery for a full refund.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-[#EAE5DA] p-4 sm:p-8 lg:p-10 shadow-2xs mb-10 sm:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#ECE7DE]">
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C3829] uppercase">
                Customer Reviews
              </h3>
              <p className="text-xs text-[#7A8A7F] mt-0.5">
                Authentic feedback from verified purchasers
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer text-center"
            >
              Write a Review
            </button>
          </div>

          <div className="pt-6 space-y-4">
            {reviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7A8A7F]">
                Be the first to share your experience with this formula!
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 sm:p-4 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'opacity-30'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#1C3829]">{rev.title}</span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-[#7A8A7F]">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-[#3E5044] leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B7B71] pt-1">
                    <span className="font-semibold text-[#1C3829]">{rev.authorName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-emerald-700 font-medium flex items-center gap-0.5 text-[10px]">
                        • <Check className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-4 sm:space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#ECE7DE] pb-3">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C3829] uppercase">
                You May Also Love
              </h3>
              <button
                onClick={() => {
                  if (onNavigateToCategory) {
                    onNavigateToCategory(product.categoryId || 'all');
                  } else {
                    window.location.hash = `#/category/${product.categoryId || ''}`;
                  }
                }}
                className="text-xs font-bold uppercase tracking-wider text-[#1C3829] hover:underline cursor-pointer"
              >
                View More →
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onProductClick={onNavigateToProduct}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Sticky Mobile Add to Bag Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#EAE5DA] p-3 z-40 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-[#1C3829] truncate">{product.name}</div>
          <div className="text-xs font-bold text-[#1C3829]">{formatPrice(currentPrice)}</div>
        </div>
        <button
          onClick={() => addToCart(product, quantity, selectedVariant)}
          className="bg-[#1C3829] active:bg-[#12241A] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-none flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>ADD TO BAG</span>
        </button>
      </div>

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-5 sm:p-7 space-y-4 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C3829]">
              Review {product.name}
            </h3>

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Your Rating</label>
                <div className="flex gap-2 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-current' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Amelia C."
                  className="w-full text-xs p-2.5 rounded border border-stone-300 bg-stone-50 focus:outline-hidden focus:border-[#1C3829]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Beautiful hydration & clean feel!"
                  className="w-full text-xs p-2.5 rounded border border-stone-300 bg-stone-50 focus:outline-hidden focus:border-[#1C3829]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Detailed Thoughts</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Share how this product felt and performed..."
                  className="w-full text-xs p-2.5 rounded border border-stone-300 bg-stone-50 focus:outline-hidden focus:border-[#1C3829]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2.5 border border-stone-300 text-xs font-bold uppercase rounded-none text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase rounded-none transition-colors cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
