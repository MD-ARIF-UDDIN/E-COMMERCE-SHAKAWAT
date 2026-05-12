'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search,
  Heart,
  Truck,
  MoreHorizontal,
  ChevronRight,
  Watch,
  Sparkles,
  Smartphone,
  Utensils,
  Wind,
  Sofa,
  ShoppingBasket,
  Home as HomeIcon,
  ChefHat,
  Cpu,
  Shirt,
  Gamepad2,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';
import BrandLogo from '@/components/ui/BrandLogo';
import { api } from '@/lib/axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const categoryIcons: Record<string, any> = {
  'Accessories': Watch,
  'Beauty': Sparkles,
  'Electronics': Smartphone,
  'Food': Utensils,
  'Fragrances': Wind,
  'Furniture': Sofa,
  'Groceries': ShoppingBasket,
  'Home Decoration': HomeIcon,
  'Kitchen Accessories': ChefHat,
  'Tech': Cpu,
  'Fashion': Shirt,
  'Gaming': Gamepad2,
  'Gifts': Gift,
  'Clothing': Shirt,
};

import { useDebounce } from '@/hooks/useDebounce';
import { useRef } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: { name: string; slug: string };
}

export default function Navbar() {
  const { settings } = useSettingsStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { items, setIsOpen } = useCartStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const displayCount = hydrated ? cartCount : 0;

  const [prevCount, setPrevCount] = useState(displayCount);

  useEffect(() => {
    if (displayCount > prevCount) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 500);
      return () => clearTimeout(timer);
    }
    setPrevCount(displayCount);
  }, [displayCount, prevCount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch categories for the nav bar
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Real-time search logic
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await api.get(`/products?search=${encodeURIComponent(debouncedSearch)}&limit=6`);
          setSearchResults(res.data);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Main Header */}
      <div className={`transition-all duration-700 ${isScrolled ? 'bg-white/95 backdrop-blur-2xl py-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b border-gold-400/20' : 'bg-white py-3 border-b border-gold-400/10'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo & Company Name */}
            <Link href="/" className="flex items-center shrink-0 group">
              <BrandLogo size="md" className="group-hover:scale-105 transition-transform duration-500" />
            </Link>

            {/* Search Bar - Desktop Only */}
            <div className="hidden md:block flex-1 max-w-xl relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative group">
                <input 
                  type="text" 
                  placeholder="আপনার পছন্দের পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                  className="w-full bg-gold-50/50 border border-gold-200/50 rounded-2xl py-3 pl-12 pr-12 text-sm font-bold text-black placeholder:text-gold-400/50 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all duration-500 shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/60 group-focus-within:text-primary transition-colors" size={20} />
                
                {isSearching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (searchResults.length > 0 || isSearching) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-premium border border-gold-100 overflow-hidden z-[60]"
                  >
                    <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
                      {searchResults.map((product) => (
                        <Link 
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={() => setShowSuggestions(false)}
                          className="flex items-center gap-3 p-2 hover:bg-gold-50 rounded-xl transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gold-100 flex-shrink-0 border border-gold-100">
                            {product.images[0] ? (
                              <Image 
                                src={product.images[0]} 
                                alt={product.name} 
                                width={48} 
                                height={48} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gold-300">
                                <ShoppingBag size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-black truncate group-hover:text-primary transition-colors">{product.name}</h4>
                            <p className="text-[10px] text-gold-400 font-medium">{product.category?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-primary">৳{product.price}</p>
                            {product.discountPrice && (
                              <p className="text-[9px] text-gold-400 line-through">৳{product.discountPrice}</p>
                            )}
                          </div>
                        </Link>
                      ))}

                      {searchResults.length === 0 && !isSearching && (
                        <div className="p-8 text-center">
                          <Search size={32} className="mx-auto text-gold-200 mb-2" />
                          <p className="text-xs text-gold-400 font-medium">কোনো পণ্য পাওয়া যায়নি</p>
                        </div>
                      )}
                    </div>

                    {searchResults.length > 0 && (
                      <button 
                        onClick={handleSearch}
                        className="w-full p-3 bg-gold-50 border-t border-gold-100 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        সব ফলাফল দেখুন <ChevronRight size={14} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2 md:gap-5">
              <Link href="/track-order" className="flex flex-col items-center text-gold-600 hover:text-primary transition-all duration-300">
                <Truck size={24} className="md:size-[30px]" strokeWidth={2} />
                <span className="hidden md:block text-[10px] font-black uppercase tracking-tighter mt-1 text-primary/60">ট্র্যাকিং</span>
              </Link>
              <Link href="/wishlist" className="flex flex-col items-center text-gold-600 hover:text-primary transition-all duration-300 px-0.5 md:px-1">
                <Heart size={24} className="md:size-[30px]" strokeWidth={2} />
                <span className="hidden md:block text-[10px] font-black uppercase tracking-tighter mt-1 text-primary/60">উইশলিস্ট</span>
              </Link>
              <button 
                onClick={() => setIsOpen(true)}
                className="relative group"
              >
                <motion.div 
                  animate={isCartBouncing ? { scale: [1, 1.4, 1], y: [0, -10, 0] } : { scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "backOut" }}
                  className="flex flex-col items-center text-gold-600 hover:text-primary transition-all duration-300 px-0.5 md:px-1"
                >
                  <ShoppingBag size={24} className="md:size-[30px]" strokeWidth={2} />
                  <span className="hidden md:block text-[10px] font-black uppercase tracking-tighter mt-1 text-primary/60">কার্ট</span>
                  {displayCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] md:text-[9px] font-black min-w-[1rem] md:min-w-[1.2rem] h-[1rem] md:h-[1.2rem] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
                      {displayCount}
                    </span>
                  )}
                </motion.div>
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1 md:p-2 text-gold-600 hover:text-primary transition-colors"
              >
                {isMobileMenuOpen ? <X size={26} className="md:size-[28px]" strokeWidth={2.5} /> : <Menu size={26} className="md:size-[28px]" strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar — visible only on small screens */}
      <div className={`md:hidden relative transition-all duration-500 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        {/* Gold gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-800 via-primary to-gold-700" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-300/40 to-transparent" />
        <div className="relative z-10 px-4 py-2" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="পণ্য খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              className="w-full bg-white/15 border border-white/25 rounded-xl py-2 pl-9 pr-9 text-[13px] font-semibold text-white placeholder:text-white/50 focus:outline-none focus:bg-white/25 focus:border-white/50 transition-all"
            />
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors"
              size={16}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </form>

          {/* Mobile Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && (searchResults.length > 0 || isSearching) && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full left-4 right-4 mt-1 bg-white rounded-xl shadow-2xl border border-gold-100 overflow-hidden z-[60]"
              >
                <div className="max-h-[300px] overflow-y-auto p-1.5 space-y-1">
                  {searchResults.map((product) => (
                    <Link 
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 p-2 hover:bg-gold-50 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 rounded bg-gold-50 flex-shrink-0 overflow-hidden border border-gold-100">
                        {product.images[0] && (
                          <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-black truncate">{product.name}</h4>
                        <p className="text-[10px] text-primary font-black">৳{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {searchResults.length > 0 && (
                  <button 
                    onClick={handleSearch}
                    className="w-full p-2.5 bg-gold-50 border-t border-gold-100 text-[9px] font-black uppercase tracking-widest text-primary text-center"
                  >
                    সব ফলাফল দেখুন
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className={`relative transition-all duration-700 overflow-hidden hidden lg:block ${isScrolled ? 'h-0 opacity-0 -translate-y-full' : 'h-16 opacity-100 translate-y-0'}`}>
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-gold-950 to-secondary" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        
        {/* Floating Glass Container Effect */}
        <div className="absolute inset-x-6 top-2 bottom-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl" />

        {/* Shimmer lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container mx-auto px-10 h-full flex items-center justify-center gap-10 relative z-10">
          {categories.map((cat) => {
            const catName = cat.name.trim();
            const Icon = categoryIcons[catName] ||
                         categoryIcons[catName.charAt(0).toUpperCase() + catName.slice(1).toLowerCase()] ||
                         categoryIcons[catName.split(' ')[0]] ||
                         MoreHorizontal;
            return (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className="relative group flex items-center gap-2 py-1 text-white/90 hover:text-white transition-all duration-300"
              >
                {/* Icon pill */}
                <div className="p-1 rounded-md bg-white/10 group-hover:bg-white/20 border border-white/20 group-hover:border-white/40 transition-all duration-300">
                  <Icon size={12} className="text-gold-200 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">{cat.name}</span>
                {/* Glowing underline */}
                <span className="absolute -bottom-[1px] left-0 w-0 h-[2px] bg-gradient-to-r from-gold-200 to-white transition-all duration-500 group-hover:w-full rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
              </Link>
            );
          })}
          <Link href="/products" className="relative group flex items-center gap-2 py-1 text-gold-200 hover:text-white transition-all duration-300">
            <div className="p-1 rounded-md bg-white/10 group-hover:bg-white/20 border border-white/20 group-hover:border-white/40 transition-all duration-300">
              <MoreHorizontal size={12} className="text-gold-200 group-hover:text-white transition-all duration-300 group-hover:rotate-90" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em]">সব দেখুন</span>
            <span className="absolute -bottom-[1px] left-0 w-0 h-[2px] bg-gradient-to-r from-gold-200 to-white transition-all duration-500 group-hover:w-full rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="p-5 flex items-center justify-between border-b border-gold-100 bg-gold-50/50 backdrop-blur-xl sticky top-0">
              <div className="flex items-center">
                 <BrandLogo size="sm" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 bg-gold-100/50 rounded-xl text-gold-600 hover:bg-gold-100 transition-colors border border-gold-200">
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {/* Search in Mobile Menu */}
              <div className="relative" ref={searchRef}>
                <form onSubmit={handleSearch} className="relative group">
                  <input 
                    type="text" 
                    placeholder="পণ্য খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                    className="w-full bg-gold-50 border border-gold-200 rounded-[2.5rem] py-5 pl-14 text-sm font-black text-black placeholder:text-gold-400/40 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-400" size={20} />
                  {isSearching && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </form>

                {/* Mobile Menu Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (searchResults.length > 0 || isSearching) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-premium border border-gold-100 overflow-hidden z-[60]"
                    >
                      <div className="max-h-[350px] overflow-y-auto p-4 space-y-3">
                        {searchResults.map((product) => (
                          <Link 
                            key={product.id}
                            href={`/products/${product.slug}`}
                            onClick={() => { setIsMobileMenuOpen(false); setShowSuggestions(false); }}
                            className="flex items-center gap-4 p-2 hover:bg-gold-50 rounded-2xl transition-colors"
                          >
                            <div className="w-16 h-16 rounded-xl bg-gold-50 flex-shrink-0 overflow-hidden border border-gold-100">
                              {product.images[0] && (
                                <Image src={product.images[0]} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-black truncate">{product.name}</h4>
                              <p className="text-xs text-primary font-black mt-1">৳{product.price}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <p className="text-[11px] font-black text-gold-400 uppercase tracking-[0.3em]">ক্যাটাগরি সমূহ</p>
                   <Link href="/products" className="text-[10px] font-black text-primary uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>সব দেখুন</Link>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((cat) => (
                    <Link 
                      key={cat._id} 
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-6 bg-gold-50 border border-gold-100 hover:border-primary/40 rounded-[2rem] font-black text-xs text-gold-900 group transition-all duration-300 shadow-sm"
                    >
                      <span className="group-hover:translate-x-2 transition-transform duration-300 uppercase tracking-widest">{cat.name}</span>
                      <ChevronRight size={18} className="text-gold-200 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link href="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-4 p-8 bg-gold-50 border border-gold-100 rounded-[2.5rem] text-gold-600 hover:bg-gold-100 transition-colors group shadow-sm">
                  <Truck size={32} className="text-primary group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">ট্র্যাকিং</span>
                </Link>
                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center justify-center gap-4 p-8 bg-gold-50 border border-gold-100 rounded-[2.5rem] text-gold-600 hover:bg-gold-100 transition-colors group shadow-sm">
                  <Heart size={32} className="text-primary group-hover:scale-110 transition-transform" strokeWidth={2} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">উইশলিস্ট</span>
                </Link>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gold-100">
              <button 
                onClick={() => { setIsOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full bg-primary text-white flex items-center justify-center gap-4 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all"
              >
                <ShoppingBag size={22} strokeWidth={2.5} />
                কার্ট দেখুন ({displayCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
