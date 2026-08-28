import React, { useState } from 'react';
import { 
  X, Plus, Minus, Trash2, ShoppingBag, 
  ArrowRight, ShieldCheck, Tag, Sparkles 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Props {
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
  onNavigateToCart: () => void;
}

export const CartDrawer: React.FC<Props> = ({
  onNavigateToCheckout,
  onNavigateToShop,
  onNavigateToCart
}) => {
  const {
    cart,
    itemCount,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    grandTotal,
    appliedCoupon,
    couponError,
    freeShippingThreshold,
    freeShippingProgress,
    amountNeededForFreeShipping,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [applying, setApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setApplying(true);
    await applyCoupon(promoInput.trim());
    setApplying(false);
    setPromoInput('');
  };

  const formatCurrency = (amount: number) => {
    return `₹${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-[#FAF8F5] border-l border-[#EAE5DA] shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#ECE7DE] bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-[#1C3829] shrink-0" />
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C3829] truncate">
                Your Shopping Bag
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAEFEA] text-[#1C3829] shrink-0 whitespace-nowrap">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 -mr-1 rounded-lg text-stone-400 hover:text-[#1C3829] hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#EAEFEA] px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[#D8E3DA] shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1C3829] mb-1.5 gap-2">
              {amountNeededForFreeShipping > 0 ? (
                <span className="truncate">
                  Add <strong>{formatCurrency(amountNeededForFreeShipping)}</strong> more for <strong>FREE SHIPPING</strong>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold truncate">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Unlocked FREE Shipping! 🎉
                </span>
              )}
              <span className="text-[11px] text-[#47584E] shrink-0">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-[#D1DFD4] h-1.5 sm:h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1C3829] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="py-12 sm:py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#ECE6DB] text-[#8DA792] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1C3829]">Your bag is empty</h4>
                  <p className="text-xs text-[#6B7B71] mt-1 max-w-xs mx-auto">
                    Discover our natural botanical formulas and mindful home essentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToShop();
                  }}
                  className="bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-none transition-colors cursor-pointer"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || 'std'}`}
                  className="flex gap-3 p-3 rounded-lg bg-white border border-[#EAE5DA] shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded bg-[#FAF8F5] shrink-0 p-1 border border-[#ECE7DE]">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1C3829] truncate leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variantId)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 -mt-1 -mr-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#7A8A7F] mt-0.5 truncate">
                          Variant: {item.selectedVariant.name}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#DDD5C7] rounded bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="p-1 text-[#1C3829] hover:bg-stone-200 rounded-l transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#1C3829] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="p-1 text-[#1C3829] hover:bg-stone-200 rounded-r transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <span className="text-xs sm:text-sm font-bold text-[#1C3829]">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#ECE7DE] bg-white space-y-3.5 shrink-0">
              
              {/* Promo code input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#EAEFEA] border border-[#D5DFD7]">
                  <div className="flex items-center gap-1.5 truncate">
                    <Tag className="w-3.5 h-3.5 text-[#1C3829] shrink-0" />
                    <span className="text-xs font-bold text-[#1C3829] truncate">
                      {appliedCoupon.code} applied (-{formatCurrency(discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer shrink-0 ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="ENTER COUPON (E.G. PURE20)"
                    className="flex-1 uppercase text-[11px] sm:text-xs px-3 py-2 border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829] font-medium"
                  />
                  <button
                    type="submit"
                    disabled={applying || !promoInput.trim()}
                    className="px-4 py-2 bg-stone-800 hover:bg-black disabled:opacity-50 text-white text-[11px] sm:text-xs font-bold uppercase transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-[#5E6E64] pt-1.5 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C3829]">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingAmount === 0 ? <strong className="text-emerald-700">FREE</strong> : formatCurrency(shippingAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-bold text-[#1C3829] pt-1.5 border-t border-[#ECE7DE]">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3 sm:py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.14em] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CHECKOUT • {formatCurrency(grandTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCart();
                  }}
                  className="w-full py-1.5 text-center text-xs font-semibold text-[#1C3829] hover:underline cursor-pointer"
                >
                  View Full Cart Page
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] sm:text-[11px] text-[#7A8A7F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8DA792]" />
                <span>Encrypted 256-Bit Secure Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
