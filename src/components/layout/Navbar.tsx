'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search,
  ChevronDown,
  LayoutGrid,
  Zap,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { useSettingsStore } from '@/store/settingsStore';
import DynamicLogo from '@/components/ui/DynamicLogo';

export default function Navbar() {
  const businessName = useSettingsStore(s => s.settings.businessName);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const displayCount = hydrated ? cartCount : 0;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'কালেকশন', href: '/products', icon: LayoutGrid },
    { name: 'সেরা পণ্য', href: '/#featured', icon: Zap },
    { name: 'অফার', href: '/#sale', icon: Tag },
  ];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className={`relative container mx-auto transition-all duration-700 pointer-events-auto ${isScrolled ? 'max-w-4xl' : 'max-w-6xl'}`}>
        <div className={`backdrop-blur-2xl border border-white/10 rounded-[2rem] px-5 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'bg-slate-950/95 shadow-premium py-2' : 'bg-slate-950/80 shadow-sm py-3'}`}>
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-500 transition-all duration-500 shadow-lg shadow-white/5 border border-white/10">
              <ShoppingBag size={18} />
            </div>
            <div className="hidden sm:block">
              <DynamicLogo className="text-sm font-black tracking-tighter block bg-white/5 px-3 py-1.5 rounded-lg text-white border border-white/10 transition-colors group-hover:bg-white/10" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-white/5 rounded-2xl p-1 border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                    isActive ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-indigo-400'} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link 
              href="/cart" 
              className="w-10 h-10 flex items-center justify-center bg-white/10 text-white hover:bg-indigo-500 rounded-xl transition-all relative group shadow-lg border border-white/10"
            >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {displayCount > 0 && (
                  <motion.span
                    key={displayCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 shadow-xl"
                  >
                    {displayCount > 9 ? '9+' : displayCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-xl hover:bg-white/10 transition-all border border-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="md:hidden mt-4 bg-slate-950/95 backdrop-blur-2xl rounded-[2.5rem] p-6 shadow-premium border border-white/10 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] transition-all group border border-white/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:text-white shadow-sm transition-colors">
                        <Icon size={20} />
                      </div>
                      {link.name}
                      <ChevronDown size={18} className="ml-auto -rotate-90 text-slate-700" />
                    </Link>
                  );
                })}
                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  কার্ট {displayCount > 0 && <span className="ml-auto bg-white text-indigo-600 text-[10px] font-black px-2 py-1 rounded-full">{displayCount}</span>}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
