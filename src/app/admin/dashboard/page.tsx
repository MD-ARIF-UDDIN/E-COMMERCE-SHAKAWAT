'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  ChevronRight, 
  DollarSign,
  Clock,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/orders/admin'),
      api.get('/products'),
    ]).then(([ordersRes, productsRes]) => {
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter(o => o.status === 'Delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statCards = [
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, iconColor: 'text-primary', bg: 'bg-primary/5', link: '/admin/orders' },
    { label: 'Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, iconColor: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/orders' },
    { label: 'Pending', value: pendingOrders, icon: Clock, iconColor: 'text-amber-500', bg: 'bg-amber-50', link: '/admin/orders' },
    { label: 'Inventory', value: products.length, icon: Package, iconColor: 'text-slate-600', bg: 'bg-slate-50', link: '/admin/products' },
  ];

  const statusStyle: Record<string, string> = {
    Pending: 'text-amber-600 bg-amber-50',
    Processing: 'text-primary bg-primary/5',
    Delivered: 'text-emerald-600 bg-emerald-50',
    Cancelled: 'text-rose-600 bg-rose-50',
  };

  if (loading) return (
    <div className="py-20 text-center">
       <Loader2 size={32} className="text-primary animate-spin mx-auto mb-4" />
       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Initialising Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
             key={i}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
          >
             <Link href={card.link} className="block bg-white border border-slate-200 rounded-xl p-6 hover:border-primary transition-all group shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.bg} ${card.iconColor}`}>
                      <card.icon size={20} />
                   </div>
                   <ArrowUpRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</p>
             </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Recent Orders */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <Link href="/admin/orders" className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline">View All</Link>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="group hover:bg-slate-50/30 transition-all">
                        <td className="px-6 py-4">
                           <p className="text-[13px] font-bold text-slate-900 mb-0.5">{order.orderNumber}</p>
                           <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-900">৳{order.totalAmount?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                           <span className={`inline-flex px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${statusStyle[order.status] || 'bg-slate-100 text-slate-500'}`}>
                             {order.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* Alerts & Inventory */}
        <div className="lg:col-span-4 space-y-4">
           <h3 className="text-base font-bold text-slate-900 tracking-tight px-1">Notifications</h3>

           <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg">
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-rose-400">
                        <AlertTriangle size={18} />
                      </div>
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">Low Stock</span>
                   </div>
                   <div className="space-y-2 mb-6 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                      {lowStockProducts.slice(0, 4).map(p => (
                        <div key={p._id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                           <span className="text-[11px] font-medium text-slate-400 truncate mr-3">{p.name}</span>
                           <span className="text-[11px] font-bold text-white whitespace-nowrap">{p.stock} Left</span>
                        </div>
                      ))}
                   </div>
                   <Link href="/admin/products" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white flex items-center gap-2 transition-colors">
                     Manage Inventory <ChevronRight size={12} />
                   </Link>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center">
                   <Package size={24} className="text-emerald-500 mx-auto mb-3" />
                   <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-widest">Inventory is Healthy</p>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">System Health</p>
                    <span className="text-[10px] font-bold text-emerald-500">Live</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-primary w-[98%]" />
                 </div>
                 <p className="text-[10px] font-medium text-slate-400 leading-tight">All systems operational. Last sync: Just now.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
