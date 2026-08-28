import React, { useEffect, useState } from 'react';
import { 
  DollarSign, ShoppingBag, PackageCheck, Users, 
  TrendingUp, Clock, AlertTriangle, ArrowRight, Eye, Sparkles 
} from 'lucide-react';
import { api } from '../../services/api';
import { AnalyticsSummary, Order, Product } from '../../types';

interface Props {
  onNavigateToTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ onNavigateToTab }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [stats, orders, prods] = await Promise.all([
        api.getAnalytics(),
        api.getOrders({ limit: 5 }),
        api.getProducts({ limit: 4, sort: 'bestselling' })
      ]);
      setAnalytics(stats);
      setRecentOrders(orders);
      setTopProducts(prods);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center text-xs text-[#7A8A7F]">
        <div className="w-8 h-8 border-3 border-[#1C3829] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        Loading executive metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A8A7F]">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C3829]">
            ${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last 30 days</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A8A7F]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C3829]">
            {analytics.totalOrders}
          </div>
          <div className="text-[11px] text-[#7A8A7F]">
            Avg Order: <strong className="text-[#1C3829]">${(analytics.averageOrderValue ?? 0).toFixed(2)}</strong>
          </div>
        </div>

        {/* Pending Fulfillment */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A8A7F]">
            <span className="text-xs font-bold uppercase tracking-wider">Unfulfilled Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C3829]">
            {analytics.pendingOrdersCount}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            Requires eco-packing & label
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE5DA] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-[#7A8A7F]">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Clients</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C3829]">
            {analytics.totalCustomers}
          </div>
          <div className="text-[11px] text-purple-700 font-medium">
            Active loyalty members
          </div>
        </div>

      </div>

      {/* 2-Column Section: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1C3829]">Recent Orders</h3>
              <p className="text-xs text-[#7A8A7F]">Live incoming purchases</p>
            </div>
            <button
              onClick={() => onNavigateToTab('orders')}
              className="text-xs font-semibold text-[#1C3829] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#ECE7DE]">
            {recentOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C3829]">#{order.orderNumber}</span>
                    <span className="text-xs text-stone-300">•</span>
                    <span className="text-xs font-medium text-stone-700 truncate">{order.customerName}</span>
                  </div>
                  <span className="text-[11px] text-[#7A8A7F] mt-0.5 block">
                    {order.items.length} items • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#1C3829]">
                    ${(order.totalAmount ?? 0).toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    order.fulfillmentStatus === 'fulfilled'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bestselling Formulations (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE]">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1C3829]">Top Performers</h3>
              <p className="text-xs text-[#7A8A7F]">Best-selling formulas & cookware</p>
            </div>
            <button
              onClick={() => onNavigateToTab('products')}
              className="text-xs font-semibold text-[#1C3829] hover:underline"
            >
              Catalog →
            </button>
          </div>

          <div className="space-y-3">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl bg-[#FAF8F5] border border-stone-100">
                <img
                  src={p.images?.[0]}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-white border border-stone-200 p-0.5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#1C3829] truncate">{p.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-[#7A8A7F]">{p.categoryName}</span>
                    <span className="text-xs font-bold text-[#1C3829]">
                      ${((p.salePrice ?? p.price) ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick CMS Jump Actions */}
      <div className="bg-[#1C3829] text-white p-6 sm:p-8 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-xl">Homepage CMS & Store Builder</h3>
            <p className="text-xs text-[#A8C2B0] mt-1">
              Reorder homepage sections, edit hero promotional copy, publish seasonal coupon codes, and manage articles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateToTab('homepage_cms')}
              className="px-4 py-2 bg-[#FAF8F5] text-[#1C3829] text-xs font-bold uppercase rounded-lg hover:bg-white transition-colors"
            >
              Homepage Builder
            </button>
            <button
              onClick={() => onNavigateToTab('coupons')}
              className="px-4 py-2 bg-[#2D543F] hover:bg-[#3B6B50] text-white text-xs font-bold uppercase rounded-lg transition-colors border border-[#487C5E]"
            >
              Create Promo Code
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
