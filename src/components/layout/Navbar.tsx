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

export default function Navbar() {
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
    { name: 'Collections', href: '/products', icon: LayoutGrid },
    { name: 'Featured', href: '/#featured', icon: Zap },
    { name: 'Sale', href: '/#sale', icon: Tag },
  ];

  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-4 pointer-events-none">
      <nav className={`relative container mx-auto transition-all duration-700 pointer-events-auto ${isScrolled ? 'max-w-4xl' : 'max-w-6xl'}`}>
        <div className={`backdrop-blur-xl border border-white/40 rounded-full px-5 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'bg-white/90 shadow-premium py-1.5' : 'bg-white/60 shadow-sm py-2.5'}`}>
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
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center text-white group-hover:bg-indigo-600 transition-all duration-500 shadow-md">
              <ShoppingBag size={16} />
            </div>
            <span className="text-sm font-black tracking-tighter block bg-indigo-50/50 px-3 py-1 rounded-lg text-slate-950 border border-indigo-100/50 transition-colors group-hover:bg-indigo-50">
              Nova<span className="text-indigo-600">Cart</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-slate-50/50 rounded-2xl p-1 border border-slate-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon size={14} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link 
              href="/cart" 
              className="p-2 bg-slate-950 text-white hover:bg-indigo-600 rounded-lg transition-all relative group shadow-md"
            >
              <ShoppingBag size={16} />
              <AnimatePresence>
                {displayCount > 0 && (
                  <motion.span
                    key={displayCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {displayCount > 9 ? '9+' : displayCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button 
              className="md:hidden p-3 text-slate-600 hover:bg-white rounded-xl transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              className="md:hidden mt-4 glass rounded-[2.5rem] p-6 shadow-premium overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-900 font-bold transition-all group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                        <Icon size={20} />
                      </div>
                      {link.name}
                      <ChevronDown size={18} className="ml-auto -rotate-90 text-slate-300" />
                    </Link>
                  );
                })}
                <Link
                  href="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 text-white font-bold"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={20} />
                  </div>
                  Cart {displayCount > 0 && <span className="ml-auto bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-full">{displayCount}</span>}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
