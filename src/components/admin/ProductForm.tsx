'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ImagePlus,
  X,
  UploadCloud,
  ImageIcon,
  Zap,
  Tag,
  Layers,
  DollarSign,
  Box,
  Layout,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
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

export default function ProductFormPage({ isNew = false }: { isNew?: boolean }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<FormData>(empty);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [subBrands, setSubBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [colorVariants, setColorVariants] = useState<{name: string, hexCode: string, stock: string}[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data));
    api.get('/brands').then(r => setBrands(r.data));
    api.get('/brands/sub-brands').then(r => setSubBrands(r.data));
    if (!isNew && id) {
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
      }).catch(() => router.push('/admin/products')).finally(() => setLoading(false));
    }
  }, [id, isNew]);

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
      toast.error('Maximum 10 images allowed per product');
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
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-24 text-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Product Details...</p>
    </div>
  );

  return (
    <div className="max-w-6xl space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Link href="/admin/products" className="text-slate-400 hover:text-slate-950 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Product Management</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">
            {isNew ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="h-14 px-8 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="h-14 px-10 flex items-center gap-3 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-premium"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
            {isNew ? 'Save Product' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">
        {/* Form Body */}
        <div className="lg:col-span-8 space-y-12">
          {/* Section 1: Basic Information */}
          <section className="bg-slate-50 rounded-[3rem] border border-slate-100 p-10 space-y-10 shadow-inner shadow-slate-200/20">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200/60">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 shadow-sm border border-slate-100">
                <Layout size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950 tracking-tight">Basic Information</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General product details</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Samsung Galaxy S24" className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all placeholder:text-slate-300" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">URL Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange} required placeholder="samsung-galaxy-s24" className="w-full h-16 px-6 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-400 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Category</label>
                  <div className="relative">
                    <select name="category" value={form.category} onChange={handleChange} required className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <Layers size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Brand</label>
                  <div className="relative">
                    <select name="brand" value={form.brand} onChange={handleChange} className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all appearance-none cursor-pointer">
                      <option value="">Select Brand</option>
                      {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                    <Tag size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Product Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={6} placeholder="Describe the product features..." className="w-full p-6 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium text-slate-600 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all resize-none leading-relaxed placeholder:text-slate-300" />
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Stock */}
          <section className="bg-slate-50 rounded-[3rem] border border-slate-100 p-10 space-y-10 shadow-inner shadow-slate-200/20">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200/60">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 shadow-sm border border-slate-100">
                <DollarSign size={22} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950 tracking-tight">Pricing & Stock</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage pricing and inventory</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Regular Price (৳)</label>
                <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required placeholder="0" className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Discount Price (৳)</label>
                <input name="discountPrice" type="number" min="0" value={form.discountPrice} onChange={handleChange} placeholder="Optional" className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-indigo-600 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 space-y-6">
              <label className="flex items-center gap-4 cursor-pointer group w-max">
                <div className="relative">
                  <input type="checkbox" name="hasColors" checked={form.hasColors} onChange={handleChange} className="peer hidden" />
                  <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-indigo-600 transition-all duration-300" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Multiple Color Variants</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Track stock separately per color</p>
                </div>
              </label>

              {!form.hasColors ? (
                <div className="space-y-3 max-w-sm">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-1">Total Stock Quantity</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required placeholder="0" className="w-full h-16 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" />
                </div>
              ) : (
                <div className="space-y-4">
                  {colorVariants.map((color, idx) => (
                    <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl">
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black text-slate-950 uppercase tracking-widest px-1">Color Name</label>
                        <input type="text" value={color.name} onChange={e => {
                          const newV = [...colorVariants];
                          newV[idx].name = e.target.value;
                          setColorVariants(newV);
                        }} placeholder="e.g. Midnight Blue" required className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:outline-none" />
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-[9px] font-black text-slate-950 uppercase tracking-widest px-1">Hex Code</label>
                        <div className="flex items-center gap-2 h-12 px-2 bg-slate-50 border border-slate-200 rounded-xl">
                          <input type="color" value={color.hexCode} onChange={e => {
                            const newV = [...colorVariants];
                            newV[idx].hexCode = e.target.value;
                            setColorVariants(newV);
                          }} className="w-8 h-8 rounded cursor-pointer" />
                          <input type="text" value={color.hexCode} readOnly className="w-16 bg-transparent text-xs font-bold text-slate-600 outline-none" />
                        </div>
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-[9px] font-black text-slate-950 uppercase tracking-widest px-1">Stock</label>
                        <input type="number" min="0" value={color.stock} onChange={e => {
                          const newV = [...colorVariants];
                          newV[idx].stock = e.target.value;
                          setColorVariants(newV);
                        }} required placeholder="0" className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:outline-none" />
                      </div>
                      <button type="button" onClick={() => setColorVariants(colorVariants.filter((_, i) => i !== idx))} className="mt-6 w-10 h-10 flex items-center justify-center text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-colors shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setColorVariants([...colorVariants, { name: '', hexCode: '#000000', stock: '0' }])} className="h-12 px-6 flex items-center gap-2 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors">
                    <Box size={14} /> Add Color Variant
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-10">
          {/* Images */}
          <section className="bg-slate-50 rounded-[3rem] border border-slate-100 p-8 space-y-8 shadow-inner shadow-slate-200/20">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-6">
              <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">Product Images</h2>
              <span className="text-[10px] font-black text-slate-400 uppercase">Max 10</span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {existingImages.map((url, i) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={`existing-${i}`}
                      className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm"
                    >
                      <Image src={url} alt="Product" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeExistingImage(i)} className="w-10 h-10 bg-white text-rose-600 rounded-xl flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {previews.map((url, i) => (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={`preview-${i}`}
                      className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-indigo-50 border-2 border-dashed border-indigo-200"
                    >
                      <Image src={url} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={() => removeSelectedFile(i)} className="w-10 h-10 bg-white text-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {(existingImages.length + selectedFiles.length) < 10 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-white transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-mesh-gradient opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-all group-hover:scale-110">
                    <ImagePlus size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Upload Images</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">JPG, WEBP, PNG (Max 10MB)</p>
                  </div>
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
            </div>

            <div className="flex items-start gap-3 p-5 bg-indigo-600 rounded-3xl text-white">
              <UploadCloud size={18} className="shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                Images are optimized for high quality and fast loading to improve your customer experience.
              </p>
            </div>
          </section>

          {/* Promotion Settings */}
          <section className="bg-slate-50 rounded-[3rem] border border-slate-100 p-8 space-y-8 shadow-inner shadow-slate-200/20">
            <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest border-b border-slate-200/60 pb-6">Visibility & Promotion</h2>
            <div className="space-y-6">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="peer hidden" />
                  <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-indigo-600 transition-all duration-300" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Featured Product</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Show on homepage</p>
                </div>
                <Zap size={14} className="text-slate-200 peer-checked:text-indigo-600 transition-colors" />
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" name="isDiscounted" checked={form.isDiscounted} onChange={handleChange} className="peer hidden" />
                  <div className="w-12 h-6 bg-slate-200 rounded-full peer-checked:bg-rose-500 transition-all duration-300" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">On Sale</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Use discounted price</p>
                </div>
                <AlertCircle size={14} className="text-slate-200 peer-checked:text-rose-500 transition-colors" />
              </label>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={saving}
              className="h-20 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-premium flex items-center justify-center gap-3"
            >
              {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={20} />}
              {isNew ? 'Add Product' : 'Save Changes'}
            </button>
            <Link href="/admin/products" className="h-16 flex items-center justify-center bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest border border-slate-100 rounded-[2rem] hover:bg-white hover:text-rose-600 transition-all">
              Discard Changes
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
