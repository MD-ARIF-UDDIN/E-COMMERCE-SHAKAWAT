'use client';
import { useCartStore } from '@/store/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Trash2, ShoppingBag, ArrowRight, Package, Plus, Minus, ShieldCheck, Zap, RotateCcw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const items          = useCartStore(s => s.items);
  const removeItem     = useCartStore(s => s.removeItem);
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const getTotal       = useCartStore(s => s.getTotal);
  const hydrated       = useHydrated();

  if (!hydrated) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-900/10 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-black min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-6">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-black-800 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-gold-900/10"
        >
          <ShoppingBag size={32} className="text-gold-900/20" />
        </motion.div>
        <h2 className="text-2xl font-black text-gold-100 mb-2 tracking-tight">আপনার কার্ট খালি</h2>
        <p className="text-xs text-gold-900/40 mb-8 max-w-[200px] text-center leading-relaxed">মনে হচ্ছে আপনি এখনও কোনো পণ্য নির্বাচন করেননি</p>
        <Link
          href="/products"
          className="bg-primary hover:bg-gold-600 text-black font-black text-xs px-10 py-4 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20 uppercase tracking-widest"
        >
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-black min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/products" className="w-11 h-11 bg-black-800 rounded-xl flex items-center justify-center text-gold-900/40 hover:text-primary transition-all shadow-sm border border-gold-900/10">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-gold-100 tracking-tighter">শপিং কার্ট।</h1>
              <p className="text-[10px] font-black text-gold-900/40 uppercase tracking-widest mt-1">{totalItems} টি পণ্য নির্বাচন করেছেন</p>
            </div>
          </div>
          <Link href="/products" className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-gold-400 transition-colors uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
            আরও পণ্য দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={item.cartItemId || i}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="bg-black-900/50 backdrop-blur-sm rounded-2xl p-5 flex gap-5 border border-gold-900/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-black-800 rounded-xl overflow-hidden shrink-0 border border-gold-900/10">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={24} className="text-gold-900/20" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-gold-100 text-sm sm:text-base leading-tight truncate group-hover:text-primary transition-colors">{item.name}</h3>
                        <button
                          onClick={() => { removeItem(item.cartItemId); toast.success('পণ্য সরানো হয়েছে'); }}
                          className="w-8 h-8 rounded-lg bg-black-800 text-gold-900/40 hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        {item.colorName && (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black-800 rounded-md border border-gold-900/10">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.colorHex || '#ccc' }}></span>
                            <span className="text-[9px] font-black text-gold-900/40 uppercase tracking-widest">{item.colorName}</span>
                          </div>
                        )}
                        <span className="text-[10px] font-bold text-gold-900/20">৳{item.price.toLocaleString()} / একি</span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 bg-black-800 border border-gold-900/10 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-gold-900/40 hover:text-primary hover:bg-black-900 rounded-lg transition-all shadow-sm"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center font-black text-sm text-gold-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gold-900/40 hover:text-primary hover:bg-black-900 rounded-lg transition-all shadow-sm"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-gold-900/20 uppercase tracking-widest mb-1">সাবটোটাল</p>
                        <span className="font-black text-primary text-lg sm:text-xl tracking-tighter">৳{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-black-900 rounded-[2.5rem] p-8 sm:p-10 sticky top-28 border border-gold-900/10 shadow-premium-subtle overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
              
              <h2 className="text-[10px] font-black text-gold-900/40 uppercase tracking-[0.3em] mb-8">অর্ডার সামারি</h2>

              <div className="space-y-5 text-sm mb-10 pb-10 border-b border-gold-900/10">
                <div className="flex justify-between items-center">
                  <span className="text-gold-900/40 font-bold uppercase tracking-widest text-[10px]">সাবটোটাল</span>
                  <span className="font-black text-gold-100 tracking-tighter text-lg">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-gold-900/40 font-bold uppercase tracking-widest text-[10px]">ডেলিভারি চার্জ</span>
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em] mt-1">স্ট্যান্ডার্ড শিপিং</span>
                  </div>
                  <span className="font-black text-gold-100 tracking-tighter text-lg">৳{deliveryCharge}</span>
                </div>
                <div className="pt-6 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black text-gold-900/40 uppercase tracking-widest mb-1 block">মোট পেয়বল</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">৳{total.toLocaleString()}</span>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/20">
                    সেভ করুন ৳০
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-3 w-full h-16 bg-primary hover:bg-gold-600 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-primary/20 group"
                >
                  চেকআউট করুন
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/products" className="flex items-center justify-center gap-2 w-full h-12 text-[10px] font-black text-gold-900/40 hover:text-primary transition-colors uppercase tracking-widest">
                  কেনাকাটা চালিয়ে যান
                </Link>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 mt-12">
                {[
                  { icon: ShieldCheck, label: 'নিরাপদ পেমেন্ট' },
                  { icon: Zap, label: 'দ্রুত ডেলিভারি' },
                  { icon: RotateCcw, label: 'সহজ রিটার্ন' },
                  { icon: Package, label: 'ট্র্যাকিং' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 p-4 bg-black-800 rounded-2xl border border-gold-900/10 group/trust">
                    <div className="w-10 h-10 bg-black-900 rounded-xl flex items-center justify-center shadow-sm group-hover/trust:scale-110 transition-transform">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="text-[8px] font-black text-gold-900/40 uppercase tracking-widest text-center">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
