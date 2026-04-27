'use client';
import { useState, useRef } from 'react';
import { ShoppingCart, Eye, Heart, Star, Sparkles, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

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

export default function ProductCard({ product }: { product: Product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem, setIsOpen } = useCartStore();
  const router = useRouter();

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setStartPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsAdding(true);
    addItem({
      product: product._id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      quantity: 1,
      image: product.images?.[0],
    });
    
    toast.success('কার্টে যোগ করা হয়েছে!');
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product: product._id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      quantity: 1,
      image: product.images?.[0],
    });
    router.push('/checkout');
  };

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-[1.5rem] p-3 sm:p-4 border border-slate-100 hover:border-indigo-100 hover:shadow-premium transition-all duration-700 relative"
    >
      {/* Thrown to Bucket Animation */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ left: startPos.x, top: startPos.y, scale: 1, opacity: 1, rotate: 0 }}
            animate={{ 
              left: '95vw', 
              top: '70vh', 
              scale: 0.1, 
              opacity: 0,
              rotate: 720
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-4 ring-indigo-500/20">
              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Glossy overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-indigo-500/5 transition-all duration-700 pointer-events-none" />

      {/* Image Container */}
      <div className="relative aspect-square rounded-[1.2rem] sm:rounded-[1.8rem] overflow-hidden bg-slate-50 mb-3 sm:mb-4 shadow-sm border border-slate-100/50">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.isDiscounted && (
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20"
            >
              -{discountPercentage}%
            </motion.span>
          )}
          {product.isFeatured && (
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-950 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-slate-950/20"
            >
              <Sparkles size={8} className="text-indigo-400" />
              সেরা
            </motion.span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-3 sm:pb-4">
          <div className="flex gap-2 p-1.5 bg-white/40 backdrop-blur-2xl rounded-xl border border-white/40 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
            <button 
              onClick={handleAddToCart}
              title="Add to Cart"
              className="flex items-center justify-center w-9 h-9 bg-slate-950 text-white rounded-lg hover:bg-indigo-600 transition-all"
            >
              <ShoppingBag size={14} />
            </button>
            <button 
              onClick={handleBuyNow}
              title="Buy Now"
              className="flex items-center justify-center w-9 h-9 bg-indigo-600 text-white rounded-lg hover:bg-slate-950 transition-all"
            >
              <Zap size={14} fill="currentColor" />
            </button>
            <Link 
              href={`/products/${product.slug}`} 
              title="View Product"
              className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-950 hover:bg-indigo-600 hover:text-white transition-all"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-1 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[70%]">
            {product.category?.name || 'Premium Series'}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] sm:text-[11px] font-black text-slate-950">4.9</span>
          </div>
        </div>
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[12px] sm:text-base font-black text-slate-950 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-sm sm:text-xl font-black text-slate-950 tracking-tighter">
              ৳{product.isDiscounted ? product.discountPrice?.toLocaleString() : product.price.toLocaleString()}
            </span>
            {product.isDiscounted && (
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-300 line-through tracking-widest leading-none">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleAddToCart}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-sm"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag size={14} />
            </button>
            <button 
              onClick={handleBuyNow}
              className="bg-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[12px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Zap size={12} fill="currentColor" />
              এখন কিনুন
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
