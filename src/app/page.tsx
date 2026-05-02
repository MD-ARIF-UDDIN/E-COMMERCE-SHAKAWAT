'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { api } from '@/lib/axios';
import Link from 'next/link';
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Star,
  Package,
  Flame,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

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

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

import HeroSlider from '@/components/ui/HeroSlider';
import CategorySlider from '@/components/ui/CategorySlider';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, banRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/banners').catch(() => ({ data: [] }))
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);

        // Fallback default banners if none uploaded yet
        const defaultBanners: Banner[] = [
          {
            id: '1',
            title: 'আভিজাত্যের নতুন সংজ্ঞা,\nআপনার পোশাকে।',
            subtitle: 'এক্সক্লুসিভ ফ্যাশন',
            description: 'সেরা ডিজাইনের প্রিমিয়াম পোশাক কালেকশন এখন আপনার হাতের নাগালে।',
            image: '/banners/fashion.png',
            link: '/products'
          },
          {
            id: '2',
            title: 'আধুনিক প্রযুক্তির সাথে,\nথাকুন একধাপ এগিয়ে।',
            subtitle: 'স্মার্ট গ্যাজেটস',
            description: 'লেটেস্ট স্মার্টফোন এবং ইলেক্ট্রনিক্স পণ্যে পান আকর্ষণীয় সব অফার।',
            image: '/banners/electronics.png',
            link: '/products'
          },
          {
            id: '3',
            title: 'টাটকা এবং সতেজ পণ্য,\nআপনার প্রতিদিনের জন্য।',
            subtitle: 'প্রিমিয়াম গ্রোসারি',
            description: 'সরাসরি খামার থেকে সতেজ সবজি এবং ফল পৌঁছে দিচ্ছি আপনার দ্বারে।',
            image: '/banners/grocery.png',
            link: '/products'
          },
          {
            id: '4',
            title: 'আপনার ঘরকে দিন,\nনতুন আভিজাত্য।',
            subtitle: 'লাইফস্টাইল',
            description: 'আধুনিক হোম ডেকোর এবং ফার্নিচার নিয়ে সাজিয়ে তুলুন আপনার প্রিয় ঘর।',
            image: '/banners/lifestyle.png',
            link: '/products'
          }
        ];

        setBanners(banRes.data.length > 0 ? banRes.data : defaultBanners);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const saleProducts = products.filter(p => p.isDiscounted).slice(0, 4);
  const topSelling = products.slice(0, 8);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold-100 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest">ক্যাটালগ লোড হচ্ছে</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-14 lg:pt-28 pb-20">
      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section className="w-full px-[4px] mb-4">
        <HeroSlider banners={banners} />
      </section>

      {/* ── FEATURED CATEGORIES ───────────────────────────────────── */}
      <section className="w-full px-[4px] mb-12 md:mb-20">
        <div className="text-center mb-4">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">আমাদের বিশেষত্ব</p>
          <h2 className="text-2xl md:text-4xl font-black text-gold-900 tracking-tighter uppercase">সেরা ক্যাটাগরি সমূহ।</h2>
        </div>

        <CategorySlider categories={categories} />
      </section>

      {/* ── TOP SELLING PRODUCTS ─────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-6 mb-12 md:mb-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg w-fit mb-3 border border-primary/20">
              <TrendingUp size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">টপ ট্রেন্ডিং</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gold-900 tracking-tighter uppercase">সেরা বিক্রিত পণ্য।</h2>
          </div>
          <Link href="/products" className="hidden md:flex items-center gap-2 text-[10px] font-black text-gold-400 hover:text-primary transition-colors uppercase tracking-widest">
            সব দেখুন <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {topSelling.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ── FLASH SALE BANNER ───────────────────────────────────── */}
      {saleProducts.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 mb-12 md:mb-20">
          <div className="bg-gold-50 rounded-[3rem] p-10 md:p-20 relative overflow-hidden flex flex-col items-center text-center border border-gold-100 shadow-sm">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[100px]" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30 w-fit mx-auto">
                <Flame size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">চলমান মেগা সেল</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-gold-900 tracking-tighter leading-none">
                সীমিত সময়ের জন্য<br />
                <span className="text-primary">স্পেশাল ডিসকাউন্ট।</span>
              </h2>
              <p className="text-gold-400 font-medium max-w-xl mx-auto text-sm md:text-base">
                আমাদের সিলেক্টিভ কালেকশনে পান আকর্ষণীয় সব অফার। স্টক শেষ হওয়ার আগেই অর্ডার করুন।
              </p>
              <div className="pt-4">
                <Link href="/products?filter=sale" className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-gold-600 transition-all shadow-2xl shadow-primary/20">
                  অফার দেখুন
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-none">আমাদের সাথে যুক্ত হোন।</h2>
            <p className="text-white/80 font-medium max-w-md mx-auto mb-10 text-sm md:text-base">
              লিমিটেড ড্রপ এবং মেম্বার-অনলি অফার সম্পর্কে জানতে সাবস্ক্রাইব করুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="আপনার ইমেইল এড্রেস"
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all text-sm font-bold"
              />
              <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black text-xs hover:bg-gold-50 transition-all shadow-xl">
                সাবস্ক্রাইব করুন
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
