'use client';
import { ShoppingCart, Eye, Heart, Star, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  const addItem = useCartStore(s => s.addItem);

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product: product._id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      quantity: 1,
      image: product.images?.[0],
    });
    toast.success('Added to cart!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-5 border border-slate-100 hover:border-indigo-100 hover:shadow-premium transition-all duration-700 relative overflow-hidden"
    >
      {/* Glossy overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/0 to-indigo-500/0 group-hover:from-indigo-500/3 group-hover:to-indigo-500/3 transition-all duration-700 pointer-events-none" />

      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-50 mb-3 sm:mb-6 shadow-sm">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isDiscounted && (
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-rose-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-rose-200"
            >
              -{discountPercentage}%
            </motion.span>
          )}
          {product.isFeatured && (
            <motion.span 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-950 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1"
            >
              <Sparkles size={9} className="text-indigo-400" />
              ELITE
            </motion.span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-slate-950/15 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-4 sm:pb-6">
          <div className="flex gap-2 p-2 bg-white/20 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] border border-white/20 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500">
            <button 
              onClick={handleAddToCart}
              className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-3 bg-slate-950 text-white rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-xl"
            >
              <ShoppingBag size={14} className="sm:mr-2" />
              <span className="hidden sm:inline">Add</span>
            </button>
            <Link 
              href={`/products/${product.slug}`} 
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-950 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
            >
              <Eye size={16} />
            </Link>
            <button className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-950 hover:bg-rose-500 hover:text-white transition-all shadow-xl">
              <Heart size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-1 sm:px-2 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[60%]">
            {product.category?.name || 'Limited Series'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[9px] sm:text-[10px] font-black text-slate-950">4.9</span>
          </div>
        </div>
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-base font-black text-slate-950 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-sm sm:text-xl font-black text-slate-950 tracking-tighter">
              ৳{product.isDiscounted ? product.discountPrice?.toLocaleString() : product.price.toLocaleString()}
            </span>
            {product.isDiscounted && (
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-300 line-through tracking-widest">
                ৳{product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-8 h-8 sm:w-11 sm:h-11 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm"
          >
            <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
