'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import Link from 'next/link';

export default function FloatingCart() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen } = useCartStore();
  const hydrated = useHydrated();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  
  if (!hydrated) return null;

  return (
    <>
      {/* Floating Draggable Bucket */}
      <motion.div
        drag
        dragMomentum={false}
        initial={{ x: 'calc(100vw - 100px)', y: '70vh' }}
        className="fixed z-[100] cursor-grab active:cursor-grabbing group"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_20px_50px_rgba(184,134,11,0.25)] border-2 border-white group-hover:scale-110 transition-transform">
            <ShoppingBag size={28} />
          </div>
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black min-w-[1.5rem] h-[1.5rem] px-1.5 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
            >
              {cartCount}
            </motion.span>
          )}
          {/* Label that shows on hover */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-primary text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-premium whitespace-nowrap pointer-events-none uppercase tracking-widest border border-gold-200">
             কার্ট দেখুন
          </div>
        </div>
      </motion.div>

      {/* Cart Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-[-20px_0_100px_rgba(0,0,0,0.1)] z-[1001] flex flex-col border-l border-gold-100"
            >
              <div className="p-6 flex items-center justify-between border-b border-gold-100 bg-gold-50/50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                      <ShoppingBag size={20} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-gold-900 tracking-tighter">আপনার শপিং কার্ট</h2>
                      <p className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">{cartCount} টি পণ্য যুক্ত আছে</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-gold-50 rounded-full flex items-center justify-center text-gold-400 hover:bg-primary/20 hover:text-primary transition-all border border-gold-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center text-gold-200 border border-gold-100 shadow-inner">
                        <ShoppingBag size={48} strokeWidth={1.5} />
                     </div>
                     <p className="text-gold-400 font-bold uppercase tracking-widest text-[10px]">আপনার কার্টটি এখন খালি আছে</p>
                     <button onClick={() => setIsOpen(false)} className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:underline decoration-2 underline-offset-8">কেনাকাটা শুরু করুন</button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.product} className="flex gap-4 group bg-gold-50/50 p-4 rounded-3xl border border-gold-100 hover:border-primary/30 transition-all">
                      <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 border border-gold-100 group-hover:scale-105 transition-transform shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-1">
                        <h4 className="text-sm font-black text-gold-900 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h4>
                        <p className="text-primary font-black text-xs">৳{item.price.toLocaleString()}</p>
                         <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center bg-white rounded-xl p-1 border border-gold-100">
                               <button 
                                 onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                 className="w-8 h-8 flex items-center justify-center text-gold-400 hover:text-primary transition-colors"
                               >
                                 <Minus size={14} />
                               </button>
                               <span className="w-10 text-center text-sm font-black text-gold-900">{item.quantity}</span>
                               <button 
                                 onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                 className="w-8 h-8 flex items-center justify-center text-gold-400 hover:text-primary transition-colors"
                               >
                                 <Plus size={14} />
                               </button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.product)}
                              className="w-10 h-10 flex items-center justify-center text-gold-200 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-8 bg-white border-t border-gold-100 space-y-6 shadow-premium">
                  <div className="flex items-center justify-between">
                    <span className="text-gold-400 font-black text-[10px] uppercase tracking-[0.2em]">সর্বমোট মূল্য</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">৳{totalPrice.toLocaleString()}</span>
                  </div>
                  <Link 
                    href="/checkout" 
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-primary text-white flex items-center justify-center gap-4 h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-gold-600 transition-all active:scale-95 group"
                  >
                    অর্ডার সম্পন্ন করুন <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
