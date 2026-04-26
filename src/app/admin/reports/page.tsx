'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Shield, 
  Zap, 
  Globe, 
  Layers, 
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
  Monitor,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Loading Reports...</p>
    </div>
  );
  
  if (!data) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Failed to load reports</p>
    </div>
  );

  return (
    <div className="space-y-16 pb-32">
      {/* Header */}
      <div className="px-4 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-indigo-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sales Analytics</p>
           </div>
           <h1 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter">Reports</h1>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-md">
             View sales performance, category distribution, and top product analytics.
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">System Status</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-xs font-black text-slate-950 uppercase">Active</span>
              </div>
           </div>
           <div className="bg-slate-950 text-white rounded-2xl px-6 py-4 shadow-premium">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Updated</p>
              <span className="text-xs font-black uppercase">Just Now</span>
           </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: 'Total Revenue', value: `৳${data.overall.totalRevenue?.toLocaleString()}`, sub: 'Total sales value', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Orders', value: data.overall.totalOrders, sub: 'Orders placed', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Categories', value: data.salesByCategory.length, sub: 'Unique categories', icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-premium group hover:bg-slate-50 transition-all duration-500"
          >
            <div className={`w-14 h-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <kpi.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</p>
            <h3 className="text-4xl font-black text-slate-950 tracking-tighter mb-1">{kpi.value}</h3>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sales Chart */}
        <div className="lg:col-span-8 bg-slate-950 rounded-[3rem] p-12 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
          <div className="relative z-10 space-y-12">
            <div className="flex items-end justify-between">
               <div>
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Sales Trends</h3>
                  <h2 className="text-3xl font-black text-white tracking-tighter">Revenue Growth</h2>
               </div>
               <div className="flex items-center gap-2 text-emerald-400">
                  <ArrowUpRight size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Growth Detected</span>
               </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.salesByMonth} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="_id" 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(v) => `৳${v/1000}k`} 
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Chart */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[3rem] p-12 shadow-premium space-y-12">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Category Sales</h3>
            <h2 className="text-2xl font-black text-slate-950 tracking-tighter">Sales by Category</h2>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.salesByCategory} 
                  dataKey="sales" 
                  nameKey="category" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={100} 
                  paddingAngle={8}
                >
                  {data.salesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
             {data.salesByCategory.slice(0, 4).map((entry: any, i: number) => (
               <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                     <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{entry.category}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">৳{entry.sales?.toLocaleString()}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="space-y-8">
         <div className="flex items-end justify-between px-4">
            <div>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Sales Performance</p>
               <h3 className="text-4xl font-black text-slate-950 tracking-tighter">Top Selling Products</h3>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-3">
               <BarChart3 size={16} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Top 10 Products Analyzed</span>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-premium">
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.salesByProduct} margin={{ top: 20, right: 30, left: 40, bottom: 20 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="product" 
                    type="category" 
                    width={180} 
                    tick={{ fill: '#0f172a', fontSize: 10, fontWeight: 900 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="sales" name="Revenue" fill="#0f172a" radius={[0, 10, 10, 0]} barSize={24} />
                  <Bar dataKey="quantity" name="Units Sold" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Logistics & Acquisition Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <Package size={20} className="text-slate-950" />
              <h4 className="text-xl font-black text-slate-950 tracking-tighter">Current Stock Levels</h4>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {data.inventorySnapshot.map((inv: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-premium transition-all">
                  <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{inv.category}</span>
                  <div className="flex items-center gap-4">
                     <span className="text-sm font-black text-slate-950">{inv.stock}</span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-indigo-600" />
              <h4 className="text-xl font-black text-slate-950 tracking-tighter">Purchase Costs</h4>
           </div>
           <div className="grid grid-cols-1 gap-4">
              {data.purchaseReport.map((p: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 hover:bg-white hover:shadow-premium transition-all group">
                  <span className="text-[10px] font-black text-indigo-950 uppercase tracking-widest">{p.month}</span>
                  <div className="flex items-center gap-6">
                     <div className="text-right">
                        <p className="text-sm font-black text-indigo-600">৳{p.cost?.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.quantity} Items Purchased</p>
                     </div>
                     <ChevronRight size={14} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
