'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Tag, 
  Image as ImageIcon,
  UploadCloud,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true); 
  };
  const openEdit = (cat: any) => { 
    setEditing(cat); 
    setForm({ name: cat.name, slug: cat.slug, image: cat.image || '' }); 
    setImageFile(null);
    setIsModalOpen(true); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) return toast.error('Required fields missing');
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
        toast.success('Updated');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-gold-900 tracking-tight">Categories</h1>
           <p className="text-gold-400 text-[13px] font-medium mt-1">
             Organize your products into logical collections.
           </p>
        </div>
        
        <button onClick={openCreate} className="h-12 px-6 flex items-center gap-2 bg-gold-900 text-white font-bold text-[13px] rounded-xl hover:bg-primary transition-all">
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="bg-white border border-gold-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-20 text-center text-gold-400 font-bold uppercase text-[11px] tracking-widest">
            No categories found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gold-50/50 border-b border-gold-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-gold-400 uppercase tracking-widest">Category Info</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-gold-400 uppercase tracking-widest">URL Slug</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-gold-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-50">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-gold-50/30 transition-all">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gold-50 rounded-lg border border-gold-100 overflow-hidden flex items-center justify-center">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={14} className="text-gold-200" />
                          )}
                        </div>
                        <span className="text-[13px] font-bold text-gold-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                       <span className="text-[11px] font-bold text-gold-400 font-mono tracking-tight">{cat.slug}</span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gold-400 hover:text-gold-900 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(cat._id, cat.name)} className="w-9 h-9 rounded-lg flex items-center justify-center text-gold-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editing ? 'Edit Category' : 'New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest">Name</label>
            <input 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
              required 
              placeholder="e.g. Smartphones"
              className="w-full h-12 px-4 bg-gold-50 border border-gold-100 rounded-xl text-[13px] font-semibold text-gold-900 focus:bg-white focus:border-gold-200 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest">Slug</label>
            <input 
              value={form.slug} 
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              required 
              placeholder="slug"
              className="w-full h-12 px-4 bg-gold-50 border border-gold-100 rounded-xl text-[13px] font-semibold text-gold-400 focus:bg-white focus:border-gold-200 outline-none transition-all" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest">Cover Image</label>
            <div className="relative group/upload">
               <div className={`w-full aspect-video rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-2 overflow-hidden ${imageFile || form.image ? 'border-emerald-100 bg-emerald-50/20' : 'border-gold-100 bg-gold-50 hover:border-gold-200'}`}>
                  {imageFile || form.image ? (
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : form.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <UploadCloud size={20} className="text-gold-300 mb-1" />
                      <p className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">Click to upload</p>
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
          
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-xl border border-gold-100 text-gold-400 font-bold text-[13px] hover:bg-gold-50 transition-all">Cancel</button>
            <button 
              type="submit" 
              disabled={submitting} 
              className="flex-[2] h-12 bg-gold-900 text-white rounded-xl font-bold text-[13px] hover:bg-primary transition-all flex items-center justify-center gap-2"
            >
              {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} />}
              {editing ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
