'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Clock, 
  Package, 
  Box, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ShoppingBag, 
  MapPin, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = ['Pending','Processing','Packed','Shipped','Delivered','Cancelled'];

const STATUS_CONFIG: Record<string, { bg: string, text: string, icon: any }> = {
  Pending:    { bg: 'bg-amber-50',   text: 'text-amber-600',  icon: Clock },
  Processing: { bg: 'bg-blue-50',    text: 'text-blue-600',   icon: Activity },
  Packed:     { bg: 'bg-violet-50',  text: 'text-violet-600', icon: Box },
  Shipped:    { bg: 'bg-indigo-50',  text: 'text-indigo-600', icon: Truck },
  Delivered:  { bg: 'bg-emerald-50', text: 'text-emerald-600',icon: CheckCircle },
  Cancelled:  { bg: 'bg-rose-50',    text: 'text-rose-600',   icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.get('/orders/admin');
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string, deliveryCompany?: string) => {
    setUpdatingId(id);
    try {
      await api.put(`/orders/admin/${id}/status`, { status, deliveryCompany });
      toast.success(`Updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Orders</h1>
           <p className="text-slate-400 text-[13px] font-medium mt-1">
             Track and manage customer orders.
           </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('')} 
            className={`h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${filter === '' ? 'bg-slate-950 text-white shadow-sm' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            All
          </button>
          {STATUSES.map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`h-10 px-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all 
                ${filter === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text}` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center">
           <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-20 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
           <Box size={32} className="text-slate-200 mx-auto mb-4" />
           <p className="text-slate-950 font-bold text-lg mb-1">No Orders Found</p>
           <p className="text-slate-400 text-[13px]">No orders match your filter criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((order, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                key={order._id} 
                className={`group bg-white rounded-2xl border transition-all ${expandedId === order._id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg' : 'border-slate-100 hover:border-slate-200'}`}
              >
                {/* Order Row */}
                <div
                  className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                >
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                      <p className="text-[13px] font-bold text-slate-950 tracking-tight">{order.orderNumber}</p>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</p>
                      <p className="text-[13px] font-bold text-slate-950 truncate">{order.customerName || 'Guest'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</p>
                      <p className="text-[13px] font-bold text-slate-950">৳{order.totalAmount?.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].text}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center justify-end">
                      <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 transition-all ${expandedId === order._id ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
                        <ChevronDown size={14} />
                      </div>
                  </div>
                </div>

                {/* Expanded Panel */}
                <AnimatePresence>
                  {expandedId === order._id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-50"
                    >
                      <div className="p-8 lg:p-10 grid lg:grid-cols-12 gap-10">
                        {/* Order Details */}
                        <div className="lg:col-span-7 space-y-8">
                           <div>
                              <h4 className="text-[11px] font-bold text-slate-950 uppercase tracking-widest mb-4">Items Summary</h4>
                              <div className="space-y-2">
                                {order.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                    <div className="min-w-0">
                                      <p className="text-[13px] font-bold text-slate-950 truncate">{item.product?.name || 'Item'}</p>
                                      <p className="text-[10px] font-medium text-slate-400 uppercase">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-950 ml-4">৳{(item.price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                           </div>

                           <div className="flex items-start gap-3 p-4 border border-slate-100 rounded-xl">
                              <MapPin size={14} className="text-slate-400 mt-0.5" />
                              <div>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Delivery Address</p>
                                 <p className="text-[13px] font-bold text-slate-950 leading-relaxed">{order.address}</p>
                              </div>
                           </div>
                        </div>

                        {/* Controls */}
                        <div className="lg:col-span-5 space-y-8">
                           <div>
                              <h4 className="text-[11px] font-bold text-slate-950 uppercase tracking-widest mb-4">Update Status</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {STATUSES.map(s => (
                                  <button
                                    key={s}
                                    disabled={order.status === s || updatingId === order._id}
                                    onClick={() => updateStatus(order._id, s)}
                                    className={`h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all disabled:opacity-50
                                      ${order.status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} border-current` : 'border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-900'}`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                           </div>

                           <div className="bg-slate-950 rounded-2xl p-6">
                              <div className="flex items-center gap-2 mb-4">
                                 <Truck size={14} className="text-indigo-400" />
                                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Delivery Carrier</p>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  id={`dc-${order._id}`}
                                  type="text"
                                  defaultValue={order.deliveryCompany || ''}
                                  placeholder="e.g. STEADFAST"
                                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold text-white focus:bg-white/10 outline-none transition-all placeholder:text-slate-600"
                                />
                                <button
                                  onClick={() => {
                                    const dc = (document.getElementById(`dc-${order._id}`) as HTMLInputElement)?.value;
                                    updateStatus(order._id, order.status, dc);
                                  }}
                                  className="px-5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                  Update
                                </button>
                              </div>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
