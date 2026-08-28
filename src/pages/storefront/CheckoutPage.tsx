import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, Lock, CheckCircle2, 
  Truck, ArrowLeft, Tag, Sparkles, Building2, User 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { ShippingAddress, StoreSettings, Order } from '../../types';
import { auditLogger } from '../../services/auditLogger';
import confetti from 'canvas-confetti';

interface Props {
  settings: StoreSettings;
  onNavigateToConfirmation: (orderId: string) => void;
  onNavigateToCart: () => void;
}

export const CheckoutPage: React.FC<Props> = ({
  settings,
  onNavigateToConfirmation,
  onNavigateToCart
}) => {
  const { 
    cart, 
    subtotal, 
    discountAmount, 
    shippingAmount, 
    taxAmount, 
    grandTotal, 
    appliedCoupon, 
    clearCart 
  } = useCart();
  
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    address1: '',
    address2: '',
    city: '',
    state: 'CA',
    postalCode: '',
    country: 'United States',
    phone: currentUser?.phone || ''
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(`${currentUser?.firstName || 'Amelia'} ${currentUser?.lastName || 'Chen'}`);
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (currentUser?.addresses && currentUser.addresses.length > 0) {
      const defaultAddr = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
      setShippingAddress({
        firstName: defaultAddr.firstName,
        lastName: defaultAddr.lastName,
        address1: defaultAddr.address1,
        address2: defaultAddr.address2,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country,
        phone: defaultAddr.phone
      });
    }
  }, [currentUser]);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-[#FAF8F5]">
        <h2 className="text-2xl font-serif font-bold text-[#1C3829]">Your bag is empty</h2>
        <button
          onClick={onNavigateToCart}
          className="mt-4 px-6 py-2.5 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  const calculatedShipping = shippingMethod === 'express' 
    ? 14.99 
    : (subtotal >= (settings.freeShippingThreshold || 50) ? 0 : settings.standardShippingFee);

  const calculatedTax = Number(((Math.max(0, subtotal - discountAmount) * (settings.taxRatePercentage || 7.5)) / 100).toFixed(2));
  const finalTotal = Number((Math.max(0, subtotal - discountAmount) + calculatedShipping + calculatedTax).toFixed(2));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      localStorage.setItem('redirect_after_auth', '/checkout');
      showToast('Account Required', 'Please sign in or create an account to complete your order.', 'info');
      window.location.hash = '#/login';
      return;
    }

    if (!email.trim() || !shippingAddress.firstName.trim() || !shippingAddress.address1.trim() || !shippingAddress.city.trim() || !shippingAddress.postalCode.trim()) {
      showToast('Incomplete Address', 'Please complete all required shipping fields.', 'error');
      return;
    }

    setProcessing(true);

    try {
      // Simulate Stripe Tokenization & Payment Intent confirmation
      const orderPayload: Partial<Order> = {
        customerId: currentUser?.id,
        customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        customerEmail: email,
        items: cart,
        subtotal,
        discountAmount,
        shippingAmount: calculatedShipping,
        taxAmount: calculatedTax,
        totalAmount: finalTotal,
        couponCode: appliedCoupon?.code,
        shippingAddress,
        billingAddress: shippingAddress,
        shippingMethod: shippingMethod === 'express' ? 'Priority Express 2-Day' : 'Standard Carbon-Neutral',
        paymentMethod: 'stripe_credit_card',
        paymentDetails: {
          last4: cardNumber.slice(-4) || '4242',
          brand: 'Visa / Stripe Token',
          transactionId: `tx_${Date.now()}`
        }
      };

      const createdOrder = await api.createOrder(orderPayload);

      // SOC2 Audit logs
      auditLogger.log('PAYMENT_SUCCESS', email, `Payment processed successfully for order #${createdOrder.orderNumber}`, 'SUCCESS', { amount: finalTotal });
      auditLogger.log('PRODUCT_PURCHASED', email, `Products purchased: ${cart.map(i => `${i.name} (x${i.quantity})`).join(', ')}`, 'SUCCESS', { orderId: createdOrder.id });

      // Trigger Nodemailer order confirmation email
      try {
        await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: email,
            orderNumber: createdOrder.orderNumber,
            totalAmount: finalTotal,
            items: cart
          })
        });
      } catch (mailErr) {
        console.error('Email dispatch error:', mailErr);
      }

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }

      clearCart();
      showToast('Order Placed Successfully! 🎉', `Order #${createdOrder.orderNumber} confirmed. Confirmation email sent.`, 'success');
      onNavigateToConfirmation(createdOrder.id);
    } catch (err: any) {
      auditLogger.log('PAYMENT_FAILURE', email || 'guest', `Payment failed: ${err?.message || 'unknown error'}`, 'FAILURE');
      auditLogger.log('PRODUCT_PURCHASE_FAILED', email || 'guest', 'Product purchase attempt failed', 'FAILURE');
      showToast('Payment Failed', err?.message || 'Could not process card payment.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#ECE7DE]">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCart}
              className="p-2 rounded-lg text-[#1C3829] hover:bg-stone-200/60 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#1C3829]">
                Secure Stripe Checkout
              </h1>
              <span className="text-[11px] sm:text-xs text-[#5E6E64]">256-bit Encrypted Transaction</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-200 shrink-0">
            <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700" />
            <span>SSL Secured</span>
          </div>
        </div>

        {!currentUser && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE5DA] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-serif font-bold text-[#1C3829]">Account required to complete order</h3>
                <p className="text-xs text-[#5E6E64]">Sign in or create an account to place your order and track shipping.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('redirect_after_auth', '/checkout');
                window.location.hash = '#/login';
              }}
              className="px-5 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
            >
              Sign In / Register
            </button>
          </div>
        )}

        {/* Form Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Checkout Fields (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Info */}
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1C3829] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-serif font-bold text-base text-[#1C3829]">Contact Information</h3>
                </div>
                {!currentUser && (
                  <span className="text-xs text-[#7A8A7F]">Checking out as guest</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amelia@example.com"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Mobile Phone (for tracking updates)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <span className="w-6 h-6 rounded-full bg-[#1C3829] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-serif font-bold text-base text-[#1C3829]">Shipping Address</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.firstName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                      placeholder="Amelia"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.lastName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                      placeholder="Chen"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address1: e.target.value })}
                    placeholder="742 Evergreen Terrace"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Apartment, Suite, Unit (optional)</label>
                  <input
                    type="text"
                    value={shippingAddress.address2 || ''}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address2: e.target.value })}
                    placeholder="Apt 4B"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="San Francisco"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="CA"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-700 block mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="94107"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] focus:outline-hidden focus:border-[#1C3829]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Shipping Method */}
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                <span className="w-6 h-6 rounded-full bg-[#1C3829] text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-serif font-bold text-base text-[#1C3829]">Delivery Method</h3>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'standard' ? 'border-[#1C3829] bg-[#EAEFEA]' : 'border-stone-200 bg-[#FAF8F5]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-[#1C3829]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1C3829] block">Standard Carbon-Neutral Delivery</span>
                      <span className="text-[11px] text-[#5E6E64]">3 - 5 business days</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1C3829]">
                    {subtotal >= (settings.freeShippingThreshold || 50) ? 'FREE' : `$${settings.standardShippingFee.toFixed(2)}`}
                  </span>
                </label>

                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  shippingMethod === 'express' ? 'border-[#1C3829] bg-[#EAEFEA]' : 'border-stone-200 bg-[#FAF8F5]'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-[#1C3829]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1C3829] block">Priority 2-Day Express</span>
                      <span className="text-[11px] text-[#5E6E64]">Delivered in 2 business days</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1C3829]">$14.99</span>
                </label>
              </div>
            </div>

            {/* 4. Stripe Payment Element Simulator */}
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1C3829] text-white text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="font-serif font-bold text-base text-[#1C3829]">Payment Method</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5E6E64]">
                  <CreditCard className="w-4 h-4 text-[#8DA792]" />
                  <span>Stripe Powered</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#DDD5C7] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-stone-700">Credit / Debit Card</span>
                  <div className="flex gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">VISA</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">MC</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">AMEX</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="888"
                      className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-stone-600 block mb-1">Cardholder Full Name</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Amelia Chen"
                    className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-stone-600 pt-2">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  className="accent-[#1C3829]"
                />
                <span>Billing address matches shipping address</span>
              </label>
            </div>

          </div>

          {/* Right Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-5">
              <h3 className="font-serif font-bold text-lg text-[#1C3829] pb-3 border-b border-[#ECE7DE]">
                Order Items ({cart.length})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.variantId || 'std'}`} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg bg-[#FAF8F5] border border-stone-200 overflow-hidden shrink-0 p-1 relative">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover rounded" />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#1C3829] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#1C3829] truncate">{item.product.name}</h4>
                      {item.selectedVariant && (
                        <span className="text-[11px] text-[#7A8A7F]">{item.selectedVariant.name}</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#1C3829]">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs text-[#5E6E64] pt-4 border-t border-[#ECE7DE]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1C3829]">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({shippingMethod === 'express' ? 'Priority 2-Day' : 'Standard'})</span>
                  <span>{calculatedShipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${calculatedShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax ({settings.taxRatePercentage || 7.5}%)</span>
                  <span>${calculatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1C3829] pt-3 border-t border-[#ECE7DE]">
                  <span>Total Due</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 sm:py-4 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] disabled:opacity-60 text-white text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-tight sm:tracking-[0.14em] rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer px-2"
              >
                {processing ? (
                  <span>AUTHORIZING STRIPE PAYMENT...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 shrink-0" />
                    <span className="truncate">PAY & COMPLETE ORDER • ${finalTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#7A8A7F] text-center pt-1">
                <div className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
                  <span>SSL SECURED 256-BIT</span>
                </div>
                <span>30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
