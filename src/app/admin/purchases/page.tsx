'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  ShoppingBag, 
  CreditCard, 
  Plus, 
  History, 
  Truck, 
  DollarSign, 
  Package, 
  FileText,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ product: '', quantity: '', costPrice: '', supplier: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [pRes, prRes] = await Promise.all([
      api.get('/admin/inventory/purchases'),
      api.get('/products'),
    ]);
    setPurchases(pRes.data);
    setProducts(prRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product || !form.quantity || !form.costPrice) return toast.error('Please fill in all required fields');
    setSubmitting(true);
    try {
      await api.post('/admin/inventory/purchases', {
        product: form.product,
        quantity: Number(form.quantity),
        costPrice: Number(form.costPrice),
        supplier: form.supplier,
      });
      toast.success('Purchase recorded successfully');
      setForm({ product: '', quantity: '', costPrice: '', supplier: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to record purchase');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-32">
      {/* Header */}
      <div className="px-4">
         <div className="flex items-center gap-2 mb-2">
            <CreditCard size={14} className="text-indigo-600" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Purchase Management</p>
         </div>
         <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">Purchases</h1>
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
           Total Spent: <span className="text-slate-950">৳{purchases.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0).toLocaleString()}</span> — Units Purchased: <span className="text-slate-950">{purchases.reduce((acc, p) => acc + p.quantity, 0)}</span>
         </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* New Purchase Form */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-10 space-y-10 shadow-inner shadow-slate-200/20">
              <div>
                 <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">Record New Purchase</h2>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Stock levels will update automatically</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-950 uppercase tracking-widest px-1 text-slate-400">Select Product</label>
                  <select 
                    value={form.product} 
                    onChange={e => setForm(f => ({...f, product: e.target.value}))}
                    required 
                    className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all"
                  >
                    <option value="">Choose a product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={form.quantity} 
                      onChange={e => setForm(f => ({...f, quantity: e.target.value}))}
                      required 
                      placeholder="Qty"
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Cost Price (Unit)</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={form.costPrice} 
                      onChange={e => setForm(f => ({...f, costPrice: e.target.value}))}
                      required 
                      placeholder="৳"
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Supplier Name</label>
                  <input 
                    type="text" 
                    value={form.supplier} 
                    onChange={e => setForm(f => ({...f, supplier: e.target.value}))}
                    placeholder="e.g. Global Supplies"
                    className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all placeholder:text-slate-300" 
                  />
                </div>

                <button type="submit" disabled={submitting} className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-premium flex items-center justify-center gap-3 pt-1">
                  {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShoppingBag size={16} />}
                  Add Purchase
                </button>
              </form>
           </div>
        </div>

        {/* Purchase History */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-premium overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <History size={16} className="text-slate-950" />
                    <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Recent Purchases</h3>
                 </div>
                 <Database size={16} className="text-slate-300" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Cost</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Supplier & Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {purchases.map((p, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={p._id} 
                        className="group hover:bg-slate-50/80 transition-all duration-300"
                      >
                        <td className="px-10 py-6">
                           <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-950 tracking-tight">{p.product?.name || 'Deleted Product'}</span>
                             <span className="text-[9px] font-black text-slate-400 uppercase">৳{p.costPrice?.toLocaleString()} per unit</span>
                           </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-sm font-black text-slate-950 tracking-tight">{p.quantity} Units</span>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-sm font-black text-indigo-600 tracking-tight">৳{(p.quantity * p.costPrice)?.toLocaleString()}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex flex-col items-end">
                              <span className="text-[10px] font-black text-slate-950 uppercase tracking-tighter mb-1">{p.supplier || 'Private Supplier'}</span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{new Date(p.date || p.createdAt).toLocaleDateString()}</span>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                    {purchases.length === 0 && !loading && (
                       <tr><td colSpan={4} className="px-10 py-24 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">No purchases found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
