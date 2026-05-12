'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Eye,
  Search,
  Filter,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG: any = {
  Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  Processing: { icon: Truck, color: 'text-primary', bg: 'bg-primary/5' },
  Delivered: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  Cancelled: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await api.get('/orders/admin');
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const filteredOrders = filter 
    ? orders.filter(o => o.status === filter)
    : orders;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Management</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">Track and fulfill customer purchases.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
           {['', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((s) => (
             <button
               key={s}
               onClick={() => setFilter(s)}
               className={`h-9 px-4 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${filter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
             >
               {s || 'All'}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-20 text-center">
             <Loader2 size={24} className="text-primary animate-spin mx-auto" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-slate-400 font-bold text-[13px]">No orders found for this status.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className={`group transition-all ${expandedOrder === order._id ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}>
                      <td className="px-6 py-4">
                         <p className="text-[13px] font-bold text-slate-900 mb-0.5">{order.orderNumber}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-[13px] font-bold text-slate-900 truncate max-w-[120px]">{order.customerName || 'Guest'}</p>
                         <p className="text-[10px] font-medium text-slate-400">{order.customerPhone}</p>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-slate-900">৳{order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                         <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${STATUS_CONFIG[order.status]?.bg} ${STATUS_CONFIG[order.status]?.color}`}>
                            {order.status}
                         </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${expandedOrder === order._id ? 'bg-primary text-white' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}>
                           {expandedOrder === order._id ? <ChevronUp size={16} /> : <Eye size={16} />}
                         </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedOrder === order._id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-0 border-none">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                               <div className="py-8 grid lg:grid-cols-12 gap-10 border-t border-slate-100">
                                  {/* Items Summary */}
                                  <div className="lg:col-span-5 space-y-4">
                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Items Summary</h4>
                                     <div className="space-y-3">
                                       {order.items?.map((item: any, i: number) => (
                                         <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                            <div className="flex-1">
                                              <p className="text-[13px] font-bold text-slate-900 truncate">{item.product?.name || 'Deleted Product'}</p>
                                              <p className="text-[10px] font-medium text-slate-400">{item.quantity} x ৳{item.price.toLocaleString()}</p>
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                                         </div>
                                       ))}
                                     </div>
                                  </div>

                                  {/* Delivery Details */}
                                  <div className="lg:col-span-4 space-y-4">
                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Delivery Details</h4>
                                     <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                                        <div className="flex items-start gap-3">
                                           <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                           <p className="text-[13px] font-medium text-slate-900 leading-relaxed">{order.address}</p>
                                        </div>
                                        {order.note && (
                                           <div className="pt-3 border-t border-slate-200/50">
                                              <p className="text-[11px] text-slate-500 italic">"{order.note}"</p>
                                           </div>
                                        )}
                                     </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="lg:col-span-3 space-y-4">
                                     <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Update Status</h4>
                                     <div className="grid grid-cols-1 gap-2">
                                       {['Pending', 'Processing', 'Delivered', 'Cancelled'].map((s) => (
                                         <button
                                           key={s}
                                           onClick={() => updateStatus(order._id, s)}
                                           className={`h-10 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all
                                             ${order.status === s ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} border-current` : 'border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-900'}`}
                                         >
                                           {s}
                                         </button>
                                       ))}
                                     </div>
                                  </div>
                               </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react'; // Fix missing React import if needed (NextJS handles it mostly but good for Fragment)
