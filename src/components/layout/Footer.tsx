'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
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

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

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
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over ৳5000' },
    { icon: RotateCcw, title: '14 Days Return', desc: 'Money back guarantee' },
    { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support team' },
  ];

  return (
    <footer className="mt-20 border-t border-slate-100 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-30 pointer-events-none" />

      <div className="border-b border-slate-50 relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
                  <f.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{f.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-white group-hover:bg-indigo-600 transition-all duration-500 shadow-lg shadow-slate-200">
                <ShoppingBag size={22} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-950">
                Nova<span className="text-indigo-600">Cart</span>
              </span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
              We curate the world's most innovative products to elevate your daily lifestyle. 
              Quality, performance, and aesthetics in every package.
            </p>
            <div className="flex items-center gap-4">
              {[Globe, Camera, MessageCircle].map((Icon, i) => (
                <button key={i} className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm bg-white">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Shop</h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Featured Items', 'Sales & Offers', 'Gift Cards'].map((link) => (
                <li key={link}>
                  <Link href="/products" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Categories</h4>
            <ul className="space-y-4">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/products?category=${cat.slug}`} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                ['Smartphones', 'Laptops', 'Audio', 'Wearables'].map((c) => (
                  <li key={c}>
                    <Link href="/products" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                      {c}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Join our inner circle for early access and exclusive offers.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-slate-950 text-white rounded-xl px-4 flex items-center justify-center hover:bg-indigo-600 transition-all shadow-md">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-400 font-bold tracking-tight uppercase">
            © 2024 NOVACART GLOBAL.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors">PRIVACY</Link>
            <Link href="/terms" className="text-xs text-slate-400 font-bold hover:text-slate-900 transition-colors">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
