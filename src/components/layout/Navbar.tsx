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

export default function Navbar() {
  const { settings } = useSettingsStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Main Header */}
      <div className={`transition-all duration-500 ${isScrolled ? 'bg-white/90 backdrop-blur-xl py-1.5 shadow-premium border-b border-gold-400/20' : 'bg-white py-2.5 border-b border-gold-400/10'}`}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo & Company Name */}
            <Link href="/" className="flex items-center shrink-0 group">
              <BrandLogo size="md" className="group-hover:scale-105 transition-transform duration-500" />
            </Link>

            {/* Search Bar - Desktop Only */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative group">
              <input 
                type="text" 
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gold-50 border border-gold-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-bold text-black placeholder:text-gold-400/40 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:bg-white transition-all shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-400/60 group-focus-within:text-primary transition-colors" size={20} />
            </form>

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

      {/* Categories Bar - Desktop Only */}
      <nav className={`bg-white/80 backdrop-blur-xl text-black transition-all duration-700 overflow-hidden hidden lg:block border-b border-gold-400/10 ${isScrolled ? 'h-0 opacity-0' : 'h-14 opacity-100'}`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-center gap-8 md:gap-10">
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
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-900 hover:text-primary transition-all duration-300 relative group flex items-center gap-2.5 py-1"
              >
                <div className="p-1.5 rounded-lg bg-gold-50 group-hover:bg-primary transition-all duration-500 border border-gold-200">
                  <Icon size={14} className="text-gold-600 group-hover:text-white transition-colors" />
                </div>
                {cat.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full rounded-full opacity-0 group-hover:opacity-100" />
              </Link>
            );
          })}
          <Link href="/products" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-gold-900 transition-all duration-300 group">
            <div className="p-1.5 rounded-lg bg-gold-50 group-hover:bg-primary transition-all duration-500 border border-primary/20">
              <MoreHorizontal size={14} className="text-primary group-hover:text-white transition-all duration-500 group-hover:rotate-90" />
            </div>
            সব দেখুন
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
              <form onSubmit={handleSearch} className="relative group">
                <input 
                  type="text" 
                  placeholder="পণ্য খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gold-50 border border-gold-200 rounded-[2.5rem] py-5 pl-14 text-sm font-black text-black placeholder:text-gold-400/40 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-400" size={20} />
              </form>

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
