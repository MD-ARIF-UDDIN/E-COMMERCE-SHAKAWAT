'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import {
  ImagePlus,
  X,
  UploadCloud,
  Layers,
  DollarSign,
  Box,
  Layout,
  CheckCircle2,
  AlertCircle,
  Zap,
  Tag as TagIcon
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string; slug: string; price: string; discountPrice: string; stock: string;
  description: string; category: string; brand: string; subBrand: string;
  isFeatured: boolean; isDiscounted: boolean; hasColors: boolean;
}

const empty: FormData = {
  name: '', slug: '', price: '', discountPrice: '', stock: '', description: '',
  category: '', brand: '', subBrand: '', isFeatured: false, isDiscounted: false, hasColors: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface ProductFormProps {
  id?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ id, onSuccess, onCancel }: ProductFormProps) {
  const isNew = !id;
  const [form, setForm] = useState<FormData>(empty);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [subBrands, setSubBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [colorVariants, setColorVariants] = useState<{name: string, hexCode: string, stock: string}[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch options
    Promise.all([
      api.get('/categories'),
      api.get('/brands'),
      api.get('/brands/sub-brands')
    ]).then(([cat, brand, sub]) => {
      setCategories(cat.data);
      setBrands(brand.data);
      setSubBrands(sub.data);
    });

    if (id) {
      api.get(`/products/by-id/${id}`).then(r => {
        const p = r.data;
        setForm({
          name: p.name || '', slug: p.slug || '', price: String(p.price || ''),
          discountPrice: String(p.discountPrice || ''), stock: String(p.stock || ''),
          description: p.description || '', category: p.category?._id || p.category || '',
          brand: p.brand?._id || p.brand || '', subBrand: p.subBrand?._id || p.subBrand || '',
          isFeatured: p.isFeatured || false, isDiscounted: p.isDiscounted || false, hasColors: p.hasColors || false,
        });
        setExistingImages(p.images || []);
        if (p.colorVariants) {
          setColorVariants(p.colorVariants.map((c: any) => ({
            name: c.name, hexCode: c.hexCode, stock: String(c.stock)
          })));
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setForm(f => {
      const updated = { ...f, [name]: val };
      if (name === 'name' && isNew) updated.slug = slugify(value);
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length + existingImages.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (form.hasColors) {
      formData.append('colorVariants', JSON.stringify(colorVariants));
    }
    selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    if (!isNew) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }
    try {
      if (isNew) {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product added successfully');
      } else {
        await api.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="py-20 text-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest">Loading Details...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gold-900 uppercase tracking-widest px-1">Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Product Name" className="w-full h-14 px-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:bg-white focus:border-primary focus:outline-none transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gold-900 uppercase tracking-widest px-1">URL Slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} required placeholder="slug" className="w-full h-14 px-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-400 focus:bg-white focus:border-primary focus:outline-none transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gold-900 uppercase tracking-widest px-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} required className="w-full h-14 px-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:bg-white focus:border-primary focus:outline-none transition-all">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gold-900 uppercase tracking-widest px-1">Brand</label>
          <select name="brand" value={form.brand} onChange={handleChange} className="w-full h-14 px-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:bg-white focus:border-primary focus:outline-none transition-all">
            <option value="">Select Brand</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gold-900 uppercase tracking-widest px-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full p-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-medium text-gold-600 focus:bg-white focus:border-primary focus:outline-none transition-all resize-none" />
      </div>

      {/* Pricing */}
      <div className="bg-gold-50 rounded-[2rem] p-6 lg:p-8 space-y-6">
        <h3 className="text-sm font-black text-gold-900 uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={16} className="text-primary" /> Pricing & Inventory
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest px-1">Regular Price</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full h-14 px-5 bg-white border border-gold-200 rounded-2xl text-sm font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest px-1">Discount Price</label>
            <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className="w-full h-14 px-5 bg-white border border-gold-200 rounded-2xl text-sm font-bold text-primary" />
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <label className="flex items-center gap-4 cursor-pointer">
            <input type="checkbox" name="hasColors" checked={form.hasColors} onChange={handleChange} className="w-5 h-5 rounded border-gold-300 text-primary focus:ring-primary" />
            <span className="text-[10px] font-black text-gold-900 uppercase tracking-widest">Enable Color Variants</span>
          </label>

          {!form.hasColors ? (
            <div className="max-w-xs space-y-2">
              <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest px-1">Stock Quantity</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="w-full h-14 px-5 bg-white border border-gold-200 rounded-2xl text-sm font-bold" />
            </div>
          ) : (
            <div className="space-y-3">
              {colorVariants.map((color, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-gold-100 rounded-xl">
                  <input type="text" value={color.name} onChange={e => {
                    const v = [...colorVariants]; v[idx].name = e.target.value; setColorVariants(v);
                  }} placeholder="Color" className="flex-1 h-10 px-3 bg-gold-50 border-none rounded-lg text-xs font-bold" />
                  <input type="color" value={color.hexCode} onChange={e => {
                    const v = [...colorVariants]; v[idx].hexCode = e.target.value; setColorVariants(v);
                  }} className="w-8 h-8 rounded cursor-pointer" />
                  <input type="number" value={color.stock} onChange={e => {
                    const v = [...colorVariants]; v[idx].stock = e.target.value; setColorVariants(v);
                  }} placeholder="Stock" className="w-20 h-10 px-3 bg-gold-50 border-none rounded-lg text-xs font-bold" />
                  <button type="button" onClick={() => setColorVariants(colorVariants.filter((_, i) => i !== idx))} className="text-rose-500 hover:text-rose-700"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => setColorVariants([...colorVariants, { name: '', hexCode: '#000000', stock: '0' }])} className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
                <Box size={14} /> Add Variant
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-gold-900 uppercase tracking-widest px-1">Product Images (Max 10)</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          <AnimatePresence>
            {existingImages.map((url, i) => (
              <motion.div key={`ex-${i}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square rounded-xl overflow-hidden border border-gold-100 shadow-sm">
                <Image src={url} alt="Product" fill className="object-cover" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"><X size={12} /></button>
              </motion.div>
            ))}
            {previews.map((url, i) => (
              <motion.div key={`pre-${i}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-primary/40">
                <Image src={url} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => removeSelectedFile(i)} className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"><X size={12} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {(existingImages.length + selectedFiles.length) < 10 && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gold-200 flex flex-col items-center justify-center gap-1 hover:border-primary/80 hover:bg-gold-50 transition-all text-gold-400">
              <ImagePlus size={20} />
              <span className="text-[8px] font-black uppercase tracking-tighter">Add</span>
            </button>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
      </div>

      {/* Promotions */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold-100">
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gold-50 rounded-2xl hover:bg-white border border-transparent hover:border-primary/20 transition-all">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 rounded text-primary" />
          <div className="flex-1">
            <p className="text-[10px] font-black text-gold-900 uppercase tracking-widest">Featured</p>
            <p className="text-[8px] font-bold text-gold-400 uppercase">Show on Home</p>
          </div>
          <Zap size={14} className={form.isFeatured ? 'text-primary' : 'text-gold-200'} />
        </label>
        <label className="flex items-center gap-3 cursor-pointer p-4 bg-gold-50 rounded-2xl hover:bg-white border border-transparent hover:border-rose-100 transition-all">
          <input type="checkbox" name="isDiscounted" checked={form.isDiscounted} onChange={handleChange} className="w-4 h-4 rounded text-rose-500" />
          <div className="flex-1">
            <p className="text-[10px] font-black text-gold-900 uppercase tracking-widest">On Sale</p>
            <p className="text-[8px] font-bold text-gold-400 uppercase">Apply Discount</p>
          </div>
          <TagIcon size={14} className={form.isDiscounted ? 'text-rose-500' : 'text-gold-200'} />
        </label>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 pt-6 pb-2 bg-white border-t border-gold-50 flex items-center gap-4">
        <button type="button" onClick={onCancel} className="flex-1 h-14 rounded-2xl border border-gold-100 text-gold-400 font-black text-[10px] uppercase tracking-widest hover:bg-gold-50 hover:text-rose-600 transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-[2] h-14 bg-gold-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary shadow-premium flex items-center justify-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
          {isNew ? 'Create Product' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
