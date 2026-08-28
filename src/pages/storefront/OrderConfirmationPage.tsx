import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, Package, Truck, Calendar, 
  MapPin, Printer, ArrowRight, ShieldCheck, Mail 
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';

interface Props {
  orderId: string;
  onNavigateToShop: () => void;
  onNavigateToAccount: () => void;
}

export const OrderConfirmationPage: React.FC<Props> = ({
  orderId,
  onNavigateToShop,
  onNavigateToAccount
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const found = await api.getOrderById(orderId);
        setOrder(found || null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#1C3829] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#1C3829] tracking-wider uppercase">Loading your order receipt...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-[#FAF8F5]">
        <h2 className="text-2xl font-serif font-bold text-[#1C3829]">Order Not Found</h2>
        <p className="text-xs text-[#5E6E64] mt-1">We couldn't retrieve order details for #{orderId}.</p>
        <button
          onClick={onNavigateToShop}
          className="mt-4 px-6 py-2.5 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const steps = [
    { label: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString(), completed: true },
    { label: 'Processing & Blending', date: 'In progress', completed: true },
    { label: 'Eco Packaging', date: 'Pending', completed: order.fulfillmentStatus === 'fulfilled' },
    { label: 'Shipped & En Route', date: 'Expected in 3-4 days', completed: order.fulfillmentStatus === 'fulfilled' },
    { label: 'Delivered', date: 'Safe doorstep drop', completed: false }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Celebration Header */}
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-10 shadow-sm text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#EAEFEA] text-emerald-700 flex items-center justify-center mx-auto border border-[#D5DFD7]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8DA792] block">
              Payment & Authorization Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C3829] mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#5E6E64] mt-2 max-w-lg mx-auto">
              We have sent a detailed receipt and tracking confirmation to <strong className="text-[#1C3829]">{order.customerEmail}</strong>.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="px-4 py-2 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] text-xs">
              <span className="text-[#7A8A7F] block">Order Number</span>
              <strong className="text-sm font-mono text-[#1C3829]">#{order.orderNumber}</strong>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] text-xs">
              <span className="text-[#7A8A7F] block">Order Date</span>
              <strong className="text-sm text-[#1C3829]">{new Date(order.createdAt).toLocaleDateString()}</strong>
            </div>
            <div className="px-4 py-2 rounded-lg bg-[#FAF8F5] border border-[#ECE7DE] text-xs">
              <span className="text-[#7A8A7F] block">Payment Method</span>
              <strong className="text-sm text-[#1C3829]">Stripe Card (••{order.paymentDetails?.last4 || '4242'})</strong>
            </div>
          </div>
        </div>

        {/* Live Tracking Timeline */}
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-8 shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE]">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#1C3829]" />
              <h3 className="font-serif font-bold text-base text-[#1C3829]">Botanical Fulfillment Progress</h3>
            </div>
            {order.trackingNumber && (
              <span className="text-xs font-mono font-semibold text-[#8DA792]">
                Tracking: {order.trackingNumber}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  step.completed ? 'bg-[#1C3829] text-white' : 'bg-stone-100 text-stone-400 border border-stone-300'
                }`}>
                  {step.completed ? '✓' : idx + 1}
                </div>
                <h4 className="text-xs font-bold text-[#1C3829]">{step.label}</h4>
                <span className="text-[10px] text-[#7A8A7F] mt-0.5">{step.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice & Shipping Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Itemized Order (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1C3829] pb-3 border-b border-[#ECE7DE]">
              Ordered Botanical Essentials
            </h3>

            <div className="divide-y divide-[#ECE7DE]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=300&q=80"}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover bg-[#FAF8F5] border border-stone-200 p-1 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1C3829] line-clamp-1">{item.product?.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-[#7A8A7F]">Variant: {item.selectedVariant.name}</p>
                      )}
                      <span className="text-xs text-[#5E6E64]">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1C3829]">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Math */}
            <div className="space-y-1.5 text-xs text-[#5E6E64] pt-4 border-t border-[#ECE7DE]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C3829]">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Discount Applied ({order.couponCode || 'PROMO'})</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({order.shippingMethod})</span>
                <span>{order.shippingAmount === 0 ? <strong className="text-emerald-700">FREE</strong> : `$${order.shippingAmount.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>${order.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#1C3829] pt-2 border-t border-[#ECE7DE]">
                <span>Total Paid</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-[#1C3829] pb-3 border-b border-[#ECE7DE]">
              Shipping Address
            </h3>

            <div className="text-xs text-[#3E5044] space-y-1">
              <p className="font-bold text-[#1C3829]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p className="pt-1 text-[#7A8A7F]">Phone: {order.shippingAddress.phone}</p>}
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 px-3 rounded-lg border border-[#DDD5C7] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1C3829] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice Receipt</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNavigateToShop}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onNavigateToAccount}
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#DDD5C7] hover:bg-[#FAF8F5] text-[#1C3829] text-xs font-bold uppercase tracking-[0.14em] rounded-lg transition-colors cursor-pointer"
          >
            VIEW ALL MY ORDERS
          </button>
        </div>

      </div>
    </div>
  );
};
