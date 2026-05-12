'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  BarChart3,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetching for the demonstration since we don't have a dedicated reports API yet
    // In a real app, you'd fetch this from the backend
    setTimeout(() => {
      setStats({
        revenue: 125000,
        orders: 450,
        avgOrderValue: 277,
        customers: 1200
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return (
    <div className="py-20 text-center">
       <Loader2 size={32} className="text-primary animate-spin mx-auto mb-4" />
       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generating Insights...</p>
    </div>
  );

  const kpis = [
    { label: 'Total Revenue', value: `৳${stats.revenue.toLocaleString()}`, trend: '+12%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats.orders, trend: '+5%', icon: ShoppingCart, color: 'text-primary', bg: 'bg-primary/5' },
    { label: 'Average Value', value: `৳${stats.avgOrderValue}`, trend: '-2%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Customers', value: stats.customers, trend: '+18%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Reports</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">Performance analytics and financial overview.</p>
        </div>
        
        <button className="h-11 px-6 flex items-center gap-2 bg-white border border-slate-200 text-slate-900 font-bold text-[13px] rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon size={20} />
               </div>
               <div className={`flex items-center gap-1 text-[11px] font-bold ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {kpi.trend}
                  {kpi.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
               </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart Placeholder */}
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-8 shadow-sm h-[400px] flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <BarChart3 size={32} className="text-slate-300" />
           </div>
           <h3 className="text-lg font-bold text-slate-900 mb-2">Revenue Analytics</h3>
           <p className="text-slate-400 text-xs max-w-sm">Interactive revenue trends and growth projections will be displayed here.</p>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 rounded-xl p-8 text-white shadow-lg">
              <h3 className="text-lg font-bold mb-6">Performance Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-8">
                 <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle className="text-primary" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="50.2" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">80</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Excellent</span>
                 </div>
              </div>
              <p className="text-slate-400 text-[10px] leading-relaxed uppercase tracking-wide text-center">
                 Your store is performing better than 80% of similar businesses this month.
              </p>
           </div>

           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-4">Top Categories</h3>
              <div className="space-y-4">
                 {[
                   { name: 'Smartphones', share: 45, color: 'bg-primary' },
                   { name: 'Accessories', share: 30, color: 'bg-emerald-500' },
                   { name: 'Laptops', share: 25, color: 'bg-indigo-500' }
                 ].map((cat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                         <span className="text-slate-500">{cat.name}</span>
                         <span className="text-slate-900">{cat.share}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full ${cat.color}`} style={{ width: `${cat.share}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
