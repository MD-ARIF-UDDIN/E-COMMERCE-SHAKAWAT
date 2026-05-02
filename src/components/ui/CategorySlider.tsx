'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const [scrollAmount, setScrollAmount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollWidth = containerRef.current.clientWidth;
      const currentScroll = containerRef.current.scrollLeft;
      const targetScroll = direction === 'left' ? currentScroll - scrollWidth / 2 : currentScroll + scrollWidth / 2;
      
      containerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [categories]);

  if (!categories.length) return null;

  return (
    <div className="relative group px-[4px]">
      {/* Scroll Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black-900/80 backdrop-blur-md border border-gold-900/20 rounded-full flex items-center justify-center text-gold-200 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black-900/80 backdrop-blur-md border border-gold-900/20 rounded-full flex items-center justify-center text-gold-200 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-black"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>

      <div 
        ref={containerRef}
        className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 snap-x snap-mandatory pb-4 justify-start md:justify-center"
      >
        {categories.map((cat) => (
          <Link 
            key={cat._id} 
            href={`/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-3 group shrink-0 snap-center first:ml-0 last:mr-0"
          >
            <div className="w-20 h-20 md:w-28 md:h-28 bg-black-900 rounded-full flex items-center justify-center border-4 border-black-800 shadow-premium overflow-hidden transition-all duration-500 group-hover:shadow-primary/20 group-hover:border-primary/40 group-hover:scale-105">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <ShoppingBag size={32} className="text-gold-900/20" />
              )}
            </div>
            <span className="text-[10px] md:text-[12px] font-black text-gold-200 uppercase tracking-wider group-hover:text-primary transition-colors text-center max-w-[100px] md:max-w-[140px] truncate px-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
