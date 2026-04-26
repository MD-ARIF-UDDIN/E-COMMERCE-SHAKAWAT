'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Layers, 
  Target, 
  Globe,
  Award,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [subBrands, setSubBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  
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
      toast.success('Brand created');
      setBrandForm({ name: '', slug: '' });
      setIsBrandModalOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed'); }
    finally { setSubmittingBrand(false); }
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.brand) return toast.error('Parent brand required');
    setSubmittingSub(true);
    try {
      await api.post('/brands/sub-brands', subForm);
      toast.success('Sub-brand created');
      setSubForm({ name: '', slug: '', brand: '' });
      setIsSubModalOpen(false);
      fetchData();
    } catch (err: any) { toast.error(err?.response?.data?.error || 'Failed'); }
    finally { setSubmittingSub(false); }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Delete Brand "${name}"?`)) return;
    try {
      await api.delete(`/brands/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const handleDeleteSub = async (id: string, name: string) => {
    if (!confirm(`Delete Sub-brand "${name}"?`)) return;
    try {
      await api.delete(`/brands/sub-brands/${id}`);
      toast.success('Deleted');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Brands</h1>
           <p className="text-slate-400 text-[13px] font-medium mt-1">Manage brand hierarchy and associations.</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={() => setIsBrandModalOpen(true)} className="h-11 px-5 flex items-center gap-2 bg-slate-950 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all">
            <Plus size={14} /> Add Brand
          </button>
          <button onClick={() => setIsSubModalOpen(true)} className="h-11 px-5 flex items-center gap-2 bg-white border border-slate-200 text-slate-950 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Plus size={14} /> Add Sub-Brand
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Main Brands */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
             <Award size={14} className="text-amber-500" /> Main Brands
          </h3>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/10">
             <div className="p-3 grid gap-1">
                {loading ? (
                   <div className="py-12 text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">Loading...</div>
                ) : brands.length === 0 ? (
                   <div className="py-12 text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">No brands found</div>
                ) : brands.map(b => (
                  <div key={b._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 rounded-xl transition-all group">
                     <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                       <Layers size={14} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="font-bold text-slate-950 text-[13px] tracking-tight">{b.name}</p>
                       <p className="text-[10px] font-medium text-slate-400 font-mono">{b.slug}</p>
                     </div>
                     <button onClick={() => handleDeleteBrand(b._id, b.name)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sub-Brands */}
        <div className="space-y-6">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
             <Cpu size={14} className="text-indigo-500" /> Sub-Brands
          </h3>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/10">
             <div className="p-3 grid gap-1">
                {loading ? (
                   <div className="py-12 text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">Loading...</div>
                ) : subBrands.length === 0 ? (
                   <div className="py-12 text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">No sub-brands found</div>
                ) : subBrands.map(s => (
                  <div key={s._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 rounded-xl transition-all group">
                     <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                       <Target size={14} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="font-bold text-slate-950 text-[13px] tracking-tight">{s.name}</p>
                       <p className="text-[10px] font-medium text-slate-400 uppercase">Parent: <span className="text-slate-950 font-bold">{s.brand?.name || '---'}</span></p>
                     </div>
                     <button onClick={() => handleDeleteSub(s._id, s.name)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} title="New Brand">
        <form onSubmit={handleBrandSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest">Brand Name</label>
            <input 
              value={brandForm.name} 
              onChange={e => setBrandForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
              required 
              placeholder="e.g. Samsung"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest">Slug</label>
            <input 
              value={brandForm.slug} 
              onChange={e => setBrandForm(f => ({ ...f, slug: e.target.value }))}
              required 
              placeholder="slug"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-400 focus:bg-white focus:border-slate-200 outline-none transition-all" 
            />
          </div>
          <button type="submit" disabled={submittingBrand} className="w-full h-12 bg-slate-950 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
            {submittingBrand ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
            Create Brand
          </button>
        </form>
      </Modal>

      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="New Sub-Brand">
        <form onSubmit={handleSubSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest">Parent Brand</label>
            <select 
              value={subForm.brand} 
              onChange={e => setSubForm(f => ({ ...f, brand: e.target.value }))}
              required 
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all"
            >
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest">Sub-Brand Name</label>
            <input 
              value={subForm.name} 
              onChange={e => setSubForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
              required 
              placeholder="e.g. S Series"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest">Slug</label>
            <input 
              value={subForm.slug} 
              onChange={e => setSubForm(f => ({ ...f, slug: e.target.value }))}
              required 
              placeholder="slug"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-400 focus:bg-white focus:border-slate-200 outline-none transition-all" 
            />
          </div>
          <button type="submit" disabled={submittingSub} className="w-full h-12 bg-slate-950 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
            {submittingSub ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={16} />}
            Create Sub-Brand
          </button>
        </form>
      </Modal>
    </div>
  );
}
