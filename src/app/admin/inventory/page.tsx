'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Archive, 
  Activity, 
  History, 
  Package, 
  AlertCircle,
  Database,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminInventoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjustForm, setAdjustForm] = useState({ product: '', type: 'IN', quantity: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [logsRes, prodsRes] = await Promise.all([
      api.get('/admin/inventory/logs'),
      api.get('/products'),
    ]);
    setLogs(logsRes.data);
    setProducts(prodsRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustForm.product || !adjustForm.quantity) return toast.error('Product selection and quantity are required');
    setSubmitting(true);
    try {
      await api.post('/admin/inventory/adjust', {
        ...adjustForm,
        quantity: Number(adjustForm.quantity),
      });
      toast.success('Stock adjusted successfully');
      setAdjustForm({ product: '', type: 'IN', quantity: '', reason: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  const TYPE_CONFIG: Record<string, { bg: string, text: string }> = {
    IN: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    OUT: { bg: 'bg-rose-50', text: 'text-rose-600' },
    ADJUSTMENT: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  };

  return (
    <div className="space-y-16 pb-32">
      {/* Header */}
      <div className="px-4">
         <div className="flex items-center gap-2 mb-2">
            <Archive size={14} className="text-indigo-600" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Inventory Management</p>
         </div>
         <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">Stock Inventory</h1>
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
           Total Units in Stock: <span className="text-slate-950">{products.reduce((acc, p) => acc + p.stock, 0)}</span> — <span className="text-slate-950">{products.length}</span> Products Tracked
         </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Adjustment Interface */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-950 rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <Activity size={20} />
                   </div>
                   <h2 className="text-sm font-black text-white uppercase tracking-widest">Adjust Stock Level</h2>
                </div>
                
                <form onSubmit={handleAdjust} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Select Product</label>
                    <select 
                      value={adjustForm.product} 
                      onChange={e => setAdjustForm(f => ({...f, product: e.target.value}))}
                      className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:bg-white/10 focus:border-indigo-500 focus:outline-none transition-all"
                    >
                      <option value="" className="bg-slate-900">Choose a product</option>
                      {products.map(p => <option key={p._id} value={p._id} className="bg-slate-900">{p.name} (Current: {p.stock})</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Adjustment Type</label>
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setAdjustForm(f => ({...f, type: 'IN'}))}
                        className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2
                          ${adjustForm.type === 'IN' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 text-slate-500'}`}
                      >
                        <ArrowUpCircle size={14} /> Add Stock
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setAdjustForm(f => ({...f, type: 'OUT'}))}
                        className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2
                          ${adjustForm.type === 'OUT' ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-white/5 text-slate-500'}`}
                      >
                        <ArrowDownCircle size={14} /> Remove Stock
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={adjustForm.quantity} 
                        onChange={e => setAdjustForm(f => ({...f, quantity: e.target.value}))}
                        placeholder="0"
                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:bg-white/10 focus:border-indigo-500 focus:outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Reason / Note</label>
                      <input 
                        type="text" 
                        value={adjustForm.reason} 
                        onChange={e => setAdjustForm(f => ({...f, reason: e.target.value}))}
                        placeholder="e.g. Restock"
                        className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600" 
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full h-16 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-lg flex items-center justify-center gap-3 pt-1">
                    {submitting ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <TrendingUp size={16} />}
                    Apply Adjustment
                  </button>
                </form>
              </div>
              <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                 <Package size={120} strokeWidth={1} />
              </div>
           </div>
        </div>

        {/* Inventory History */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner shadow-slate-200/20">
              <div className="px-10 py-8 border-b border-slate-200/60 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <History size={16} className="text-slate-950" />
                    <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Recent Activity Logs</h3>
                 </div>
                 <FileText size={16} className="text-slate-300" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/60">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Change</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.slice(0, 10).map((log, i) => (
                      <tr key={log._id} className="group hover:bg-white transition-all duration-300">
                        <td className="px-10 py-5 font-black text-slate-950 text-xs tracking-tight">{log.product?.name || 'Deleted Product'}</td>
                        <td className="px-10 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current ${TYPE_CONFIG[log.type].bg} ${TYPE_CONFIG[log.type].text}`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-10 py-5 font-black text-slate-950 text-xs">
                           <span className={log.type === 'OUT' ? 'text-rose-600' : 'text-emerald-600'}>
                             {log.type === 'OUT' ? '−' : '+'} {log.quantity}
                           </span>
                        </td>
                        <td className="px-10 py-5 text-right text-[10px] font-bold text-slate-400 uppercase">{new Date(log.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>

      {/* Product Inventory List */}
      <div className="space-y-8">
         <div className="flex items-end justify-between px-4">
            <div>
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Inventory List</p>
               <h3 className="text-3xl font-black text-slate-950 tracking-tighter">Current Stock Levels</h3>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2">
               <Database size={14} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">{products.length} Products Tracked</span>
            </div>
         </div>

         <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 font-black text-slate-950 text-sm tracking-tight">{p.name}</td>
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category?.name || 'Uncategorized'}</span>
                        </td>
                        <td className="px-10 py-6 font-black text-slate-950 text-sm">{p.stock}</td>
                        <td className="px-10 py-6 text-right">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            p.stock === 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                            p.stock <= 5 ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {p.stock === 0 ? <AlertCircle size={10} /> : null}
                            {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  );
}
