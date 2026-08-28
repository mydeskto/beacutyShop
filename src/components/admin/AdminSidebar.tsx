import React from 'react';
import { 
  LayoutDashboard, Package, Grid, ShoppingCart, 
  Users, Tag, LayoutTemplate, Image, BookOpen, 
  Settings, Store, LogOut, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateToStorefront: () => void;
}

export const AdminSidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onNavigateToStorefront
}) => {
  const { currentUser, role, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'staff'] },
    { id: 'products', label: 'Products & Inventory', icon: Package, roles: ['admin', 'manager', 'staff'] },
    { id: 'categories', label: 'Categories & Depts', icon: Grid, roles: ['admin', 'manager'] },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingCart, roles: ['admin', 'manager', 'staff'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'manager'] },
    { id: 'coupons', label: 'Discounts & Coupons', icon: Tag, roles: ['admin', 'manager'] },
    { id: 'homepage_cms', label: 'Homepage Builder', icon: LayoutTemplate, roles: ['admin'] },
    { id: 'banners', label: 'Banners & Promos', icon: Image, roles: ['admin'] },
    { id: 'blog', label: 'Blog & Rituals', icon: BookOpen, roles: ['admin', 'manager'] },
    { id: 'settings', label: 'Store Settings', icon: Settings, roles: ['admin'] }
  ];

  const allowedItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-[#12241A] text-[#D3E0D7] border-r border-[#1C3829] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      
      {/* Top Brand */}
      <div>
        <div className="p-6 border-b border-[#1C3829]">
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold tracking-[0.2em] text-white">
              PURELIS
            </span>
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#274E37] text-emerald-300 font-bold">
              CMS ADMIN
            </span>
          </div>
          <p className="text-[11px] text-[#8DA792] mt-1">Management Portal</p>
        </div>

        {/* Storefront Fast Switcher */}
        <div className="p-4 border-b border-[#1C3829]">
          <button
            onClick={onNavigateToStorefront}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#1F3D2C] hover:bg-[#2B543D] text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>View Storefront</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
          {allowedItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1C3829] text-white font-bold shadow-2xs border-l-3 border-[#8DA792]'
                    : 'text-[#98B0A0] hover:text-white hover:bg-[#1A3325]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-[#7A9383]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User info & Log out */}
      <div className="p-4 border-t border-[#1C3829] bg-[#0E1B13]">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="min-w-0">
            <span className="text-xs font-bold text-white block truncate">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-400">
              Role: {role}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-300 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Admin</span>
        </button>
      </div>

    </aside>
  );
};
