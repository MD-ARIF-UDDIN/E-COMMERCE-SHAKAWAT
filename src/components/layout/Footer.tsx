'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/axios';
import { 
  ShoppingBag, 
  Globe, 
  Camera, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones
} from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';
import DynamicLogo from '@/components/ui/DynamicLogo';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const businessName = useSettingsStore(s => s.settings.businessName);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch categories for footer', error);
      }
    };
    fetchCategories();
  }, []);

  const features = [
    { icon: Truck, title: 'ফ্রি শিপিং', desc: '৫০০০৳ এর বেশি অর্ডারে' },
    { icon: RotateCcw, title: '১৪ দিনের রিটার্ন', desc: 'মানি ব্যাক গ্যারান্টি' },
    { icon: ShieldCheck, title: 'নিরাপদ পেমেন্ট', desc: '১০০% নিরাপদ চেকআউট' },
    { icon: Headphones, title: '২৪/৭ সাপোর্ট', desc: 'ডেডিকেটেড সাপোর্ট টিম' },
  ];

  return (
    <footer className="mt-20 border-t border-gold-900/10 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 pointer-events-none" />

      <div className="border-b border-gold-900/5 relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-5 group">
                <div className="w-14 h-14 bg-black-800 rounded-[1.25rem] flex items-center justify-center text-gold-900/40 group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110 transition-all duration-500 shadow-sm border border-gold-900/10">
                  <f.icon size={22} />
                </div>
                <div>
                  <h4 className="font-black text-gold-100 text-[10px] uppercase tracking-widest mb-1">{f.title}</h4>
                  <p className="text-[11px] text-gold-900/60 font-bold leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="flex items-center group">
              <div className="relative w-[180px] h-[55px] group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/logo.png"
                  alt="Bronze Mart Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-gold-900/60 font-medium leading-relaxed max-w-sm text-sm">
              আমরা আপনার দৈনন্দিন জীবনযাত্রাকে আরও উন্নত করতে বিশ্বের সবচেয়ে উদ্ভাবনী পণ্যগুলি সংগ্রহ করি। 
              প্রতিটি প্যাকেজে থাকে গুণমান এবং নান্দনিকতার ছোঁয়া।
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Camera, MessageCircle, Mail, Phone].map((Icon, i) => (
                <button key={i} className="w-11 h-11 border border-gold-900/10 rounded-2xl flex items-center justify-center text-gold-900/40 hover:border-primary/40 hover:text-primary transition-all shadow-sm bg-black-900 group/icon">
                  <Icon size={18} className="group-hover/icon:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">কেনাকাটা</h4>
            <ul className="space-y-4">
              {[
                { name: 'নতুন পণ্য', href: '/products' },
                { name: 'সেরা কালেকশন', href: '/products' },
                { name: 'অফারসমূহ', href: '/products' },
                { name: 'গিফট কার্ড', href: '/products' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold text-gold-200 hover:text-primary transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-900/20 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ক্যাটাগরি</h4>
            <ul className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/products?category=${cat.slug}`} className="text-sm font-bold text-gold-200 hover:text-primary transition-all flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-900/20 group-hover:bg-primary transition-colors" />
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                ['Smartphones', 'Laptops', 'Audio', 'Wearables'].map((c) => (
                  <li key={c}>
                    <Link href="/products" className="text-sm font-bold text-gold-200 hover:text-primary transition-all flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-900/20 group-hover:bg-primary transition-colors" />
                      {c}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black text-gold-900/60 uppercase tracking-[0.2em]">নিউজলেটার</h4>
            <div className="space-y-6">
              <p className="text-sm text-gold-900/60 font-medium leading-relaxed">এক্সক্লুসিভ অফার এবং নতুন পণ্যের আপডেট পেতে আমাদের সাথে যোগ দিন।</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="আপনার ইমেইল"
                  className="w-full bg-black-800 border border-gold-900/20 rounded-2xl px-6 py-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-black-900 focus:border-primary/20 transition-all placeholder:text-gold-900/20"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-primary text-black rounded-[1rem] px-5 flex items-center justify-center hover:bg-gold-600 transition-all shadow-lg shadow-primary/20">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-10 border-t border-gold-900/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] text-gold-900/40 font-black tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} {businessName.toUpperCase()} গ্লোবাল। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <p className="text-[9px] text-gold-900/20 font-bold uppercase tracking-widest">মেড উইথ প্যাশন ফর এক্সিলেন্স</p>
          </div>
          
          <div className="flex items-center gap-10">
            <Link href="/privacy" className="text-[10px] text-gold-900/40 font-black uppercase tracking-widest hover:text-primary transition-colors">প্রাইভেসি</Link>
            <Link href="/terms" className="text-[10px] text-gold-900/40 font-black uppercase tracking-widest hover:text-primary transition-colors">শর্তাবলী</Link>
            <div className="w-10 h-1 bg-gold-900/10 rounded-full" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-5 bg-gold-900/10 rounded-md border border-gold-900/20" />
              <div className="w-8 h-5 bg-gold-900/10 rounded-md border border-gold-900/20" />
              <div className="w-8 h-5 bg-gold-900/10 rounded-md border border-gold-900/20" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
