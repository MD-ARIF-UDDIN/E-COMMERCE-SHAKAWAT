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
      className="group bg-white rounded-[2.5rem] p-3 sm:p-4 border border-gold-100 hover:border-primary/40 hover:shadow-premium transition-all duration-700 relative overflow-hidden"
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
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-4 ring-primary/20">
              <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Glossy overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-gold-100/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-700 pointer-events-none" />

      {/* Image Container */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gold-50 mb-3 sm:mb-4 shadow-sm border border-gold-100 group-hover:border-primary/20 transition-all">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.isDiscounted && (
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20"
            >
              -{discountPercentage}%
            </motion.span>
          )}
          {product.isFeatured && (
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-primary/20"
            >
              <Sparkles size={10} className="text-white" />
              সেরা
            </motion.span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          <div className="flex gap-3 p-2 bg-white/80 backdrop-blur-2xl rounded-2xl border border-gold-200 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
            <button 
              onClick={handleAddToCart}
              title="Add to Cart"
              className="flex items-center justify-center w-11 h-11 bg-primary text-white rounded-xl hover:bg-gold-600 transition-all"
            >
              <ShoppingBag size={18} />
            </button>
            <button 
              onClick={handleBuyNow}
              title="Buy Now"
              className="flex items-center justify-center w-11 h-11 bg-gold-600 text-white rounded-xl hover:bg-primary transition-all"
            >
              <Zap size={18} fill="currentColor" />
            </button>
            <Link 
              href={`/products/${product.slug}`} 
              title="View Product"
              className="w-11 h-11 bg-gold-50 rounded-xl flex items-center justify-center text-gold-900 hover:bg-primary hover:text-white transition-all border border-gold-200"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-1 space-y-2 sm:space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[9px] sm:text-[10px] font-black text-gold-600 uppercase tracking-widest truncate max-w-[70%] bg-gold-50 px-2 py-1 rounded-md">
            {product.category?.name || 'Premium Series'}
          </span>
          <div className="flex items-center gap-1 shrink-0 bg-gold-50 px-2 py-1 rounded-md border border-gold-100">
            <Star size={11} className="fill-primary text-primary" />
            <span className="text-[10px] sm:text-[11px] font-black text-primary">4.9</span>
          </div>
        </div>
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[13px] sm:text-base font-black text-gold-900 leading-tight tracking-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex flex-col">
            <span className="text-base sm:text-2xl font-black text-primary tracking-tighter">
              ৳{product.isDiscounted ? product.discountPrice?.toLocaleString() : product.price.toLocaleString()}
            </span>
            {product.isDiscounted && (
              <span className="text-[10px] sm:text-[12px] font-bold text-gold-300 line-through tracking-widest leading-none">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleAddToCart}
              className="w-10 h-10 bg-gold-50 border border-gold-100 rounded-xl flex items-center justify-center text-gold-400 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag size={16} />
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gold-600 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Zap size={14} fill="currentColor" />
              কিনুন
            </button>
          </div>
        </div>
      </div>
    </motion.div>

  );
}
