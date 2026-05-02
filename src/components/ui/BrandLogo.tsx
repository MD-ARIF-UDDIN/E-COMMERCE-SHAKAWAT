'use client';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  hideText?: boolean;
}

export default function BrandLogo({ className = "", size = 'md', hideText = false }: BrandLogoProps) {
  const iconSizes = {
    sm: { w: 40, h: 40 },
    md: { w: 60, h: 60 },
    lg: { w: 80, h: 80 }
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const sloganSizes = {
    sm: 'text-[6px]',
    md: 'text-[8px]',
    lg: 'text-[10px]'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Container - Clips the logo to show only the icon part */}
      <div 
        className="relative overflow-hidden shrink-0" 
        style={{ 
          width: iconSizes[size].w, 
          height: iconSizes[size].h 
        }}
      >
        <div className="absolute inset-0 scale-[2.5] origin-left translate-x-[5%]">
           <Image
            src="/logo.png"
            alt="Icon"
            fill
            className="object-contain filter brightness-125 contrast-110"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
      </div>

      {!hideText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tighter flex items-baseline gap-1.5 ${textSizes[size]}`}>
            <span className="bg-gradient-to-r from-gold-400 via-primary to-gold-600 bg-clip-text text-transparent">BRONZE</span>
            <span className="text-gold-100">MART</span>
          </div>
          <div className={`flex items-center justify-between font-black text-gold-400/60 uppercase tracking-[0.3em] mt-1 ${sloganSizes[size]}`}>
            <span>QUALITY</span>
            <span className="w-1 h-1 rounded-full bg-primary mx-1" />
            <span>TRUST</span>
            <span className="w-1 h-1 rounded-full bg-primary mx-1" />
            <span>VALUE</span>
          </div>
        </div>
      )}
    </div>
  );
}
