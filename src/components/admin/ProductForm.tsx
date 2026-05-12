'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import {
  ImagePlus,
  X,
  DollarSign,
  Box,
  CheckCircle2,
  Zap,
  Tag as TagIcon,
  Maximize2,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string; slug: string; price: string; discountPrice: string; stock: string;
  description: string; category: string; brand: string; subBrand: string;
  isFeatured: boolean; isDiscounted: boolean; isMultipleColor: boolean; isMultipleSize: boolean;
}

const empty: FormData = {
  name: '', slug: '', price: '', discountPrice: '', stock: '', description: '',
  category: '', brand: '', subBrand: '', isFeatured: false, isDiscounted: false, isMultipleColor: false, isMultipleSize: false,
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
  const [sizeVariants, setSizeVariants] = useState<{name: string, stock: string}[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
          description: p.description || '', category: p.categoryId || p.category?._id || p.category || '',
          brand: p.brandId || p.brand?._id || p.brand || '', subBrand: p.subBrandId || p.subBrand?._id || p.subBrand || '',
          isFeatured: p.isFeatured || false, isDiscounted: p.isDiscounted || false, 
          isMultipleColor: p.isMultipleColor || false, isMultipleSize: p.isMultipleSize || false,
        });
        setExistingImages(p.images || []);
        if (p.colorVariants) {
          setColorVariants(p.colorVariants.map((c: any) => ({
            name: c.name, hexCode: c.hexCode, stock: String(c.stock)
          })));
        }
        if (p.sizeVariants) {
          setSizeVariants(p.sizeVariants.map((s: any) => ({
            name: s.name, stock: String(s.stock)
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
    if (form.isMultipleColor) {
      formData.append('colorVariants', JSON.stringify(colorVariants));
    }
    if (form.isMultipleSize) {
      formData.append('sizeVariants', JSON.stringify(sizeVariants));
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
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Loading Details...</p>
    </div>
  );

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Product Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Enter product name" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>URL Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} required placeholder="url-slug" className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary transition-all outline-none">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Brand</label>
            <select name="brand" value={form.brand} onChange={handleChange} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary transition-all outline-none">
              <option value="">Select Brand</option>
              {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe your product..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary transition-all outline-none resize-none" />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
            <DollarSign size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-bold text-black">Pricing & Inventory</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Regular Price</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-black" />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Discount Price</label>
            <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-primary" />
          </div>
        </div>

        <div className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-slate-200/50">
          {/* Colors */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="isMultipleColor" checked={form.isMultipleColor} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-[11px] font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <Palette size={14} className="text-slate-400 group-hover:text-primary transition-colors" /> Multiple Colors
              </span>
            </label>

            {form.isMultipleColor && (
              <div className="space-y-2">
                {colorVariants.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <input type="text" value={color.name} onChange={e => {
                      const v = [...colorVariants]; v[idx].name = e.target.value; setColorVariants(v);
                    }} placeholder="Name" className="flex-1 h-8 px-2 bg-slate-50 border-none rounded-md text-xs font-bold text-black focus:bg-white transition-all outline-none" />
                    <input type="color" value={color.hexCode} onChange={e => {
                      const v = [...colorVariants]; v[idx].hexCode = e.target.value; setColorVariants(v);
                    }} className="w-7 h-7 rounded cursor-pointer shrink-0 border-none bg-transparent" />
                    <input type="number" value={color.stock} onChange={e => {
                      const v = [...colorVariants]; v[idx].stock = e.target.value; setColorVariants(v);
                    }} placeholder="Stock" className="w-16 h-8 px-2 bg-slate-50 border-none rounded-md text-xs font-bold text-black outline-none" />
                    <button type="button" onClick={() => setColorVariants(colorVariants.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500 p-1 transition-colors"><X size={14} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setColorVariants([...colorVariants, { name: '', hexCode: '#000000', stock: '0' }])} className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:opacity-80 transition-all ml-1">
                   Add Variant
                </button>
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" name="isMultipleSize" checked={form.isMultipleSize} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
              <span className="text-[11px] font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <Maximize2 size={14} className="text-slate-400 group-hover:text-primary transition-colors" /> Multiple Sizes
              </span>
            </label>

            {form.isMultipleSize && (
              <div className="space-y-2">
                {sizeVariants.map((size, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <input type="text" value={size.name} onChange={e => {
                      const v = [...sizeVariants]; v[idx].name = e.target.value; setSizeVariants(v);
                    }} placeholder="Size" className="flex-1 h-8 px-2 bg-slate-50 border-none rounded-md text-xs font-bold text-black outline-none" />
                    <input type="number" value={size.stock} onChange={e => {
                      const v = [...sizeVariants]; v[idx].stock = e.target.value; setSizeVariants(v);
                    }} placeholder="Stock" className="w-20 h-8 px-2 bg-slate-50 border-none rounded-md text-xs font-bold text-black outline-none" />
                    <button type="button" onClick={() => setSizeVariants(sizeVariants.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500 p-1 transition-colors"><X size={14} /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setSizeVariants([...sizeVariants, { name: '', stock: '0' }])} className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 hover:opacity-80 transition-all ml-1">
                   Add Variant
                </button>
              </div>
            )}
          </div>
        </div>

        {!form.isMultipleColor && !form.isMultipleSize && (
          <div className="pt-4 max-w-xs space-y-1 border-t border-slate-200/50">
            <label className={labelClass}>Total Stock Quantity</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-black" />
          </div>
        )}
      </div>

      {/* Images */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold text-black uppercase tracking-wider ml-1 flex items-center gap-2">
          <ImageIcon size={14} className="text-slate-400" /> Product Images (Max 10)
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
          <AnimatePresence>
            {existingImages.map((url, i) => (
              <motion.div key={`ex-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                <Image src={url} alt="Product" fill className="object-cover" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-slate-900/80 text-white rounded-md flex items-center justify-center backdrop-blur-sm hover:bg-rose-50 transition-colors"><X size={10} /></button>
              </motion.div>
            ))}
            {previews.map((url, i) => (
              <motion.div key={`pre-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-square rounded-lg overflow-hidden border border-dashed border-primary/40 bg-slate-50">
                <Image src={url} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => removeSelectedFile(i)} className="absolute top-1 right-1 w-5 h-5 bg-slate-900/80 text-white rounded-md flex items-center justify-center backdrop-blur-sm hover:bg-rose-50 transition-colors"><X size={10} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {(existingImages.length + selectedFiles.length) < 10 && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-400 hover:text-primary">
              <ImagePlus size={18} />
              <span className="text-[9px] font-bold uppercase">Add</span>
            </button>
          )}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
      </div>

      {/* Visibility Settings */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all">
          <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 rounded text-primary focus:ring-primary" />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-black uppercase tracking-wide">Featured</p>
            <p className="text-[9px] text-slate-400 font-medium">Show on Home Page</p>
          </div>
          <Zap size={14} className={form.isFeatured ? 'text-primary' : 'text-slate-300'} />
        </label>
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 transition-all">
          <input type="checkbox" name="isDiscounted" checked={form.isDiscounted} onChange={handleChange} className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500" />
          <div className="flex-1">
            <p className="text-[11px] font-bold text-black uppercase tracking-wide">On Sale</p>
            <p className="text-[9px] text-slate-400 font-medium">Flash Deal Product</p>
          </div>
          <TagIcon size={14} className={form.isDiscounted ? 'text-rose-500' : 'text-slate-300'} />
        </label>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-white flex items-center gap-3 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="px-6 h-11 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
          {isNew ? 'Create Product' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
