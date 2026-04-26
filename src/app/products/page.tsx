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
    api.get('/categories').then(r => setCategories(r.data));
  }, []);

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
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 pt-24 pb-0">
        <div className="flex flex-wrap items-center gap-3 mb-4 relative z-40 border-b border-slate-100 pb-4">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setSelectedBrand(''); }}
              className="appearance-none bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider pl-4 pr-8 py-3 rounded-xl cursor-pointer hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Brand Dropdown (appears when category selected & has brands) */}
          {selectedCategory && brands.length > 0 && (
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="appearance-none bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-wider pl-4 pr-8 py-3 rounded-xl cursor-pointer hover:bg-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          )}

          {/* Filter Button (price/sort) */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              showFilters ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Filter size={16} />
            {showFilters ? 'Close' : 'Filters'}
          </button>

          {/* Search */}
          <div className="relative flex-1 min-w-[140px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all shadow-inner"
            />
          </div>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:block shrink-0">
            {products.length} Results
          </p>

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
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price Range</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={e => setMinPrice(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={e => setMaxPrice(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sorting */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sort By</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { val: '', label: 'Newest Releases' },
                        { val: 'price_asc', label: 'Price: Lowest First' },
                        { val: 'price_desc', label: 'Price: Highest First' }
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
                    <X size={14} /> Reset
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
                <h2 className="text-xl font-black text-slate-950 tracking-tighter">Filters & Sort</h2>
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
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price Range</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-8 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl pl-8 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sort By</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { val: '', label: 'Newest Releases' },
                      { val: 'price_asc', label: 'Price: Lowest First' },
                      { val: 'price_desc', label: 'Price: Highest First' }
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
                  Reset
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                >
                  Apply Filters
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
                 <h3 className="text-2xl font-black text-slate-950 mb-3 tracking-tight">No products match your criteria</h3>
                 <p className="text-slate-500 font-medium max-w-sm mx-auto">Try broadening your search or adjusting the price boundaries.</p>
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
