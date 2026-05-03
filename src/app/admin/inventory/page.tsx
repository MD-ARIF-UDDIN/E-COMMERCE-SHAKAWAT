'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Archive, 
  Activity, 
  History, 
  Package, 
  Database,
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
    if (!adjustForm.product || !adjustForm.quantity) return toast.error('Required fields missing');
    setSubmitting(true);
    try {
      await api.post('/admin/inventory/adjust', {
        ...adjustForm,
        quantity: Number(adjustForm.quantity),
      });
      toast.success('Stock adjusted');
      setAdjustForm({ product: '', type: 'IN', quantity: '', reason: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Adjustment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const TYPE_CONFIG: Record<string, { bg: string, text: string }> = {
    IN: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    OUT: { bg: 'bg-rose-50', text: 'text-rose-600' },
    ADJUSTMENT: { bg: 'bg-primary/10', text: 'text-primary' },
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-gold-900 tracking-tight">Inventory</h1>
           <p className="text-gold-400 text-[13px] font-medium mt-1">Manage stock levels and track activity.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gold-50 px-4 py-2 rounded-xl border border-gold-100">
           <Database size={14} className="text-gold-400" />
           <span className="text-[11px] font-bold text-gold-900 uppercase tracking-widest">{products.length} Products</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Adjustment Interface */}
        <div className="lg:col-span-4">
           <div className="bg-gold-900 rounded-2xl p-8 shadow-xl shadow-gold-900/10">
              <div className="flex items-center gap-3 mb-8">
                 <Activity size={18} className="text-primary/80" />
                 <h2 className="text-[11px] font-bold text-white uppercase tracking-widest">Adjust Stock</h2>
              </div>
              
              <form onSubmit={handleAdjust} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest px-1">Product</label>
                  <select 
                    value={adjustForm.product} 
                    onChange={e => setAdjustForm(f => ({...f, product: e.target.value}))}
                    className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-[13px] font-bold text-white focus:bg-white/10 outline-none transition-all"
                  >
                    <option value="" className="bg-gold-900">Choose a product</option>
                    {products.map(p => <option key={p._id} value={p._id} className="bg-gold-900">{p.name} ({p.stock})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setAdjustForm(f => ({...f, type: 'IN'}))}
                    className={`h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2
                      ${adjustForm.type === 'IN' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-white/5 text-gold-500'}`}
                  >
                    <ArrowUpCircle size={14} /> IN
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAdjustForm(f => ({...f, type: 'OUT'}))}
                    className={`h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center justify-center gap-2
                      ${adjustForm.type === 'OUT' ? 'border-rose-500 bg-rose-500/10 text-rose-400' : 'border-white/5 text-gold-500'}`}
                  >
                    <ArrowDownCircle size={14} /> OUT
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest px-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={adjustForm.quantity} 
                      onChange={e => setAdjustForm(f => ({...f, quantity: e.target.value}))}
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-[13px] font-bold text-white focus:bg-white/10 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gold-500 uppercase tracking-widest px-1">Reason</label>
                    <input 
                      type="text" 
                      value={adjustForm.reason} 
                      onChange={e => setAdjustForm(f => ({...f, reason: e.target.value}))}
                      placeholder="e.g. Restock"
                      className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-[13px] font-bold text-white focus:bg-white/10 outline-none transition-all placeholder:text-gold-600" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="w-full h-12 bg-white text-gold-900 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
                  {submitting ? <div className="w-4 h-4 border-2 border-gold-900/30 border-t-gold-900 rounded-full animate-spin" /> : <TrendingUp size={14} />}
                  Apply
                </button>
              </form>
           </div>
        </div>

        {/* Inventory History */}
        <div className="lg:col-span-8">
           <div className="bg-white border border-gold-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-8 py-5 bg-gold-50/50 border-b border-gold-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <History size={14} className="text-gold-400" />
                    <h3 className="text-[11px] font-bold text-gold-900 uppercase tracking-widest">Recent Activity</h3>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gold-50">
                      <th className="px-8 py-4 text-[10px] font-bold text-gold-400 uppercase tracking-widest">Product</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gold-400 uppercase tracking-widest">Type</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gold-400 uppercase tracking-widest">Change</th>
                      <th className="px-8 py-4 text-[10px] font-bold text-gold-400 uppercase tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-50">
                    {logs.slice(0, 8).map((log) => (
                      <tr key={log._id} className="hover:bg-gold-50/30 transition-all">
                        <td className="px-8 py-3.5 text-[12px] font-bold text-gold-900">{log.product?.name || 'Deleted'}</td>
                        <td className="px-8 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${TYPE_CONFIG[log.type].bg} ${TYPE_CONFIG[log.type].text}`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-8 py-3.5 text-[12px] font-bold">
                           <span className={log.type === 'OUT' ? 'text-rose-600' : 'text-emerald-600'}>
                             {log.type === 'OUT' ? '−' : '+'} {log.quantity}
                           </span>
                        </td>
                        <td className="px-8 py-3.5 text-right text-[10px] font-medium text-gold-400 uppercase">{new Date(log.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
