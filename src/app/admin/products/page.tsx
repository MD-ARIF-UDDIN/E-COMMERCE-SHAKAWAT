'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  Tag, 
  Search, 
  PackageOpen, 
  Filter, 
  Download,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get('/products', { params: search ? { search } : {} });
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={14} className="text-indigo-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Products</p>
           </div>
           <h1 className="text-4xl lg:text-5xl font-black text-slate-950 tracking-tighter">All Products</h1>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
             Total Products: <span className="text-slate-950">{products.length}</span>
           </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64 pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:bg-white focus:shadow-premium focus:outline-none transition-all"
              />
              <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
           </div>
           
           <Link href="/admin/products/new"
             className="h-14 flex items-center gap-3 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] px-8 rounded-2xl hover:bg-indigo-600 transition-all shadow-premium">
             <Plus size={16} /> Add Product
           </Link>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden shadow-inner shadow-slate-200/20">
        {loading ? (
          <div className="p-24 text-center">
             <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-24 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
               <PackageOpen size={32} className="text-slate-300" strokeWidth={1} />
            </div>
            <p className="text-slate-950 font-black text-xl tracking-tight mb-2">No Products Found</p>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Your product list is empty</p>
            <Link href="/admin/products/new" className="inline-flex h-12 items-center px-8 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">Add New Product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={p._id} 
                    className="group hover:bg-white transition-all duration-300"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-20 bg-white rounded-2xl flex-shrink-0 p-2 border border-slate-100 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-500">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                               <PackageOpen size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-950 tracking-tight group-hover:text-indigo-600 transition-colors">{p.name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{p.category?.name || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                         <span className="text-sm font-black text-slate-950 tracking-tight">৳{p.price?.toLocaleString()}</span>
                         {p.discountPrice && (
                           <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tight">৳{p.discountPrice?.toLocaleString()}</span>
                         )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                        ${p.stock === 0 ? 'bg-rose-50 text-rose-600' : p.stock <= 5 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} In Stock`}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-wrap gap-2">
                        {p.isFeatured && (
                          <span className="flex items-center gap-1.5 text-[8px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 px-2 py-1 rounded-full">
                            <Star size={10} fill="currentColor" /> Featured
                          </span>
                        )}
                        {p.isDiscounted && (
                          <span className="flex items-center gap-1.5 text-[8px] font-black text-rose-600 uppercase tracking-widest border border-rose-100 px-2 py-1 rounded-full">
                            <Tag size={10} fill="currentColor" /> On Sale
                          </span>
                        )}
                        {!p.isFeatured && !p.isDiscounted && (
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Standard</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/products/${p._id}`} 
                          className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-950 hover:shadow-sm transition-all">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => handleDelete(p._id, p.name)} 
                          className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:shadow-sm transition-all">
                          <Trash2 size={14} />
                        </button>
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
  );
}
