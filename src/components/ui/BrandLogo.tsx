'use client';
import Image from 'next/image';

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
        <div className={`
          flex items-center justify-center rounded-xl bg-gold-50 border border-gold-200
          shadow-premium-subtle group-hover:scale-110 transition-transform duration-500 overflow-hidden
          ${iconBox[size]}
        `}>
          <Image
            src="/icon.png"
            alt="Bronze Mart Icon"
            width={200}
            height={200}
            className="w-full h-full object-contain scale-[1.7]"
          />
        </div>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse" />
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
