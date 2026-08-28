import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { useQuickView } from '../../context/QuickViewContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ProductVariant } from '../../types';

interface Props {
  onNavigateToProduct: (slug: string) => void;
}

export const QuickViewModal: React.FC<Props> = ({ onNavigateToProduct }) => {
  const { selectedProduct, closeQuickView } = useQuickView();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedVariant(selectedProduct.variants?.[0]);
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const currentPrice = selectedVariant 
    ? (selectedVariant.salePrice ?? selectedVariant.price) 
    : (selectedProduct.salePrice ?? selectedProduct.price);
  
  const originalPrice = selectedVariant 
    ? (selectedVariant.salePrice ? selectedVariant.price : null) 
    : (selectedProduct.salePrice ? selectedProduct.price : null);

  const isSaved = isInWishlist(selectedProduct.id);

  const formatCurrency = (amount: number) => {
    return `₹${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedVariant);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-[#FAF8F5] w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl border border-[#EAE5DA] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-500 hover:text-[#1C3829] shadow-sm transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 p-4 sm:p-6">
          
          {/* Gallery Column */}
          <div className="md:col-span-6 space-y-2.5">
            <div className="aspect-square rounded-lg overflow-hidden bg-white border border-[#EAE5DA] p-2">
              <img
                src={selectedProduct.images[activeImageIdx] || selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {selectedProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all p-0.5 bg-white shrink-0 cursor-pointer ${
                      activeImageIdx === i ? 'border-[#1C3829]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-3.5">
            <div>
              {/* Category & Department */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#6E7E73]">
                  {selectedProduct.categoryName}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] sm:text-[11px] text-[#7A8A7F]">
                  SKU: {selectedVariant?.sku || selectedProduct.sku}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#1C3829] leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'opacity-40'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1C3829]">{selectedProduct.rating}</span>
                <span className="text-[11px] text-[#7A8A7F]">({selectedProduct.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-2.5">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#1C3829]">
                  {formatCurrency(currentPrice)}
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-xs sm:text-sm text-[#8A9B8F] line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-[#1C3829] text-white">
                    Save {formatCurrency(originalPrice - currentPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-[#4D6154] mt-2 leading-relaxed">
                {selectedProduct.shortDescription || selectedProduct.description}
              </p>

              {/* Variants Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 1 && (
                <div className="mt-3 space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#1C3829] block">
                    Select Option / Size:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-2.5 py-1.5 text-xs rounded border transition-all cursor-pointer ${
                          selectedVariant?.id === v.id
                            ? 'border-[#1C3829] bg-[#1C3829] text-white font-semibold'
                            : 'border-[#DDD5C7] bg-white text-[#222E26] hover:border-stone-400'
                        }`}
                      >
                        {v.name} {v.salePrice ? `(${formatCurrency(v.salePrice)})` : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-semibold text-emerald-900 text-[11px] sm:text-xs">
                  {selectedProduct.stockQuantity > 10 ? 'In Stock — Ready to ship' : `Only ${selectedProduct.stockQuantity} left in stock`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-3 border-t border-[#ECE7DE]">
              <div className="flex items-center gap-2">
                {/* Quantity Input */}
                <div className="flex items-center border border-[#DDD5C7] rounded bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-2 text-[#1C3829] hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-[#1C3829] min-w-[20px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-2 text-[#1C3829] hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 sm:py-3 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] text-white text-xs font-bold uppercase tracking-[0.12em] transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer truncate"
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">ADD TO BAG • {formatCurrency(currentPrice * quantity)}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`p-2.5 rounded border transition-colors cursor-pointer shrink-0 ${
                    isSaved ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white border-[#DDD5C7] text-stone-600 hover:text-rose-600'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  closeQuickView();
                  onNavigateToProduct(selectedProduct.slug);
                }}
                className="w-full text-center text-xs font-semibold text-[#1C3829] hover:underline flex items-center justify-center gap-1 py-1 cursor-pointer"
              >
                <span>View Full Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
