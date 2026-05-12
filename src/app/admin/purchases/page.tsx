'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  History, 
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  User,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPurchasesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    costPrice: '',
    supplier: ''
  });

  const fetchData = async () => {
    setLoading(true);
    const [pRes, purRes] = await Promise.all([
      api.get('/products'),
      api.get('/purchases')
    ]);
    setProducts(pRes.data);
    setPurchases(purRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product || !form.quantity || !form.costPrice) return toast.error('Fill required fields');
    setSubmitting(true);
    try {
      await api.post('/purchases', {
        productId: form.product,
        quantity: Number(form.quantity),
        costPrice: Number(form.costPrice),
        supplier: form.supplier
      });
      toast.success('Purchase recorded');
      setForm({ product: '', quantity: '', costPrice: '', supplier: '' });
      fetchData();
    } catch { toast.error('Failed to record'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/purchases/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const totalSpent = purchases.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);
  const totalUnits = purchases.reduce((acc, p) => acc + p.quantity, 0);

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Purchases</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">
             Total Investment: <span className="text-slate-900 font-bold">৳{totalSpent.toLocaleString()}</span> — Units: <span className="text-slate-900 font-bold">{totalUnits}</span>
           </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Record Form */}
        <div className="lg:col-span-4">
           <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                    <ShoppingBag size={18} />
                 </div>
                 <h2 className="text-base font-bold text-slate-900">Record Purchase</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className={labelClass}>Select Product</label>
                  <select 
                    value={form.product} 
                    onChange={e => setForm({ ...form, product: e.target.value })}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                  >
                    <option value="">Choose product...</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} (Stock: {p.stock})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Quantity</label>
                    <input 
                      type="number" 
                      value={form.quantity} 
                      onChange={e => setForm({ ...form, quantity: e.target.value })}
                      placeholder="0"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Cost / Unit</label>
                    <input 
                      type="number" 
                      value={form.costPrice} 
                      onChange={e => setForm({ ...form, costPrice: e.target.value })}
                      placeholder="৳"
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className={labelClass}>Supplier Name</label>
                  <input 
                    value={form.supplier} 
                    onChange={e => setForm({ ...form, supplier: e.target.value })}
                    placeholder="Enter supplier info"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all" 
                  />
                </div>

                <button type="submit" disabled={submitting} className="w-full h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2 shadow-sm active:scale-[0.98]">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Record Transaction
                </button>
              </form>
           </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex items-center gap-2 px-1">
              <History size={16} className="text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Purchases</h3>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-20 text-center">
                   <Loader2 size={24} className="text-primary animate-spin mx-auto" />
                </div>
              ) : purchases.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold text-[13px]">No purchase history found.</div>
              ) : (
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Info</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unit Cost</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {purchases.map((p) => (
                          <tr key={p._id} className="group hover:bg-slate-50/30 transition-all">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 border border-slate-100">
                                     <Package size={14} />
                                  </div>
                                  <div>
                                     <p className="text-[13px] font-bold text-slate-900 truncate max-w-[150px]">{p.product?.name || 'Deleted'}</p>
                                     <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1"><Calendar size={10} /> {new Date(p.createdAt).toLocaleDateString()}</p>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1"><User size={10} /> {p.supplier || 'Private'}</p>
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="text-[13px] font-bold text-slate-900">{p.quantity} Units</span>
                            </td>
                            <td className="px-6 py-4">
                               <span className="text-[13px] font-bold text-primary">৳{p.costPrice?.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <button onClick={() => handleDelete(p._id)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                 <Trash2 size={14} />
                               </button>
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
