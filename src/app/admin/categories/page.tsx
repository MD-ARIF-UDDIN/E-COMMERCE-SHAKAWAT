'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Tag, 
  Layout, 
  ChevronRight, 
  MoreVertical,
  CheckCircle2,
  X,
  Layers,
  Activity,
  Image as ImageIcon,
  UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const fetchCategories = async () => {
    setLoading(true);
    const res = await api.get('/categories');
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => { 
    setEditing(null); 
    setForm({ name: '', slug: '', image: '' }); 
    setImageFile(null);
    setShowForm(true); 
  };
  const openEdit = (cat: any) => { 
    setEditing(cat); 
    setForm({ name: cat.name, slug: cat.slug, image: cat.image || '' }); 
    setImageFile(null);
    setShowForm(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return toast.error('Category name and slug are required');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('slug', form.slug);
      if (imageFile) formData.append('image', imageFile);

      if (editing) {
        await api.put(`/categories/${editing._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('New category created');
      }
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-indigo-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Store Categories</p>
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">Categories</h1>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
             Total Categories: <span className="text-slate-950">{categories.length}</span>
           </p>
        </div>
        
        <button onClick={openCreate} className="h-14 px-10 flex items-center gap-3 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-premium">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Form Sidebar / Overlay */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:col-span-4"
            >
              <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-10 space-y-10 shadow-inner shadow-slate-200/20 sticky top-12">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-6">
                   <div>
                      <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">{editing ? 'Edit Category' : 'New Category'}</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Category Details</p>
                   </div>
                   <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors">
                      <X size={14} />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Category Name</label>
                    <input 
                      value={form.name} 
                      onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
                      required 
                      placeholder="e.g. Smartphones"
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all placeholder:text-slate-300" 
                    />
                  </div>
                    <input 
                      value={form.slug} 
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      required 
                      placeholder="e.g. smartphones"
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-400 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Category Image</label>
                    <div className="relative group/upload">
                       <div className={`w-full aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-4 overflow-hidden ${imageFile || form.image ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                          {imageFile || form.image ? (
                            <img 
                              src={imageFile ? URL.createObjectURL(imageFile) : form.image} 
                              alt="Preview" 
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <>
                              <UploadCloud size={24} className="text-slate-300 group-hover/upload:text-indigo-400 transition-colors mb-2" />
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Click to upload image</p>
                            </>
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={e => setImageFile(e.target.files?.[0] || null)}
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                          />
                       </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4 pt-4">
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className="h-16 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-premium flex items-center justify-center gap-2"
                    >
                      {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={14} />}
                      {editing ? 'Save Changes' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories List */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner shadow-slate-200/20">
            {loading ? (
              <div className="p-24 text-center">
                 <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-24 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                   <Tag size={32} className="text-slate-300" strokeWidth={1} />
                </div>
                <p className="text-slate-950 font-black text-xl tracking-tight mb-2">No Categories Found</p>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Start by adding your first category</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/60">
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categories.map((cat, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={cat._id} 
                        className="group hover:bg-white transition-all duration-300"
                      >
                        <td className="px-6 lg:px-10 py-4 lg:py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 border border-slate-100 shadow-sm transition-all overflow-hidden p-1">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <ImageIcon size={20} className="text-slate-200" />
                              )}
                            </div>
                            <span className="text-sm font-black text-slate-950 tracking-tight">{cat.name}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6">
                           <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tight uppercase">{cat.slug}</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => openEdit(cat)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:shadow-sm transition-all"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(cat._id, cat.name)} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:shadow-sm transition-all"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </motion.tr>
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
