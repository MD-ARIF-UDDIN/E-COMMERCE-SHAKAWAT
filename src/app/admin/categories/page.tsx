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
  ChevronRight,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', slug: '', description: '' });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat: any = null) => {
    if (cat) {
      setEditingCategory(cat);
      setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
      setPreview(cat.image || '');
    } else {
      setEditingCategory(null);
      setForm({ name: '', slug: '', description: '' });
      setPreview('');
    }
    setImage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('description', form.description);
    if (image) formData.append('image', image);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch { toast.error('Failed to save category'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete the category.')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete'); }
  };

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Categories</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">Manage your store product departments.</p>
        </div>
        
        <button onClick={() => openModal()} className="h-11 px-6 flex items-center gap-2 bg-slate-900 text-white font-bold text-[13px] rounded-xl hover:bg-primary transition-all active:scale-[0.98] shadow-sm">
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
          ))
        ) : categories.map((cat) => (
          <div key={cat._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-primary transition-all">
             <div className="relative h-32 bg-slate-50">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <LayoutGrid size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             
             <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="text-[13px] font-bold text-slate-900">{cat.name}</h3>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(cat)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(cat._id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                   </div>
                </div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{cat.slug}</p>
             </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'New Category'} maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
             <label className={labelClass}>Category Name</label>
             <input 
               value={form.name} 
               onChange={e => setForm({ ...form, name: e.target.value, slug: editingCategory ? form.slug : e.target.value.toLowerCase().replace(/ /g, '-') })}
               required 
               className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all" 
             />
          </div>
          <div className="space-y-1">
             <label className={labelClass}>URL Slug</label>
             <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all" />
          </div>
          
          <div className="space-y-1">
             <label className={labelClass}>Thumbnail Image</label>
             <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="relative w-12 h-12 rounded-lg bg-white border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                   {preview ? <Image src={preview} alt="Preview" fill className="object-cover" /> : <ImageIcon size={20} className="text-slate-300" />}
                </div>
                <input type="file" onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) { setImage(f); setPreview(URL.createObjectURL(f)); }
                }} className="text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" />
             </div>
          </div>

          <div className="pt-4 flex gap-3 border-t border-slate-100">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 h-11 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
             <button type="submit" disabled={submitting} className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                {editingCategory ? 'Update Category' : 'Create Category'}
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
