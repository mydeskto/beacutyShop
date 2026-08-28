import React, { useState } from 'react';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  Sparkles, Tag, ShieldCheck, Truck, RotateCcw, ArrowLeft 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { StoreSettings } from '../../types';

interface Props {
  settings: StoreSettings;
  onNavigateToShop: () => void;
  onNavigateToCheckout: () => void;
  onNavigateToProduct: (slug: string) => void;
}

export const CartPage: React.FC<Props> = ({
  settings,
  onNavigateToShop,
  onNavigateToCheckout,
  onNavigateToProduct
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
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoading(true);
    await applyCoupon(couponInput.trim());
    setLoading(false);
    setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-2xl border border-[#EAE5DA] shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1C3829]">Your bag is empty</h2>
          <p className="text-xs sm:text-sm text-[#5E6E64] max-w-xs mx-auto">
            Fill it with organic botanicals, brightening actives, and mindful kitchen essentials.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToShop}
              className="px-8 py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors shadow flex items-center justify-center gap-2 mx-auto"
            >
              <span>EXPLORE ALL PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#ECE7DE]">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C3829]">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-[#5E6E64] mt-1">
              You have {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>

          <button
            onClick={onNavigateToShop}
            className="text-xs font-semibold text-[#1C3829] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Browsing</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#EAEFEA] rounded-xl p-4 sm:p-5 border border-[#D5DFD7] mb-8">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1C3829] mb-2">
            {amountNeededForFreeShipping > 0 ? (
              <span>Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE COMPLIMENTARY SHIPPING</strong></span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-900 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Congratulations! You have qualified for FREE Standard Shipping! 🎉
              </span>
            )}
            <span className="text-xs text-[#5E6E64]">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-[#D1DFD4] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#1C3829] h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Cart Table List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-2xs overflow-hidden">
              <div className="divide-y divide-[#ECE7DE]">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId || 'default'}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Media + Title */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        onClick={() => onNavigateToProduct(item.product.slug)}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-[#FAF8F5] border border-stone-200 shrink-0 p-1 cursor-pointer"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#8DA792] block">
                          {item.product.categoryName}
                        </span>
                        <h3
                          onClick={() => onNavigateToProduct(item.product.slug)}
                          className="text-xs sm:text-sm font-bold text-[#1C3829] hover:text-[#2A4E3B] cursor-pointer truncate"
                        >
                          {item.product.name}
                        </h3>
                        {item.selectedVariant && (
                          <p className="text-xs text-[#7A8A7F] mt-0.5">
                            Option: {item.selectedVariant.name}
                          </p>
                        )}
                        <span className="text-xs font-bold text-[#1C3829] block sm:hidden mt-1">
                          ${item.unitPrice.toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    {/* Stepper + Total Price + Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                      <div className="flex items-center border border-[#DDD5C7] rounded-lg bg-[#FAF8F5]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="px-2.5 py-1.5 text-[#1C3829] hover:bg-stone-200 rounded-l"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#1C3829]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-2.5 py-1.5 text-[#1C3829] hover:bg-stone-200 rounded-r"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#1C3829] min-w-[70px] text-right">
                        ${item.totalPrice.toFixed(2)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-rose-700 hover:underline"
              >
                Clear all items from bag
              </button>
            </div>
          </div>

          {/* Order Summary Box (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-5">
              <h2 className="font-serif font-bold text-lg text-[#1C3829] pb-3 border-b border-[#ECE7DE]">
                Order Summary
              </h2>

              {/* Promo code form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#EAEFEA] border border-[#D5DFD7]">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#1C3829]" />
                    <div>
                      <span className="text-xs font-bold text-[#1C3829] block">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-[#5E6E64]">{appliedCoupon.description}</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-semibold text-rose-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#1C3829] block">
                    Promo or Gift Voucher:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. PURE20"
                      className="flex-1 text-xs uppercase px-3 py-2.5 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                    <button
                      type="submit"
                      disabled={loading || !couponInput.trim()}
                      className="px-4 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase rounded-lg transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#5E6E64] pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C3829]">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingAmount === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${shippingAmount.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({settings.taxRatePercentage || 7.5}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1C3829] pt-3 border-t border-[#ECE7DE]">
                  <span>Grand Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onNavigateToCheckout}
                className="w-full py-4 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.16em] rounded-lg transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A8A7F]">
                  <ShieldCheck className="w-4 h-4 text-[#8DA792]" />
                  <span>Stripe 256-Bit SSL Encrypted Checkout</span>
                </div>
                <p className="text-[10px] text-[#8A9B8F]">
                  Taxes calculated accurately for your shipping destination.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
