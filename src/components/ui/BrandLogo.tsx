'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function BrandLogo({ className = "", size = 'md', hideText = false }: BrandLogoProps) {
  const iconBox = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7 md:w-10 md:h-10',
    lg: 'w-12 h-12 md:w-14 md:h-14',
  };

  const bronzeSize = {
    sm: 'text-[17px]',
    md: 'text-[18px] md:text-[22px]',
    lg: 'text-[28px] md:text-[36px]',
  };

  const martSize = {
    sm: 'text-[13px]',
    md: 'text-[14px] md:text-[17px]',
    lg: 'text-[21px] md:text-[27px]',
  };

  const taglineSize = {
    sm: 'text-[4px]',
    md: 'text-[4px] md:text-[5.5px]',
    lg: 'text-[6px] md:text-[7.5px]',
  };

  const gapSizes = {
    sm: 'gap-1.5',
    md: 'gap-1.5 md:gap-2',
    lg: 'gap-2 md:gap-3',
  };

  return (
    <div className={`flex items-center ${gapSizes[size]} ${className}`}>
      {/* Icon */}
      <div className="relative group flex-shrink-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            relative flex items-center justify-center rounded-full bg-white border border-gold-200/50
            shadow-premium-subtle group-hover:shadow-premium group-hover:scale-110 transition-all duration-500 overflow-hidden
            ${iconBox[size]}
          `}
        >
          {/* Inner Glow/Background */}
          <div className="absolute inset-0 bg-white" />
          
          <motion.div
            animate={{ 
              y: [0, -1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative w-full h-full flex items-center justify-center z-10"
          >
            <Image
              src="/icon.png"
              alt="Bronze Mart Icon"
              width={120}
              height={120}
              unoptimized
              className="w-full h-full object-contain scale-[1.7] brightness-[1.05] contrast-[1.25] saturate-[1.1] transition-all duration-500 group-hover:scale-[1.8] [image-rendering:-webkit-optimize-contrast]"
              priority
            />
          </motion.div>

          {/* Premium Shimmer Effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent -translate-x-full z-20"
            animate={{ translateX: ['-100%', '200%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
          />

          {/* Pulse Ring on Hover */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/10 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
        </motion.div>
        
        {/* Status indicator with pulse */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white shadow-sm z-30 animate-pulse" />
      </div>

      {!hideText && (
        <div className="flex flex-col leading-none">
          {/* Playfair Display — high-contrast serif, Vogue/Bazaar aesthetic */}
          <div className="flex items-baseline gap-[2px]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
            {/* BRONZE — bold italic in gold, dominant element */}
            <span
              className={`text-primary font-black italic leading-none tracking-tight ${bronzeSize[size]}`}
            >
              Bronze
            </span>
            {/* MART — lighter weight, dark, slightly smaller for hierarchy */}
            <span
              className={`text-secondary font-normal leading-none tracking-wide ${martSize[size]}`}
            >
              Mart
            </span>
          </div>
          {/* Tagline */}
          <p
            className={`text-primary/40 uppercase mt-[3px] tracking-[0.3em] font-medium ${taglineSize[size]}`}
            style={{ fontFamily: 'var(--font-jakarta), sans-serif' }}
          >
            Quality · Trust · Value
          </p>
        </div>
      )}
    </div>
  );
}
