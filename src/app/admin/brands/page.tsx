'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Image as ImageIcon, 
  Search, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [subBrands, setSubBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [brandForm, setBrandForm] = useState({ name: '', slug: '' });
  const [subForm, setSubForm] = useState({ name: '', slug: '', brandId: '' });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        api.get('/brands'),
        api.get('/brands/sub-brands')
      ]);
      setBrands(bRes.data);
      setSubBrands(sRes.data);
    } catch { toast.error('Failed to load brands'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openBrandModal = (brand: any = null) => {
    if (brand) {
      setEditingItem(brand);
      setBrandForm({ name: brand.name, slug: brand.slug });
      setPreview(brand.logo || '');
    } else {
      setEditingItem(null);
      setBrandForm({ name: '', slug: '' });
      setPreview('');
    }
    setImage(null);
    setIsBrandModalOpen(true);
  };

  const openSubModal = (sub: any = null) => {
    if (sub) {
      setEditingItem(sub);
      setSubForm({ name: sub.name, slug: sub.slug, brandId: sub.brandId || sub.brand?._id || '' });
    } else {
      setEditingItem(null);
      setSubForm({ name: '', slug: '', brandId: '' });
    }
    setIsSubModalOpen(true);
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', brandForm.name);
    formData.append('slug', brandForm.slug);
    if (image) formData.append('logo', image);

    try {
      if (editingItem) await api.put(`/brands/${editingItem._id}`, formData);
      else await api.post('/brands', formData);
      toast.success(editingItem ? 'Brand updated' : 'Brand created');
      setIsBrandModalOpen(false);
      fetchData();
    } catch { toast.error('Failed to save brand'); }
    finally { setSubmitting(false); }
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingItem) await api.put(`/brands/sub-brands/${editingItem._id}`, subForm);
      else await api.post('/brands/sub-brands', subForm);
      toast.success(editingItem ? 'Sub-brand updated' : 'Sub-brand created');
      setIsSubModalOpen(false);
      fetchData();
    } catch { toast.error('Failed to save sub-brand'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, type: 'brand' | 'sub') => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      if (type === 'brand') await api.delete(`/brands/${id}`);
      else await api.delete(`/brands/sub-brands/${id}`);
      toast.success('Deleted successfully');
      fetchData();
    } catch { toast.error('Deletion failed'); }
  };

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <div className="space-y-12">
      {/* Brands Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Brands</h1>
            <p className="text-slate-500 text-[13px] font-medium mt-0.5">Manage manufacturer and partner identities.</p>
          </div>
          <button onClick={() => openBrandModal()} className="h-11 px-6 flex items-center gap-2 bg-slate-900 text-white font-bold text-[13px] rounded-xl hover:bg-primary transition-all active:scale-[0.98] shadow-sm">
            <Plus size={16} /> New Brand
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {loading ? Array(6).fill(0).map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />) : brands.map(brand => (
            <div key={brand._id} className="group bg-white border border-slate-200 rounded-2xl p-6 text-center hover:border-primary transition-all relative">
               <div className="relative w-12 h-12 mx-auto mb-4 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center">
                  {brand.logo ? <Image src={brand.logo} alt={brand.name} fill className="object-contain p-2" /> : <ShieldCheck size={24} className="text-slate-200" />}
               </div>
               <h3 className="text-[13px] font-bold text-slate-900 truncate">{brand.name}</h3>
               <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openBrandModal(brand)} className="p-1.5 text-slate-300 hover:text-primary transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => handleDelete(brand._id, 'brand')} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={12} /></button>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-Brands Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Series / Sub-Brands</h2>
            <p className="text-slate-500 text-[12px] font-medium mt-0.5">Organize product lines under main brands.</p>
          </div>
          <button onClick={() => openSubModal()} className="h-10 px-5 flex items-center gap-2 bg-slate-100 text-slate-700 font-bold text-[12px] rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
            <Layers size={14} /> New Series
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Series Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Parent Brand</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {subBrands.map(sub => (
                  <tr key={sub._id} className="group hover:bg-slate-50/30 transition-all">
                    <td className="px-6 py-4">
                       <p className="text-[13px] font-bold text-slate-900">{sub.name}</p>
                       <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{sub.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">{sub.brand?.name || 'Unassigned'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openSubModal(sub)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(sub._id, 'sub')} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </section>

      {/* Brand Modal */}
      <Modal isOpen={isBrandModalOpen} onClose={() => setIsBrandModalOpen(false)} title={editingItem ? 'Edit Brand' : 'New Brand'} maxWidth="max-w-md">
        <form onSubmit={handleBrandSubmit} className="space-y-4">
           <div className="space-y-1">
              <label className={labelClass}>Brand Name</label>
              <input 
                value={brandForm.name} 
                onChange={e => setBrandForm({ ...brandForm, name: e.target.value, slug: editingItem ? brandForm.slug : e.target.value.toLowerCase().replace(/ /g, '-') })}
                required 
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all" 
              />
           </div>
           <div className="space-y-1">
              <label className={labelClass}>URL Slug</label>
              <input value={brandForm.slug} onChange={e => setBrandForm({ ...brandForm, slug: e.target.value })} required className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all" />
           </div>
           <div className="space-y-1">
              <label className={labelClass}>Brand Logo</label>
              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                 <div className="relative w-12 h-12 rounded-lg bg-white border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {preview ? <Image src={preview} alt="Preview" fill className="object-contain p-2" /> : <ImageIcon size={20} className="text-slate-300" />}
                 </div>
                 <input type="file" onChange={e => {
                   const f = e.target.files?.[0];
                   if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
                 }} className="text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
              </div>
           </div>
           <div className="pt-4 flex gap-3 border-t border-slate-100">
              <button type="button" onClick={() => setIsBrandModalOpen(false)} className="px-6 h-11 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm">
                 {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                 {editingItem ? 'Update Brand' : 'Create Brand'}
              </button>
           </div>
        </form>
      </Modal>

      {/* Sub-Brand Modal */}
      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title={editingItem ? 'Edit Series' : 'New Series'} maxWidth="max-w-md">
        <form onSubmit={handleSubSubmit} className="space-y-4">
           <div className="space-y-1">
              <label className={labelClass}>Series Name</label>
              <input 
                value={subForm.name} 
                onChange={e => setSubForm({ ...subForm, name: e.target.value, slug: editingItem ? subForm.slug : e.target.value.toLowerCase().replace(/ /g, '-') })}
                required 
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all" 
              />
           </div>
           <div className="space-y-1">
              <label className={labelClass}>URL Slug</label>
              <input value={subForm.slug} onChange={e => setSubForm({ ...subForm, slug: e.target.value })} required className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all" />
           </div>
           <div className="space-y-1">
              <label className={labelClass}>Parent Brand</label>
              <select 
                value={subForm.brandId} 
                onChange={e => setSubForm({ ...subForm, brandId: e.target.value })}
                required
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
              >
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
           </div>
           <div className="pt-4 flex gap-3 border-t border-slate-100">
              <button type="button" onClick={() => setIsSubModalOpen(false)} className="px-6 h-11 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" disabled={submitting} className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm">
                 {submitting ? <Loader2 size={16} className="animate-spin" /> : <Layers size={16} />}
                 {editingItem ? 'Update Series' : 'Create Series'}
              </button>
           </div>
        </form>
      </Modal>
    </div>
  );
}
