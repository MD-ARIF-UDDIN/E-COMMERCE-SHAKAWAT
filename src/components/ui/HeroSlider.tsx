'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
}

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);
  
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    setCurrent((prev) => (prev + newDirection + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl group bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 1.2 }
          }}
          className="absolute inset-0"
        >
          {/* Banner Image */}
          <div className="absolute inset-0">
            <img 
              src={banners[current].image} 
              alt={banners[current].title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent flex flex-col justify-center px-6 md:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-2xl space-y-3 md:space-y-6"
            >
              {banners[current].subtitle && (
                <div className="inline-flex items-center gap-2 bg-primary text-black px-3 md:px-5 py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 w-fit">
                   <Flame size={12} fill="currentColor" className="text-black" /> {banners[current].subtitle}
                </div>
              )}
              
              <h1 className="text-2xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter uppercase whitespace-pre-line drop-shadow-2xl">
                {banners[current].title}
              </h1>
              
              {banners[current].description && (
                <p className="text-white/70 font-medium text-[10px] md:text-lg leading-relaxed max-w-md line-clamp-2 md:line-clamp-none">
                  {banners[current].description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 pt-2 md:pt-4">
                <Link 
                  href={banners[current].link || '/products'} 
                  className="bg-primary text-black px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs hover:bg-gold-600 transition-all shadow-xl shadow-primary/20 active:scale-95 group/btn flex items-center gap-2"
                >
                  এখনই কিনুন <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={() => paginate(-1)}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 bg-primary/5 hover:bg-primary/15 backdrop-blur-3xl border border-primary/20 rounded-full flex items-center justify-center text-primary hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
          <button 
            onClick={() => paginate(1)}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 bg-primary/5 hover:bg-primary/15 backdrop-blur-3xl border border-primary/20 rounded-full flex items-center justify-center text-primary hover:scale-110 transition-all z-20 opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`transition-all duration-500 rounded-full ${idx === current ? 'w-10 bg-primary h-2.5' : 'w-2.5 bg-primary/20 h-2.5 hover:bg-primary/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
