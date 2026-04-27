'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import { api } from '@/lib/axios';
import { 
  SlidersHorizontal, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Filter, 
  X, 
  LayoutGrid, 
  List,
  ArrowUpDown,
  ShoppingBag,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  isFeatured: boolean;
  isDiscounted: boolean;
  category: { _id: string; name: string };
  brand?: { _id: string; name: string };
}

interface Category { _id: string; name: string; slug: string; image?: string; }
interface Brand { _id: string; name: string; slug: string; }

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (sort) params.sort = sort;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await api.get('/products', { params });
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, selectedBrand, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.get('/categories').then(r => {
      setCategories(r.data);
      const initialCat = searchParams.get('category');
      if (initialCat) {
        const found = r.data.find((c: Category) => c.slug === initialCat || c._id === initialCat);
        if (found) setSelectedCategory(found._id);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    api.get('/brands', { params: { category: selectedCategory || undefined } }).then(r => {
      setBrands(r.data);
      setSelectedBrand(prev => {
        if (prev && !r.data.find((b: Brand) => b._id === prev)) return '';
        return prev;
      });
    });
  }, [selectedCategory]);

  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    setSearch(searchVal);
    
    const catVal = searchParams.get('category') || '';
    if (catVal && categories.length > 0) {
      const found = categories.find(c => c.slug === catVal || c._id === catVal);
      if (found) setSelectedCategory(found._id);
    } else if (!catVal) {
      setSelectedCategory('');
    }
  }, [searchParams, categories]);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 pt-24 pb-0">
        <div className="flex flex-wrap items-center gap-5 mb-12 relative z-40 bg-white/70 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/50 shadow-sm">
          <div className="grid grid-cols-2 gap-3 w-full lg:flex lg:w-auto lg:items-center lg:gap-5">
            {/* Category Dropdown */}
            <div className="relative group w-full lg:w-auto">
              <label className="absolute -top-2 left-4 px-2 bg-white text-[8px] font-black text-slate-400 uppercase tracking-widest z-10">ক্যাটাগরি</label>
              <select
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setSelectedBrand(''); }}
                className="appearance-none w-full bg-slate-50/50 border border-slate-100 text-slate-950 text-[10px] font-black uppercase tracking-[0.15em] pl-6 pr-10 py-4 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-white transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm"
              >
                <option value="">সব ক্যাটাগরি</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-indigo-500 transition-colors" />
            </div>

            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 lg:px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border w-full lg:w-auto ${
                showFilters 
                ? 'bg-slate-950 text-white border-slate-950 shadow-xl shadow-slate-200' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600 shadow-sm'
              }`}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">{showFilters ? 'বন্ধ করুন' : 'ফিল্টার'}</span>
              <span className="sm:hidden">{showFilters ? 'বন্ধ' : 'ফিল্টার'}</span>
            </button>
          </div>

          {/* Brand Dropdown */}
          {selectedCategory && brands.length > 0 && (
            <div className="relative group">
              <label className="absolute -top-2 left-4 px-2 bg-white text-[8px] font-black text-slate-400 uppercase tracking-widest z-10">ব্র্যান্ড</label>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="appearance-none bg-slate-50/50 border border-slate-100 text-slate-950 text-[10px] font-black uppercase tracking-[0.15em] pl-6 pr-12 py-4 rounded-2xl cursor-pointer hover:border-indigo-200 hover:bg-white transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm"
              >
                <option value="">সব ব্র্যান্ড</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-indigo-500 transition-colors" />
            </div>
          )}

          {/* Search */}
          <div className="relative flex-1 min-w-[240px] group">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-950 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 focus:bg-white transition-all shadow-sm placeholder:text-slate-200"
            />
          </div>

          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100/50 rounded-xl border border-slate-200/50">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">
              {products.length} টি পণ্য পাওয়া গেছে
            </p>
          </div>

          {/* Desktop Filter Dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-full max-w-sm bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-6 hidden md:block z-50"
              >
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Price */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">মূল্যসীমা</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                        <input
                          type="number"
                          placeholder="সর্বনিম্ন"
                          value={minPrice}
                          onChange={e => setMinPrice(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                        <input
                          type="number"
                          placeholder="সর্বোচ্চ"
                          value={maxPrice}
                          onChange={e => setMaxPrice(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sorting */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">বাছাই করুন</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { val: '', label: 'নতুন পণ্য' },
                        { val: 'price_asc', label: 'মূল্য: কম থেকে বেশি' },
                        { val: 'price_desc', label: 'মূল্য: বেশি থেকে কম' }
                      ].map(s => (
                        <button 
                          key={s.val}
                          onClick={() => setSort(s.val)}
                          className={`text-left px-4 py-3 rounded-xl text-xs font-black transition-all ${
                            sort === s.val ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { setMinPrice(''); setMaxPrice(''); setSort(''); setShowFilters(false); }}
                    className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-100 rounded-xl text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:border-rose-100 transition-all"
                  >
                    <X size={14} /> রিসেট করুন
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-0 z-50 bg-white flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-50">
                <h2 className="text-xl font-black text-slate-950 tracking-tighter">ফিল্টার এবং বাছাই</h2>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-10">
                {/* Price Filter */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">মূল্যসীমা</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                      <input
                        type="number"
                        placeholder="সর্বনিম্ন"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-8 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                      <input
                        type="number"
                        placeholder="সর্বোচ্চ"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-8 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">বাছাই করুন</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { val: '', label: 'নতুন পণ্য' },
                      { val: 'price_asc', label: 'মূল্য: কম থেকে বেশি' },
                      { val: 'price_desc', label: 'মূল্য: বেশি থেকে কম' }
                    ].map(s => (
                      <button 
                        key={s.val}
                        onClick={() => setSort(s.val)}
                        className={`text-left px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                          sort === s.val ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-50 bg-white grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setMinPrice(''); setMaxPrice(''); setSort(''); }}
                  className="py-4 border border-slate-200 rounded-2xl text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  রিসেট
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                >
                  ফিল্টার প্রয়োগ করুন
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full pb-12 overflow-hidden">
          {/* Main Grid Area */}
          <div className="w-full relative z-10">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[1.5rem] sm:rounded-[3rem] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100">
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                   <Search size={32} className="text-slate-200" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-950 mb-3 tracking-tight">আপনার পছন্দের সাথে মিলছে না</h3>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto">অনুগ্রহ করে অন্য কোনো ক্যাটাগরি বা মূল্যসীমা দিয়ে চেষ্টা করুন।</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-6 px-1 sm:px-0">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
