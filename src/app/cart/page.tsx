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
      <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-950 mb-2 tracking-tight">Your cart is empty</h2>
        <p className="text-sm text-slate-400 mb-8">Looks like you haven't added anything yet</p>
        <Link
          href="/products"
          className="bg-slate-950 hover:bg-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all flex items-center gap-2"
        >
          <ShoppingBag size={16} /> Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/products" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-slate-100">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Shopping Cart</h1>
              <p className="text-xs text-slate-400 mt-0.5">{totalItems} item{totalItems > 1 ? 's' : ''}</p>
            </div>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-3 space-y-3">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 border border-slate-100"
                >
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">{item.name}</h3>
                      {item.colorName && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: item.colorHex || '#ccc' }}></span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.colorName}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-400">৳{item.price.toLocaleString()} each</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all shadow-sm"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white rounded-md transition-all shadow-sm"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-950 text-sm">৳{(item.price * item.quantity).toLocaleString()}</span>
                        <button
                          onClick={() => { removeItem(item.cartItemId); toast('Item removed'); }}
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 flex items-center justify-center transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 sm:p-6 sticky top-28 border border-slate-100">
              <h2 className="text-sm font-bold text-slate-950 mb-5">Order Summary</h2>

              {/* Item breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b border-slate-100">
                {items.map(item => (
                  <div key={item.product} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 truncate mr-3 flex-1">{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-slate-700 shrink-0">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-semibold text-slate-700">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery</span>
                  <span className="font-semibold text-slate-700">৳{deliveryCharge}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-slate-950">Total</span>
                  <span className="text-xl font-black text-indigo-600">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full mt-6 h-12 bg-slate-950 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 mt-5">
                {[
                  { icon: ShieldCheck, label: 'Secure Payment' },
                  { icon: Zap, label: 'Fast Delivery' },
                  { icon: RotateCcw, label: 'Easy Returns' },
                  { icon: Package, label: 'Order Tracking' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-50 rounded-lg">
                    <Icon size={11} className="text-indigo-400 shrink-0" />
                    <span className="text-[9px] font-semibold text-slate-400">{label}</span>
                  </div>
                ))}
              </div>

              <Link href="/products" className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
