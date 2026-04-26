'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { 
  ArrowRight, 
  ShoppingBag, 
  Shirt, 
  Coffee, 
  Gamepad,
  Sparkles,
  ChevronRight,
  MoveDown,
  Zap,
  ShieldCheck,
  Star,
  Package,
  Flame,
  BadgePercent,
  Tag,
  Search
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
  category?: { name: string };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const TRUST_ITEMS = [
  { icon: Zap, label: 'দ্রুত ডেলিভারি', desc: '২৪–৪৮ ঘণ্টার মধ্যে' },
  { icon: ShieldCheck, label: 'নিরাপদ পেমেন্ট', desc: '১০০% সুরক্ষিত' },
  { icon: Package, label: 'সহজ রিটার্ন', desc: '১৪ দিনের পলিসি' },
  { icon: Star, label: 'সেরা মান', desc: 'বাছাইকৃত পণ্য' },
];

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('food') || n.includes('grocery')) return Coffee;
  if (n.includes('fashion') || n.includes('cloth')) return Shirt;
  if (n.includes('tech') || n.includes('electro')) return Gamepad;
  return Sparkles;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const saleProducts = products.filter(p => p.isDiscounted).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  const searchSuggestions = products
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5);



  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-hind">ক্যাটালগ লোড হচ্ছে</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen selection:bg-indigo-600 selection:text-white">
      {/* ── SEARCH BAR ─────────────────────────────────────────── */}
      <div className="pt-20 px-6 container mx-auto relative z-40 max-w-xl">
        <div className="relative group">
          <input
            type="text"
            placeholder="সেরা পণ্যগুলি খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full bg-slate-50/50 backdrop-blur-sm border border-slate-200 rounded-2xl py-2.5 px-11 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/50 focus:bg-white transition-all shadow-sm group-hover:border-slate-300"
          />
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          
          <AnimatePresence>
            {isSearchFocused && searchQuery.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[50vh] overflow-y-auto ring-1 ring-black/5"
              >
                {searchSuggestions.length > 0 ? (
                  <div className="p-2 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ক্যাটালগে পাওয়া গেছে</p>
                    </div>
                    {searchSuggestions.map(product => (
                      <Link 
                        key={product._id} 
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all hover:translate-x-1 group/item"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 group-hover/item:border-indigo-200 transition-colors">
                          <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-slate-900 truncate group-hover/item:text-indigo-600 transition-colors">{product.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.discountPrice ? (
                              <>
                                <span className="text-[10px] font-black text-slate-950">৳{product.discountPrice.toLocaleString()}</span>
                                <span className="text-[9px] text-slate-400 line-through">৳{product.price.toLocaleString()}</span>
                              </>
                            ) : (
                              <span className="text-[10px] font-black text-slate-950">৳{product.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={12} className="text-slate-300 group-hover/item:text-indigo-600 transition-colors" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-slate-300" />
                    </div>
                    <p className="text-xs font-bold text-slate-500">"{searchQuery}" এর জন্য কিছু পাওয়া যায়নি</p>
                    <p className="text-[10px] text-slate-400 mt-1">ক্যাটাগরি বা ট্যাগ দিয়ে পুনরায় চেষ্টা করুন</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative lg:h-[320px] flex items-start pt-[20px] overflow-hidden bg-white">
        {/* Refined Mesh Gradient */}
        <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-indigo-50/20 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Copy */}
            <div className="lg:col-span-6 space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-950 text-white rounded-lg shadow-xl shadow-slate-200"
              >
                <Sparkles size={10} className="text-indigo-400" />
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">১০০% জেনুইন পণ্য</span>
              </motion.div>

              <div className="space-y-3">
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[clamp(2rem,5vw,3.5rem)] font-black text-slate-950 tracking-tighter leading-[0.9]"
                >
                  সবচেয়ে বড়<br />
                  <span className="text-indigo-600">মেগা সেল।</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs text-slate-500 font-medium max-w-sm leading-relaxed"
                >
                  ইলেকট্রনিক্স, ফ্যাশন এবং নিত্যপ্রয়োজনীয় পণ্যের সেরা ডিল পান দেশজুড়ে দ্রুততম ডেলিভারির সাথে।
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-5"
              >
                <Link href="/products" className="group flex items-center gap-3 bg-indigo-600 text-white px-7 py-3.5 rounded-xl font-black text-[10px] transition-all hover:bg-slate-950 shadow-lg shadow-indigo-100">
                  এখনই কিনুন
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/#featured" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                  সেরা অফার →
                </Link>
              </motion.div>
            </div>

            {/* Visual column - Minimalist */}
            <div className="lg:col-span-6 relative hidden lg:flex items-center justify-end gap-5 h-[340px]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-64 h-72 bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden shadow-premium-subtle group relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  alt="Premium Product"
                />
                <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-100">
                  <p className="text-slate-950 font-black text-[8px] uppercase tracking-widest">মেগা ডিল</p>
                </div>
              </motion.div>

              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="w-40 h-32 bg-slate-950 rounded-[1.5rem] p-5 flex flex-col justify-between shadow-xl shadow-slate-200"
                >
                  <Zap size={18} className="text-indigo-400" />
                  <div>
                    <p className="text-white font-black text-[10px] leading-tight">দ্রুত<br />ডেলিভারি</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-40 h-32 bg-indigo-50 rounded-[1.5rem] p-5 flex flex-col justify-between border border-indigo-100 shadow-sm"
                >
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <div>
                    <p className="text-indigo-900 font-black text-[10px] leading-tight">১০০%<br />জেনুইন</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section id="featured" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm text-amber-400 border border-slate-100">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">বাছাইকৃত</p>
                <h2 className="text-xl font-black text-slate-950 tracking-tight uppercase">সেরা কালেকশন</h2>
              </div>
            </div>
            <Link href="/products" className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
              সব দেখুন <ChevronRight size={14} />
            </Link>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── DEPARTMENTS ───────────────────────────────────── */}
      <section className="py-16 bg-slate-50 rounded-[3rem] mx-4 md:mx-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">পছন্দমতো কিনুন</p>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">আমাদের ক্যাটাগরি।</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors whitespace-nowrap">
              সব দেখুন
              <div className="w-8 h-8 border border-slate-200 rounded-full flex items-center justify-center group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowRight size={14} />
              </div>
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((cat, i) => {
                return (
                  <Link 
                    href={`/products?category=${cat.slug}`} 
                    key={cat._id}
                    className="group relative h-48 md:h-64 bg-white rounded-[2rem] p-6 flex flex-col justify-end hover:border-indigo-100 border border-transparent shadow-sm hover:shadow-premium transition-all duration-700 overflow-hidden"
                  >
                    {cat.image && (
                      <div className="absolute inset-0 z-0">
                         <img 
                           src={cat.image} 
                           alt={cat.name} 
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">ক্যাটাগরি</p>
                      <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-none">{cat.name}</h3>
                      <div className="flex items-center gap-2 mt-3 overflow-hidden">
                         <div className="h-[2px] w-0 group-hover:w-8 bg-indigo-500 transition-all duration-500" />
                         <span className="text-[9px] font-black text-white/0 group-hover:text-white uppercase tracking-widest transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">এখনই কিনুন</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Electronics', 'Fashion', 'Home', 'Beauty'].map((name, i) => (
                <Link key={name} href="/products" className="group h-40 bg-white rounded-[2rem] p-6 flex flex-col justify-between shadow-sm">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-950">{name}</h3>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">এক্সপ্লোর করুন →</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FLASH SALE / DISCOUNTED ──────────────────────── */}
      {saleProducts.length > 0 && (
        <section id="sale" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="relative bg-slate-950 rounded-[4rem] overflow-hidden">
              {/* Background glow */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 p-10 md:p-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-full">
                        <Flame size={14} className="text-rose-400 animate-pulse" />
                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">চলমান সেল</span>
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                      ফ্ল্যাশ<br />
                      <span className="text-rose-400">ডিল।</span>
                    </h2>
                  </div>
                  <Link href="/products" className="flex items-center gap-3 text-white/60 font-black text-xs uppercase tracking-widest hover:text-white transition-colors shrink-0">
                    সব দেখুন <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {saleProducts.map(product => (
                    <Link key={product._id} href={`/products/${product.slug}`} className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-[2.5rem] p-5 transition-all">
                      <div className="aspect-square rounded-[2rem] overflow-hidden bg-white/5 mb-5 relative">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/300'} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {product.discountPrice && (
                          <div className="absolute top-3 left-3 bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full">
                            -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                          </div>
                        )}
                      </div>
                      <h3 className="text-white font-black text-sm leading-tight tracking-tight line-clamp-2 mb-3">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-black text-lg tracking-tighter">৳{product.discountPrice?.toLocaleString()}</p>
                          <p className="text-white/30 text-[10px] font-bold line-through">৳{product.price.toLocaleString()}</p>
                        </div>
                        <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-all">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── NEW ARRIVALS ──────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-white border-t border-slate-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-14">
              <div>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">নতুন কালেকশন</p>
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter">নতুন পণ্য।</h2>
              </div>
              <Link href="/products" className="hidden md:flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                সব দেখুন <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER CTA ────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-[4rem] border border-slate-100 p-12 md:p-20 text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-50 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
                <Sparkles size={13} className="text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">আর্লি এক্সেস প্রোগ্রাম</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6 leading-none">
                আমাদের সাথে<br />
                <span className="text-indigo-600">যুক্ত হোন।</span>
              </h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                লিমিটেড ড্রপ, মেম্বার-অনলি ডিসকাউন্ট এবং নতুন পণ্য সবার আগে দেখতে আমাদের নিউজলেটারে যোগ দিন।
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল" 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <button className="bg-slate-950 text-white px-10 py-5 rounded-[2rem] font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 whitespace-nowrap">
                  যুক্ত হোন
                </button>
              </div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-6">যোগদানের পর প্রথম অর্ডারে ১৫% ছাড়</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
