'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  PackageOpen, 
  Zap,
  Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await api.get('/products', { params: search ? { search } : {} });
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleCreate = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Products</h1>
           <p className="text-slate-400 text-[13px] font-medium mt-1">
             Manage your inventory and product listings.
           </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 h-12 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-medium focus:bg-white focus:border-slate-200 transition-all outline-none"
              />
           </div>
           
           <button 
             onClick={handleCreate}
             className="h-12 flex items-center justify-center gap-2 bg-slate-950 text-white font-bold text-[13px] px-6 rounded-xl hover:bg-indigo-600 transition-all"
           >
             <Plus size={16} /> New Product
           </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
             <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-20 text-center">
            <PackageOpen size={40} className="text-slate-100 mx-auto mb-4" />
            <p className="text-slate-950 font-bold text-lg mb-1">No products found</p>
            <p className="text-slate-400 text-[13px] mb-6">Start by adding your first product.</p>
            <button onClick={handleCreate} className="h-11 px-6 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold hover:bg-slate-950 hover:text-white transition-all">Add Product</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Category</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Stock</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p) => (
                  <tr key={p._id} className="group hover:bg-slate-50/30 transition-all">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                               <PackageOpen size={14} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-950 truncate">{p.name}</p>
                          <div className="flex gap-1.5 mt-0.5">
                            {p.isFeatured && <Zap size={10} className="text-amber-500" fill="currentColor" />}
                            {p.isDiscounted && <Tag size={10} className="text-rose-500" fill="currentColor" />}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 hidden md:table-cell">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{p.category?.name || '---'}</span>
                    </td>
                    <td className="px-8 py-4 text-[13px] font-bold text-slate-950">৳{p.price?.toLocaleString()}</td>
                    <td className="px-8 py-4 hidden sm:table-cell">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                        ${p.stock === 0 ? 'text-rose-500' : p.stock <= 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        {p.stock === 0 ? 'Out' : `${p.stock} Stock`}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleEdit(p._id)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-950 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} 
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={14} />
                        </button>
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
        title={editingId ? 'Edit Product' : 'New Product'}
        maxWidth="max-w-4xl"
      >
        <ProductForm 
          id={editingId} 
          onSuccess={() => { setIsModalOpen(false); fetchProducts(); }} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
