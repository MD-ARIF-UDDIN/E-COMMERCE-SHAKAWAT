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
  Search, 
  Filter, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  Phone, 
  User,
  ArrowUpRight,
  MoreVertical,
  Activity
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
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch {
      toast.error('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={14} className="text-indigo-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Order History</p>
           </div>
           <h1 className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tighter">Orders</h1>
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
             Total Orders: <span className="text-slate-950">{orders.length}</span>
           </p>
        </div>
        
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <button onClick={() => setFilter('')} className={`h-11 lg:h-12 px-5 lg:px-6 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all ${filter === '' ? 'bg-slate-950 text-white shadow-premium' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white'}`}>All</button>
          {STATUSES.map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)} 
              className={`h-11 lg:h-12 px-5 lg:px-6 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all 
                ${filter === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} border border-current shadow-sm` : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-24 text-center">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-24 text-center bg-slate-50 rounded-[3rem] border border-slate-100">
           <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Box size={32} className="text-slate-300" strokeWidth={1} />
           </div>
           <p className="text-slate-950 font-black text-xl tracking-tight mb-2">No Orders Found</p>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No orders match the selected status</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((order, index) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                key={order._id} 
                className={`group bg-white rounded-[2.5rem] border ${expandedId === order._id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-premium' : 'border-slate-100'} transition-all duration-500 overflow-hidden`}
              >
                {/* Order Row */}
                <div
                  className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 p-6 lg:p-10 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                >
                  <div className="flex-shrink-0 hidden lg:block">
                     <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors border border-slate-100">
                        <ShoppingBag size={24} strokeWidth={1.5} />
                     </div>
                  </div>


                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-12">
                    <div className="space-y-1">
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">Order Number</p>
                      <p className="text-xs lg:text-sm font-black text-slate-950 tracking-tight font-mono">{order.orderNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                      <div className="flex flex-col">
                        <p className="text-xs lg:text-sm font-black text-slate-950 tracking-tight truncate">{order.customerName || 'Guest'}</p>
                        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400">{order.customerPhone}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                      <div className="flex flex-col">
                        <p className="text-xs lg:text-sm font-black text-slate-950 tracking-tight">৳{order.totalAmount?.toLocaleString()}</p>
                        <p className="text-[9px] lg:text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Delivery: ৳{order.deliveryCharge}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <span className={`inline-flex px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-widest border border-current ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].text}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex items-center justify-center lg:justify-end gap-4">
                     <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 transition-transform duration-500 ${expandedId === order._id ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
                        <ChevronDown size={16} />
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
                      className="overflow-hidden bg-slate-50 border-t border-slate-100"
                    >
                      <div className="p-6 lg:p-12 grid lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Order Details */}
                        <div className="lg:col-span-7 space-y-8">
                           <div className="flex items-center gap-3">
                              <Box size={16} className="text-slate-950" />
                              <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest">Product Details</h4>
                           </div>
                           
                            <div className="space-y-2 lg:space-y-3">
                              {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm group/item hover:border-indigo-200 transition-colors">
                                  <div className="flex items-center gap-3 lg:gap-4">
                                     <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover/item:text-indigo-600 transition-colors">
                                        <Package size={18} className="lg:w-5 lg:h-5" />
                                     </div>
                                     <div>
                                        <p className="text-xs lg:text-sm font-black text-slate-950 tracking-tight line-clamp-1">{item.product?.name || 'Unknown Product'}</p>
                                        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                     </div>
                                  </div>
                                  <span className="text-xs lg:text-sm font-black text-slate-950 tracking-tight whitespace-nowrap ml-4">৳{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                           </div>

                           <div className="p-6 lg:p-8 bg-white border border-slate-100 rounded-[2rem] space-y-4 lg:space-y-6 shadow-sm">
                              <div className="flex items-start gap-4">
                                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <MapPin size={18} />
                                 </div>
                                 <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Shipping Address</p>
                                    <p className="text-xs lg:text-sm font-bold text-slate-950 leading-relaxed">{order.address}</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Order Controls */}
                        <div className="lg:col-span-5 space-y-8">
                           <div className="flex items-center gap-3">
                              <Activity size={16} className="text-slate-950" />
                              <h4 className="text-xs font-black text-slate-950 uppercase tracking-widest">Change Order Status</h4>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2 lg:gap-3">
                              {STATUSES.map(s => (
                                <button
                                  key={s}
                                  disabled={order.status === s || updatingId === order._id}
                                  onClick={() => updateStatus(order._id, s)}
                                  className={`h-12 lg:h-14 rounded-2xl text-[8px] lg:text-[10px] font-black uppercase tracking-widest border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                    ${order.status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].text} border-current` : 'border-white bg-white text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm'}`}
                                >
                                  {updatingId === order._id && order.status !== s ? <div className="w-3 h-3 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" /> : null}
                                  {s}
                                </button>
                              ))}
                           </div>

                           <div className="p-6 lg:p-8 bg-slate-950 rounded-[2rem] space-y-4 lg:space-y-6 shadow-premium">
                              <div className="flex items-center gap-3 mb-2">
                                 <Truck size={14} className="text-indigo-400" />
                                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Logistics / Delivery</p>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  id={`dc-${order._id}`}
                                  type="text"
                                  defaultValue={order.deliveryCompany || ''}
                                  placeholder="STEADFAST"
                                  className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 lg:px-5 py-3 lg:py-4 text-[9px] lg:text-[10px] font-black text-white uppercase tracking-widest focus:bg-white/10 focus:outline-none transition-all placeholder:text-slate-600"
                                />
                                <button
                                  onClick={() => {
                                    const dc = (document.getElementById(`dc-${order._id}`) as HTMLInputElement)?.value;
                                    updateStatus(order._id, order.status, dc);
                                  }}
                                  className="px-4 lg:px-6 bg-indigo-600 text-white rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 whitespace-nowrap"
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
