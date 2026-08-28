import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, Truck, PackageCheck, CheckCircle2, 
  Clock, X, Printer, ExternalLink 
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminOrders: React.FC = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<Order['fulfillmentStatus']>('unfulfilled');
  const [orderStatus, setOrderStatus] = useState<Order['status']>('processing');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (ord: Order) => {
    setSelectedOrder(ord);
    setTrackingNumber(ord.trackingNumber || '');
    setFulfillmentStatus(ord.fulfillmentStatus);
    setOrderStatus(ord.status);
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    await api.updateOrder(selectedOrder.id, {
      status: orderStatus,
      fulfillmentStatus,
      trackingNumber: trackingNumber.trim() || undefined
    });

    showToast('Order Updated', `Order #${selectedOrder.orderNumber} fulfillment status saved!`, 'success');
    setSelectedOrder(null);
    loadOrders();
  };

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter === 'unfulfilled' && ord.fulfillmentStatus !== 'unfulfilled') return false;
    if (statusFilter === 'fulfilled' && ord.fulfillmentStatus !== 'fulfilled') return false;
    if (statusFilter === 'pending' && ord.status !== 'pending') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C3829]">Orders & Fulfillment</h2>
          <p className="text-xs text-[#5E6E64]">Process incoming botanical shipments and assign tracking numbers.</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-[#EAE5DA] shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-[#8DA792] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number or customer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#DDD5C7] bg-[#FAF8F5]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
              statusFilter === 'all' ? 'bg-[#1C3829] text-white' : 'text-[#5E6E64] hover:bg-stone-100'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('unfulfilled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
              statusFilter === 'unfulfilled' ? 'bg-[#1C3829] text-white' : 'text-[#5E6E64] hover:bg-stone-100'
            }`}
          >
            Unfulfilled ({orders.filter(o => o.fulfillmentStatus === 'unfulfilled').length})
          </button>
          <button
            onClick={() => setStatusFilter('fulfilled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
              statusFilter === 'fulfilled' ? 'bg-[#1C3829] text-white' : 'text-[#5E6E64] hover:bg-stone-100'
            }`}
          >
            Fulfilled ({orders.filter(o => o.fulfillmentStatus === 'fulfilled').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#EAE5DA] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#ECE7DE] text-[#7A8A7F] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DE]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7A8A7F]">
                    Loading store orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7A8A7F]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#1C3829]">
                      #{ord.orderNumber}
                    </td>

                    <td className="py-3 px-4 text-[#5E6E64]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#1C3829] block">{ord.customerName}</span>
                      <span className="text-[11px] text-[#7A8A7F]">{ord.customerEmail}</span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#1C3829]">
                      ${ord.totalAmount.toFixed(2)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full ${
                        ord.fulfillmentStatus === 'fulfilled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.fulfillmentStatus === 'fulfilled' ? <PackageCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {ord.fulfillmentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenOrder(ord)}
                        className="px-3 py-1 bg-[#1C3829] hover:bg-[#2A4E3B] text-white font-semibold text-[11px] rounded transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Fulfillment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1C3829]">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-[#7A8A7F]">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            {/* Customer & Address info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs">
              <div>
                <span className="font-bold text-[#1C3829] block mb-1">Customer Details</span>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-stone-500">{selectedOrder.customerEmail}</p>
              </div>
              <div>
                <span className="font-bold text-[#1C3829] block mb-1">Shipping Destination</span>
                <p>{selectedOrder.shippingAddress.address1}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
              </div>
            </div>

            {/* Line items list */}
            <div>
              <h4 className="font-serif font-bold text-sm text-[#1C3829] mb-2">Order Line Items</h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]} alt="" className="w-10 h-10 rounded object-cover bg-stone-100" />
                      <div>
                        <span className="font-bold text-[#1C3829] block">{item.product?.name}</span>
                        <span className="text-stone-500">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-[#1C3829]">${item.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Fulfillment Form */}
            <form onSubmit={handleUpdateOrder} className="space-y-4 pt-2 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Fulfillment Status</label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50"
                  >
                    <option value="unfulfilled">Unfulfilled (Pending Packing)</option>
                    <option value="fulfilled">Fulfilled & Dispatched</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-stone-700 block mb-1">Carrier Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. 1Z9999999999999999"
                    className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-stone-50 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 text-xs border rounded-lg uppercase font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#1C3829] text-white text-xs font-bold uppercase rounded-lg transition-colors"
                >
                  Save Status & Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
