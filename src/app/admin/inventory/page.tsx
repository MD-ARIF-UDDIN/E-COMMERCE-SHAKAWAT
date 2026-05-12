'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  TrendingUp, 
  Package, 
  History, 
  Search, 
  ArrowRight,
  ChevronDown,
  Warehouse,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    product: '',
    type: 'ADD' as 'ADD' | 'REMOVE',
    amount: '',
    note: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const [pRes, lRes] = await Promise.all([
      api.get('/products'),
      api.get('/inventory/logs')
    ]);
    setProducts(pRes.data);
    setLogs(lRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product || !form.amount) return toast.error('Fill required fields');
    setSubmitting(true);
    try {
      await api.post('/inventory/adjust', {
        productId: form.product,
        amount: Number(form.amount),
        type: form.type,
        note: form.note
      });
      toast.success('Stock adjusted');
      setForm({ product: '', type: 'ADD', amount: '', note: '' });
      fetchData();
    } catch { toast.error('Adjustment failed'); }
    finally { setSubmitting(false); }
  };

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Stock Management</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">Track and adjust product inventory levels.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
           <Warehouse size={14} className="text-slate-400" />
           <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">{products.length} Products Tracked</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Adjustment Form */}
        <div className="lg:col-span-4">
           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                    <TrendingUp size={18} />
                 </div>
                 <h2 className="text-base font-bold text-slate-900">Stock Adjustment</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className={labelClass}>Product</label>
                  <select 
                    value={form.product} 
                    onChange={e => setForm({ ...form, product: e.target.value })}
                    required
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                  >
                    <option value="">Choose a product...</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} ({p.stock} in stock)</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Action</label>
                    <select 
                      value={form.type} 
                      onChange={e => setForm({ ...form, type: e.target.value as any })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                    >
                      <option value="ADD">Restock (+)</option>
                      <option value="REMOVE">Remove (-)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Amount</label>
                    <input 
                      type="number" 
                      value={form.amount} 
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      placeholder="0"
                      required
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Notes / Reason</label>
                  <textarea 
                    value={form.note} 
                    onChange={e => setForm({ ...form, note: e.target.value })}
                    placeholder="e.g. Damage replacement"
                    rows={2}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all resize-none" 
                  />
                </div>

                <button type="submit" disabled={submitting} className="w-full h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2 shadow-sm active:scale-[0.98]">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                  Apply Adjustment
                </button>
              </form>
           </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex items-center gap-2 px-1">
              <History size={16} className="text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Adjustment Log</h3>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-20 text-center">
                   <Loader2 size={24} className="text-primary animate-spin mx-auto" />
                </div>
              ) : logs.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold text-[13px]">No logs recorded yet.</div>
              ) : (
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Info</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {logs.map((log) => (
                          <tr key={log._id} className="group hover:bg-slate-50/30 transition-all">
                            <td className="px-6 py-4 text-[13px] font-bold text-slate-900">
                               {log.product?.name || 'Deleted Product'}
                            </td>
                            <td className="px-6 py-4">
                               <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${log.type === 'ADD' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                 {log.type === 'ADD' ? 'Restock' : 'Removal'}
                               </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-[13px] font-bold">
                               {log.type === 'ADD' ? '+' : '-'}{log.amount}
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-[11px] font-medium text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
