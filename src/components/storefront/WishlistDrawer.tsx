import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface Props {
  onNavigateToProduct: (slug: string) => void;
  onNavigateToShop: () => void;
}

export const WishlistDrawer: React.FC<Props> = ({
  onNavigateToProduct,
  onNavigateToShop
}) => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const formatCurrency = (amount: number) => {
    return `₹${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#FAF8F5] border-l border-[#EAE5DA] shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#ECE7DE] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600 shrink-0" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C3829] truncate">Your Wishlist</h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAEFEA] text-[#1C3829] shrink-0">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 -mr-1 rounded-lg text-stone-400 hover:text-[#1C3829] hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {wishlist.length === 0 ? (
              <div className="py-12 sm:py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F5ECE8] text-rose-500 flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1C3829]">Your wishlist is empty</h4>
                  <p className="text-xs text-[#6B7B71] mt-1 max-w-xs mx-auto">
                    Save your favorite clean skincare formulas and home kitchen pieces for later.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsWishlistOpen(false);
                    onNavigateToShop();
                  }}
                  className="bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-none transition-colors cursor-pointer"
                >
                  EXPLORE SHOP
                </button>
              </div>
            ) : (
              wishlist.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div
                    key={item.productId}
                    className="flex gap-3 p-3 rounded-lg bg-white border border-[#EAE5DA] shadow-2xs"
                  >
                    <div 
                      onClick={() => {
                        setIsWishlistOpen(false);
                        onNavigateToProduct(item.product.slug);
                      }}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded bg-[#FAF8F5] shrink-0 p-1 cursor-pointer border border-[#ECE7DE]"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 
                            onClick={() => {
                              setIsWishlistOpen(false);
                              onNavigateToProduct(item.product.slug);
                            }}
                            className="text-xs sm:text-sm font-bold text-[#1C3829] truncate hover:text-[#2A4E3B] cursor-pointer leading-snug"
                          >
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromWishlist(item.productId)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1 -mt-1 -mr-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#1C3829] mt-1 block">
                          {formatCurrency(price)}
                        </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            addToCart(item.product, 1, item.product.variants?.[0]);
                            removeFromWishlist(item.productId);
                          }}
                          className="w-full py-2 px-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>MOVE TO BAG</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#ECE7DE] bg-white space-y-2 shrink-0">
              <button
                onClick={() => {
                  wishlist.forEach((item) => {
                    addToCart(item.product, 1, item.product.variants?.[0]);
                  });
                  clearWishlist();
                }}
                className="w-full py-3 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD ALL TO BAG</span>
              </button>
              <button
                onClick={clearWishlist}
                className="w-full py-1.5 text-center text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
              >
                Clear Wishlist
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
