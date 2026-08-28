import React from 'react';
import { StoreSettings } from '../../types';
import { ShieldCheck, FileText, Truck, RefreshCcw } from 'lucide-react';

interface Props {
  type: 'privacy' | 'terms' | 'shipping' | 'refund';
  settings: StoreSettings;
}

export const PolicyPages: React.FC<Props> = ({ type, settings }) => {
  const getPolicyContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: ShieldCheck,
          content: settings.privacyPolicy || `At Purelis, protecting your private health and cosmetic profile data is our top priority. We only collect details necessary to fulfill your botanical order and improve your browsing experience. We never sell your personal data or email address to third-party ad brokers.`
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: FileText,
          content: settings.termsOfService || `By accessing and shopping at Purelis, you agree to our standard store terms. All natural botanical formulas and kitchenware heirlooms are guaranteed for quality and craftsmanship. Product prices and promotional availability are subject to change.`
        };
      case 'shipping':
        return {
          title: 'Shipping Policy',
          icon: Truck,
          content: settings.shippingPolicy || `We process all orders within 24 to 48 business hours. Orders above $${settings.freeShippingThreshold || 50} receive complimentary standard ground shipping. We use 100% biodegradable corrugated cardboard and recyclable plant-starch void filler.`
        };
      case 'refund':
        return {
          title: 'Refund & 30-Day Guarantee',
          icon: RefreshCcw,
          content: settings.refundPolicy || `We stand by the purity and performance of every product. If you are unsatisfied for any reason within 30 days of receiving your package, contact support@purelisbotanicals.com for a hassle-free return label and immediate refund.`
        };
    }
  };

  const policy = getPolicyContent();
  const Icon = policy.icon;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-18">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 sm:p-12 shadow-2xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#ECE7DE]">
            <div className="w-10 h-10 rounded-full bg-[#EAEFEA] text-[#1C3829] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3829]">
                {policy.title}
              </h1>
              <span className="text-xs text-[#7A8A7F]">
                Last updated: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="prose max-w-none text-xs sm:text-sm text-[#222E26] leading-relaxed whitespace-pre-line space-y-4">
            {policy.content}
          </div>
        </div>
      </div>
    </div>
  );
};
