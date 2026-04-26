'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ExternalLink,
  ChevronRight,
  Activity,
  DollarSign,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Stats {
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  totalRevenue: number;
}

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
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  const statCards = [
    { label: 'Total Orders', value: orders.length, icon: Activity, trend: '+12.5%', color: 'indigo', link: '/admin/orders' },
    { label: 'Total Products', value: products.length, icon: Package, trend: '+2', color: 'slate', link: '/admin/products' },
    { label: 'Pending Orders', value: pendingOrders, icon: Clock, trend: '-3', color: 'amber', link: '/admin/orders' },
    { label: 'Total Revenue', value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+৳15k', color: 'emerald', link: '/admin/orders' },
  ];

  const colorVariants: Record<string, string> = {
    indigo: 'bg-indigo-600 text-white shadow-indigo-100',
    slate: 'bg-slate-950 text-white shadow-slate-100',
    amber: 'bg-amber-500 text-white shadow-amber-100',
    emerald: 'bg-emerald-600 text-white shadow-emerald-100',
  };

  const statusStyle: Record<string, string> = {
    Pending: 'bg-amber-50 text-amber-600',
    Processing: 'bg-blue-50 text-blue-600',
    Packed: 'bg-purple-50 text-purple-600',
    Shipped: 'bg-indigo-50 text-indigo-600',
    Delivered: 'bg-emerald-50 text-emerald-600',
    Cancelled: 'bg-rose-50 text-rose-600',
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-slate-50 animate-pulse rounded-[2.5rem] border border-slate-100" />)}
    </div>
  );

  return (
    <div className="space-y-12 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, i) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <Link href={card.link} className="block bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 hover:bg-white hover:shadow-premium transition-all duration-500 overflow-hidden">
               <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorVariants[card.color]} shadow-lg transition-transform duration-500 group-hover:scale-110`}>
                    <card.icon size={24} />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-slate-100 shadow-sm">
                    <span className="text-[10px] font-black text-slate-900 tracking-tighter">{card.trend}</span>
                    <ArrowUpRight size={10} className="text-emerald-500" />
                  </div>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{card.label}</p>
                  <p className="text-3xl font-black text-slate-950 tracking-tighter">{card.value}</p>
               </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-end justify-between px-4">
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Recent Activity</p>
                <h3 className="text-3xl font-black text-slate-950 tracking-tighter">Order Management</h3>
              </div>
              <Link href="/admin/orders" className="text-[10px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-widest transition-colors flex items-center gap-2 mb-1">
                View All Orders <ChevronRight size={14} />
              </Link>
           </div>
           
           <div className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner shadow-slate-200/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/60">
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Number</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Phone</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order, i) => (
                      <tr key={order._id} className="group hover:bg-white transition-all duration-300">
                        <td className="px-10 py-6">
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-950 tracking-tight mb-1">{order.orderNumber}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-sm font-bold text-slate-600 tracking-tight">{order.customerPhone}</span>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-sm font-black text-slate-950 tracking-tight">৳{order.totalAmount?.toLocaleString()}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${statusStyle[order.status] || 'bg-slate-100 text-slate-500'}`}>
                             {order.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr><td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">No recent orders</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>

        {/* System Alerts */}
        <div className="lg:col-span-4 space-y-8">
           <div className="px-4">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-[0.3em] mb-2">System Alerts</p>
              <h3 className="text-3xl font-black text-slate-950 tracking-tighter">Alerts</h3>
           </div>

           <div className="space-y-4">
              <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-premium">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full" />
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                         <AlertTriangle size={18} className="text-rose-400" />
                       </div>
                       <span className="bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Urgent</span>
                    </div>
                    <h4 className="text-xl font-black tracking-tight mb-2">Low Stock Alert</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                      We detected {lowStockProducts.length} products with low stock. Please restock soon.
                    </p>
                    <div className="space-y-2">
                       {lowStockProducts.slice(0, 5).map(p => (
                         <div key={p._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight truncate mr-4">{p.name}</span>
                            <span className="text-[10px] font-black text-rose-400 uppercase whitespace-nowrap">{p.stock} Units left</span>
                         </div>
                       ))}
                    </div>
                    <Link href="/admin/inventory" className="inline-flex items-center gap-2 mt-8 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                      Restock Now <ArrowUpRight size={14} />
                    </Link>
                 </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8">
                 <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                      <Users size={18} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
                 </div>
                 <h4 className="text-xl font-black text-slate-950 tracking-tighter mb-1">Website Performance</h4>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">System Health</p>
                 <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-indigo-600"
                    />
                 </div>
                 <div className="flex justify-between mt-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Uptime 99.9%</span>
                    <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest">85% Capacity</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
