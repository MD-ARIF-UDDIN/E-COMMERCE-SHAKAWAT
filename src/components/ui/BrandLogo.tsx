'use client';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function BrandLogo({ className = "", size = 'md', hideText = false }: BrandLogoProps) {
  const textSizes = {
    sm: 'text-base',
    md: 'text-xl md:text-2xl',
    lg: 'text-3xl md:text-4xl'
  };

  const gapSizes = {
    sm: 'gap-1.5',
    md: 'gap-1.5 md:gap-2',
    lg: 'gap-2 md:gap-3'
  };

  return (
    <div className={`flex items-center ${gapSizes[size]} ${className} font-jakarta`}>
      {/* Icon - E-commerce Cart Style */}
      <div className="relative group">
        <div className={`
          flex items-center justify-center rounded-xl bg-gold-50 border border-gold-200 
          shadow-premium-subtle group-hover:scale-110 transition-transform duration-500 overflow-hidden
          ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10 md:w-12 md:h-12' : 'w-14 h-14 md:w-16 md:h-16'}
        `}>
          <Image 
            src="/icon.png" 
            alt="Bronze Mart Icon" 
            width={200} 
            height={200} 
            className="w-full h-full object-contain scale-[1.7]"
          />
        </div>
        {/* Animated accent dot */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
      </div>

      {!hideText && (
        <div className="flex flex-col leading-none">
          <div className={`font-[900] tracking-tight flex items-baseline gap-1.5 ${textSizes[size]}`}>
            <span className="text-primary uppercase">
              BRONZE
            </span>
            <span className="text-black uppercase">
              MART
            </span>
          </div>
          <p className={`
            text-gold-600/40 font-bold uppercase tracking-[0.3em] mt-0.5
            ${size === 'sm' ? 'text-[6px]' : size === 'md' ? 'text-[6px] md:text-[8px]' : 'text-[8px] md:text-[10px]'}
          `}>
            Quality • Trust • Value
          </p>
        </div>
      )}
    </div>
  );
}
