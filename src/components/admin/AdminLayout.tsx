import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateToStorefront: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onNavigateToStorefront,
  children
}) => {
  const { isStaff, role } = useAuth();

  const tabTitles: Record<string, string> = {
    dashboard: 'Executive Performance Dashboard',
    products: 'Products & Inventory Catalog',
    categories: 'Departments & Category Taxonomies',
    orders: 'Orders & Real-Time Fulfillment',
    customers: 'Customer Accounts & Profiles',
    coupons: 'Promotions, Vouchers & Discounts',
    homepage_cms: 'Visual Homepage Section Builder',
    banners: 'Marketing Banners & Visual Promos',
    blog: 'The Botanical Journal (Blog CMS)',
    settings: 'Global Store Settings & Configurations'
  };

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
        <div className="bg-white p-8 max-w-md w-full rounded-2xl border border-rose-200 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1C3829]">Access Restricted</h2>
          <p className="text-xs text-[#5E6E64]">
            Your current account role (<strong>{role}</strong>) does not have staff permissions to view the backend store management portal.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onNavigateToStorefront}
              className="w-full py-2.5 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F5F2EC] min-h-screen">
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onNavigateToStorefront={onNavigateToStorefront}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar
          title={tabTitles[activeTab] || 'Management Portal'}
          onNavigateToStorefront={onNavigateToStorefront}
        />

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
