import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Coupon } from '../types';
import { mockDb } from '../services/mockDb';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

interface CartContextType {
  cart: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  freeShippingThreshold: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('purelis_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('purelis_applied_coupon');
    return saved ? JSON.parse(saved) : null;
  });
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const settings = mockDb.getSettings();
  const freeShippingThreshold = settings.freeShippingThreshold || 50;

  useEffect(() => {
    localStorage.setItem('purelis_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('purelis_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('purelis_applied_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity: number = 1, variant?: ProductVariant) => {
    const unitPrice = variant ? (variant.salePrice ?? variant.price) : (product.salePrice ?? product.price);
    const variantId = variant?.id;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: newQty * unitPrice
        };
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId,
          product,
          quantity,
          selectedVariant: variant,
          unitPrice,
          totalPrice: quantity * unitPrice
        };
        return [...prev, newItem];
      }
    });

    showToast(
      'Added to Bag',
      `${product.name}${variant ? ` (${variant.name})` : ''} was added to your shopping bag.`,
      'success'
    );
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
    showToast('Item Removed', 'Product removed from shopping bag', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const res = mockDb.validateCoupon(code, subtotal);
    if (!res.valid) {
      setCouponError(res.error || 'Invalid code');
      showToast('Coupon Failed', res.error, 'error');
      return false;
    }

    setAppliedCoupon(res.coupon!);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Fallback
    }
    showToast('Promo Code Applied', `Saved $${res.discountAmount.toFixed(2)} with code ${code.toUpperCase()}!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('Coupon Removed', 'Promo code removed from order', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Computations
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && subtotal > 0) {
    const res = mockDb.validateCoupon(appliedCoupon.code, subtotal);
    if (res.valid) {
      discountAmount = res.discountAmount;
    }
  }

  const shippingAmount = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : settings.standardShippingFee;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number(((taxableAmount * (settings.taxRatePercentage || 7.5)) / 100).toFixed(2));
  const grandTotal = Number((taxableAmount + shippingAmount + taxAmount).toFixed(2));

  const amountNeededForFreeShipping = Math.max(0, Number((freeShippingThreshold - subtotal).toFixed(2)));
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
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
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
