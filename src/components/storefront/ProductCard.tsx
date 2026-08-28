import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useQuickView } from '../../context/QuickViewContext';

interface Props {
  product: Product;
  onProductClick: (slug: string) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onProductClick }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { openQuickView } = useQuickView();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isSaved = isInWishlist(product.id);
  const currentPrice = Number(product.salePrice ?? product.price ?? 0);
  const originalPrice = product.salePrice && product.price && product.price > product.salePrice ? Number(product.price) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, product.variants?.[0]);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const formatPrice = (val: number) => {
    return `₹${Number.isInteger(val) ? val : val.toFixed(2)}`;
  };

  return (
    <div 
      onClick={() => onProductClick(product.slug)}
      className="group relative bg-white rounded-xl border border-[#E5E7EB] hover:border-[#1C3829] p-3 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer"
    >
      {/* Top Media & Image Stage */}
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F8F9FA] mb-3 border border-[#F0F2F5] flex items-center justify-center">
        
        {/* Amazon-Style Top Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
          {product.bestseller && (
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#C45500] text-white tracking-tight uppercase shadow-xs">
              #1 Best Seller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#CC0C39] text-white tracking-tight uppercase shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.newArrival && !product.bestseller && !discountPercent && (
            <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-sm bg-[#1C3829] text-white tracking-tight uppercase shadow-xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart Action (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
            isSaved 
              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-xs' 
              : 'bg-white/90 border-stone-200 text-stone-500 hover:text-rose-600 hover:bg-white shadow-2xs'
          }`}
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          title={isSaved ? "Saved to wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick View Hover Button (Desktop) */}
        <div className="absolute inset-x-2 bottom-2 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="w-full py-1.5 bg-white/95 hover:bg-white text-[#1C3829] text-[11px] font-bold uppercase tracking-wider rounded border border-stone-300 shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#71717A] uppercase tracking-wider truncate mb-1">
            <span className="text-[#1C3829] font-bold">{product.brand || 'PURELIS'}</span>
            <span>•</span>
            <span className="truncate">{product.categoryName || 'Skincare'}</span>
          </div>

          {/* Product Title (Aligned 2 Lines) */}
          <h3
            className="text-xs sm:text-[13px] font-semibold text-[#18181B] group-hover:text-[#1C3829] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[34px] sm:min-h-[38px]"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex text-[#FFA41C]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'text-stone-300'}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#0F1111]">
              {(product.rating || 5.0).toFixed(1)}
            </span>
            <span className="text-[11px] text-[#565959]">
              ({product.reviewCount || 24})
            </span>
          </div>
        </div>

        {/* Pricing Block & Amazon-Style Details */}
        <div className="pt-1 space-y-2">
          
          {/* Price Layout */}
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
            {discountPercent > 0 && (
              <span className="text-xs sm:text-sm font-semibold text-[#CC0C39]">
                -{discountPercent}%
              </span>
            )}
            <span className="text-base sm:text-lg font-bold text-[#0F1111] tracking-tight">
              {formatPrice(currentPrice)}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-xs text-[#565959] line-through">
                M.R.P: {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Free Delivery & Stock Note */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#565959]">
            <span className="text-[#007600] font-medium truncate">
              {currentPrice >= 499 ? 'FREE Delivery' : 'Standard Shipping'}
            </span>
            {product.volumeOrWeight && (
              <span className="text-[#71717A] shrink-0">{product.volumeOrWeight}</span>
            )}
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              addedAnimation
                ? 'bg-emerald-700 text-white'
                : 'bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 animate-bounce" />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>ADD TO CART</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
