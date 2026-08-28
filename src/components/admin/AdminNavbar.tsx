import React from 'react';
import { Bell, Store, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Props {
  title: string;
  onNavigateToStorefront: () => void;
}

export const AdminNavbar: React.FC<Props> = ({ title, onNavigateToStorefront }) => {
  const { currentUser, role, switchRole } = useAuth();
  const { showToast } = useToast();

  return (
    <header className="h-16 bg-white border-b border-[#ECE7DE] px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-serif font-bold text-[#1C3829]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Fast Role Switcher inside Admin Header */}
        <div className="hidden md:flex items-center gap-2 bg-[#FAF8F5] p-1 rounded-lg border border-[#DDD5C7]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8A7F] px-2">
            Switch:
          </span>
          {(['admin', 'manager', 'staff', 'customer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                switchRole(r);
                showToast('Role Switched', `Active role set to ${r.toUpperCase()}`, 'info');
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-all ${
                role === r ? 'bg-[#1C3829] text-white' : 'text-[#5E6E64] hover:text-[#1C3829]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* View Storefront Link */}
        <button
          onClick={onNavigateToStorefront}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD5C7] hover:bg-[#FAF8F5] text-xs font-semibold text-[#1C3829] transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span>Storefront</span>
        </button>
      </div>
    </header>
  );
};
