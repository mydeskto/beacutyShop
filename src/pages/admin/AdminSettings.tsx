import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Mail, Phone, DollarSign, Truck, Tag } from 'lucide-react';
import { StoreSettings } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Props {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const AdminSettings: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await api.updateStoreSettings(formData);
      onUpdateSettings(saved);
      showToast('Settings Saved', 'Global store settings updated successfully.', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Global Store Settings</h2>
          <p className="text-xs text-[#5E6E64]">Configure branding, shipping rules, taxes, announcement bar, and policies.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] active:bg-[#12241A] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* 1. Store Identity */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#1C3829] pb-3 border-b border-stone-100">
          Store Brand Identity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Store Name</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Tagline</label>
            <input
              type="text"
              value={formData.storeTagline}
              onChange={(e) => setFormData({ ...formData, storeTagline: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      {/* 2. Top Announcement Bar */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-serif font-bold text-base text-[#1C3829]">
            Top Announcement Bar Ticker
          </h3>
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700">
            <input
              type="checkbox"
              checked={formData.announcementBarEnabled}
              onChange={(e) => setFormData({ ...formData, announcementBarEnabled: e.target.checked })}
              className="accent-[#1C3829]"
            />
            <span>Enabled on Storefront</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Announcement Message</label>
            <input
              type="text"
              value={formData.announcementBarText}
              onChange={(e) => setFormData({ ...formData, announcementBarText: e.target.value })}
              placeholder="e.g. Complimentary shipping on orders over $50"
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Promo Code Highlight</label>
            <input
              type="text"
              value={formData.announcementBarCoupon || ''}
              onChange={(e) => setFormData({ ...formData, announcementBarCoupon: e.target.value.toUpperCase() })}
              placeholder="e.g. PURE20"
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5] font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Shipping & Taxes */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#1C3829] pb-3 border-b border-stone-100">
          Shipping & Tax Rates
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Free Shipping Threshold ($)</label>
            <input
              type="number"
              value={formData.freeShippingThreshold}
              onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Standard Shipping Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.standardShippingFee}
              onChange={(e) => setFormData({ ...formData, standardShippingFee: Number(e.target.value) })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Estimated Sales Tax (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.taxRatePercentage}
              onChange={(e) => setFormData({ ...formData, taxRatePercentage: Number(e.target.value) })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      {/* 4. Concierge Contact Info */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#1C3829] pb-3 border-b border-stone-100">
          Concierge & Support Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Support Email</label>
            <input
              type="email"
              value={formData.supportEmail}
              onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Support Phone</label>
            <input
              type="tel"
              value={formData.supportPhone}
              onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Studio Address</label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

      {/* 5. Policy Text Editors */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-[#1C3829] pb-3 border-b border-stone-100">
          Store Policies & Guarantees
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Privacy Policy</label>
            <textarea
              rows={3}
              value={formData.privacyPolicy}
              onChange={(e) => setFormData({ ...formData, privacyPolicy: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Terms of Service</label>
            <textarea
              rows={3}
              value={formData.termsOfService}
              onChange={(e) => setFormData({ ...formData, termsOfService: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Shipping & Packaging Policy</label>
            <textarea
              rows={3}
              value={formData.shippingPolicy}
              onChange={(e) => setFormData({ ...formData, shippingPolicy: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Refund & 30-Day Guarantee</label>
            <textarea
              rows={3}
              value={formData.refundPolicy}
              onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
              className="w-full text-xs p-3 rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
            />
          </div>
        </div>
      </div>

    </form>
  );
};
