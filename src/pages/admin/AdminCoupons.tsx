import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { Coupon } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCoupons: React.FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed_amount'>('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [minimumSpend, setMinimumSpend] = useState(50);
  const [maxUses, setMaxUses] = useState(500);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await api.getCoupons();
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCode(`SAVE${Math.floor(10 + Math.random() * 90)}`);
    setDescription('Special seasonal store discount');
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinimumSpend(40);
    setMaxUses(500);
    setExpiresAt('2026-12-31');
    setModalOpen(true);
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    await api.deleteCoupon(id);
    showToast('Coupon Deleted', `${couponCode} removed.`, 'info');
    loadCoupons();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    await api.createCoupon({
      code: code.trim().toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minimumSpend: Number(minimumSpend),
      maxUses: Number(maxUses),
      expiresAt: new Date(expiresAt).toISOString(),
      isActive: true
    });

    showToast('Coupon Created', `Promo code ${code.toUpperCase()} is now live!`, 'success');
    setModalOpen(false);
    loadCoupons();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Coupons & Promotional Codes</h2>
          <p className="text-xs text-[#5E6E64]">Create percentage discounts and minimum spend thresholds.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1C3829] hover:bg-[#2A4E3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-[#EAE5DA] p-6 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-[#1C3829] px-3 py-1 bg-[#EAEFEA] rounded-lg border border-[#D5DFD7]">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                </span>
              </div>

              <p className="text-xs text-[#5E6E64] mt-3">{c.description}</p>

              <div className="mt-4 pt-3 border-t border-stone-100 space-y-1 text-xs text-[#7A8A7F]">
                <div>Min Spend: <strong className="text-[#1C3829]">${c.minimumSpend}</strong></div>
                <div>Used: <strong className="text-[#1C3829]">{c.usedCount} / {c.maxUses}</strong></div>
                <div>Expires: <strong className="text-[#1C3829]">{new Date(c.expiresAt).toLocaleDateString()}</strong></div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                onClick={() => handleDelete(c.id, c.code)}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Voucher</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-lg text-[#1C3829]">Create Promotional Voucher</h3>
              <button onClick={() => setModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 25% Off Summer Skincare"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Value Amount</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    required
                    value={minimumSpend}
                    onChange={(e) => setMinimumSpend(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Expiration Date</label>
                  <input
                    type="date"
                    required
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 text-xs border rounded uppercase font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#1C3829] text-white text-xs font-bold uppercase rounded"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
