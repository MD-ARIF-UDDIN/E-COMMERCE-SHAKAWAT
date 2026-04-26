'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Layers, 
  Target, 
  Cpu, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Search,
  Activity,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [subBrands, setSubBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandForm, setBrandForm] = useState({ name: '', slug: '' });
  const [subForm, setSubForm] = useState({ name: '', slug: '', brand: '' });
  const [submittingBrand, setSubmittingBrand] = useState(false);
  const [submittingSub, setSubmittingSub] = useState(false);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const fetchData = async () => {
    setLoading(true);
    const [bRes, sRes] = await Promise.all([api.get('/brands'), api.get('/brands/sub-brands')]);
    setBrands(bRes.data);
    setSubBrands(sRes.data);
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBrand(true);
    try {
      await api.post('/brands', brandForm);
      toast.success('Brand created successfully');
      setBrandForm({ name: '', slug: '' });
      fetchData();
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed to create brand'); }
    finally { setSubmittingBrand(false); }
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.brand) return toast.error('Parent brand selection required');
    setSubmittingSub(true);
    try {
      await api.post('/brands/sub-brands', subForm);
      toast.success('Sub-brand created successfully');
      setSubForm({ name: '', slug: '', brand: '' });
      fetchData();
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed to create sub-brand'); }
    finally { setSubmittingSub(false); }
  };

  return (
    <div className="space-y-16 pb-32">
      {/* Header */}
      <div className="px-4">
         <div className="flex items-center gap-2 mb-2">
            <Globe size={14} className="text-indigo-600" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Brand Management</p>
         </div>
         <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">Brands & Collections</h1>
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
           Main Brands: <span className="text-slate-950">{brands.length}</span> — Sub-Brands: <span className="text-slate-950">{subBrands.length}</span>
         </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Brands Section */}
        <div className="space-y-8">
           <div className="bg-slate-950 rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                      <Award size={20} />
                   </div>
                   <h2 className="text-sm font-black text-white uppercase tracking-widest">Add Main Brand</h2>
                </div>
                
                <form onSubmit={handleBrandSubmit} className="space-y-4">
                  <input 
                    value={brandForm.name} 
                    onChange={e => setBrandForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    required 
                    placeholder="Brand Name (e.g. Samsung)"
                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-500" 
                  />
                  <input 
                    value={brandForm.slug} 
                    onChange={e => setBrandForm(f => ({ ...f, slug: e.target.value }))}
                    required 
                    placeholder="brand-url-slug"
                    className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-mono text-indigo-400 focus:bg-white/10 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600" 
                  />
                  <button type="submit" disabled={submittingBrand} className="w-full h-16 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-3">
                    {submittingBrand ? <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : <Plus size={16} />}
                    Create Brand
                  </button>
                </form>
              </div>
              <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                 <ShieldCheck size={120} strokeWidth={1} />
              </div>
           </div>

           <div className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner shadow-slate-200/20">
              <div className="px-10 py-8 border-b border-slate-200/60 flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Directory</h3>
                 <span className="text-[10px] font-black text-slate-950 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{brands.length} Brands</span>
              </div>
              <div className="p-4 grid gap-2">
                 {loading ? (
                    <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Loading...</div>
                 ) : brands.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No brands found</div>
                 ) : brands.map(b => (
                   <motion.div layout key={b._id} className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 group transition-all">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 border border-slate-50 transition-colors">
                        <Layers size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-950 text-sm tracking-tight">{b.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 font-mono uppercase">{b.slug}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sub-Brands Section */}
        <div className="space-y-8">
           <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-premium relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 border border-slate-100">
                      <Cpu size={20} />
                   </div>
                   <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">Add Sub-Brand</h2>
                </div>
                
                <form onSubmit={handleSubSubmit} className="space-y-4">
                  <select 
                    value={subForm.brand} 
                    onChange={e => setSubForm(f => ({ ...f, brand: e.target.value }))}
                    required 
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="" className="text-slate-400">Select Parent Brand</option>
                    {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                  <input 
                    value={subForm.name} 
                    onChange={e => setSubForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    required 
                    placeholder="Sub-Brand Name (e.g. Galaxy S Series)"
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400" 
                  />
                  <input 
                    value={subForm.slug} 
                    onChange={e => setSubForm(f => ({ ...f, slug: e.target.value }))}
                    required 
                    placeholder="sub-brand-url-slug"
                    className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400" 
                  />
                  <button type="submit" disabled={submittingSub} className="w-full h-16 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-premium flex items-center justify-center gap-3">
                    {submittingSub ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
                    Create Sub-Brand
                  </button>
                </form>
              </div>
           </div>

           <div className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner shadow-slate-200/20">
              <div className="px-10 py-8 border-b border-slate-200/60 flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sub-Brand Directory</h3>
                 <span className="text-[10px] font-black text-slate-950 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">{subBrands.length} Sub-Brands</span>
              </div>
              <div className="p-4 grid gap-2">
                 {loading ? (
                    <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">Loading...</div>
                 ) : subBrands.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No sub-brands found</div>
                 ) : subBrands.map(s => (
                   <motion.div layout key={s._id} className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 group transition-all">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 border border-slate-50 transition-colors">
                        <Target size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-950 text-sm tracking-tight">{s.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Parent: <span className="text-indigo-600 font-black">{s.brand?.name || 'None'}</span></p>
                      </div>
                      <Activity size={14} className="text-slate-200 group-hover:text-indigo-400 transition-all animate-pulse" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
