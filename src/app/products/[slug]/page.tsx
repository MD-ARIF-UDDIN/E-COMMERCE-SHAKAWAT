'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useCartStore } from '@/store/cartStore';
import { 
  ShoppingCart, 
  Package, 
  CheckCircle, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  Zap,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Eye,
  Flame,
  Activity,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';

interface Product {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  description: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  isDiscounted: boolean;
  category: { _id: string; id?: string; name: string; slug: string };
  brand?: { _id: string; name: string };
  hasColors?: boolean;
  colorVariants?: { id?: string; _id?: string; name: string; hexCode: string; stock: number }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, body: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  
  // For Sticky CTA
  const { scrollYProgress } = useScroll();
  const showSticky = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  useEffect(() => {
    const slug = params.slug as string;
    api.get(`/products/${slug}`)
      .then(async (r) => {
        setProduct(r.data);
        if (r.data.hasColors && r.data.colorVariants?.length > 0) {
          setSelectedColor(r.data.colorVariants[0]);
        }
        try {
          const [relatedRes, reviewsRes] = await Promise.all([
            api.get(`/products?category=${r.data.category._id}`),
            api.get(`/products/${r.data._id || r.data.id}/reviews`)
          ]);
          setRelatedProducts(relatedRes.data.filter((p: any) => p._id !== r.data._id && p.id !== r.data.id).slice(0, 4));
          setReviews(reviewsRes.data);
        } catch (err) {
          console.error("Failed to load related data", err);
        }
      })
      .catch(() => router.push('/products'))
      .finally(() => setLoading(false));
      
    // Simulate live viewers
    setViewers(Math.floor(Math.random() * 20) + 5);
    const interval = setInterval(() => {
      setViewers(v => Math.max(3, v + Math.floor(Math.random() * 5) - 2));
    }, 10000);
    return () => clearInterval(interval);
  }, [params.slug, router]);

  const handleAddToCart = () => {
    if (!product) return;
    const stockLimit = product.hasColors ? selectedColor?.stock || 0 : product.stock;
    if (stockLimit <= 0) {
      toast.error('দুঃখিত, এই পণ্যটি বর্তমানে স্টকে নেই');
      return;
    }
    
    addItem({
      product: (product._id || product.id) as string,
      name: product.name,
      price: product.discountPrice ?? product.price,
      quantity: qty,
      image: product.images?.[0],
      color: product.hasColors ? (selectedColor?.id || selectedColor?._id) as string : undefined,
      colorName: product.hasColors ? selectedColor?.name : undefined,
      colorHex: product.hasColors ? selectedColor?.hexCode : undefined,
    });
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewForm.name || !reviewForm.body) return;
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${(product._id || product.id) as string}/reviews`, reviewForm);
      setReviews([res.data, ...reviews]);
      setReviewForm({ name: '', rating: 5, body: '' });
      toast.success('রিভিউটি সফলভাবে জমা দেওয়া হয়েছে!');
    } catch (err) {
      toast.error('রিভিউ জমা দিতে সমস্যা হয়েছে');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="bg-gold-950 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-gold-900/10 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-[0.3em]">পণ্য লোড হচ্ছে</p>
      </div>
    </div>
  );

  if (!product) return null;

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-gold-950 min-h-screen pt-20 pb-16 selection:bg-primary selection:text-black">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-12 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="text-[10px] font-black text-gold-200/60 hover:text-primary transition-colors uppercase tracking-[0.2em]">হোম</Link>
          <ChevronRight size={10} className="text-gold-200/20 shrink-0" />
          <Link href="/products" className="text-[10px] font-black text-gold-200/60 hover:text-primary transition-colors uppercase tracking-[0.2em]">পণ্যসমূহ</Link>
          <ChevronRight size={10} className="text-gold-200/20 shrink-0" />
          <Link href={`/products?category=${product.category.slug}`} className="text-[10px] font-black text-gold-200/60 hover:text-primary transition-colors uppercase tracking-[0.2em]">{product.category.name}</Link>
          <ChevronRight size={10} className="text-gold-200/20 shrink-0" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-24">
          {/* Gallery Section */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-gold-900/5 rounded-[3rem] overflow-hidden border border-gold-400/20 group cursor-zoom-in flex items-center justify-center p-8 shadow-sm hover:shadow-primary/5 transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
              <motion.img 
                src={product.images[activeImage] || 'https://via.placeholder.com/800'} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700" 
                whileHover={{ scale: 1.1 }}
              />
              {product.isDiscounted && (
                <div className="absolute top-8 left-8 bg-primary text-black text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2">
                  <Flame size={14} /> সেল -{discountPct}%
                </div>
              )}
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center p-2 bg-gold-900/10 ${
                      activeImage === i ? 'border-primary scale-95 shadow-md shadow-primary/10' : 'border-gold-400/10 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} className="max-w-full max-h-full object-contain" alt={`${product.name} ${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1.5 rounded-lg">{product.category.name}</span>
                 {product.isFeatured && (
                   <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                     <Sparkles size={12} fill="currentColor" /> সেরা পণ্য
                   </span>
                 )}
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-900/5 border border-gold-400/10 rounded-lg">
                   <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                   <span className="text-[9px] font-black text-gold-200/60 uppercase tracking-widest">{viewers} জন এই পণ্যটি দেখছেন</span>
                 </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-gold-100 tracking-tighter leading-[1.1]">
                {product.name}
              </h1>
              
              <a href="#reviews" className="flex items-center gap-4 pt-2 group cursor-pointer w-fit">
                <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-lg">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-[10px] font-black text-gold-200/60 uppercase tracking-widest group-hover:text-primary transition-colors">১২৮ ভেরিফাইড রিভিউ</span>
              </a>
            </div>

            <div className="relative p-8 bg-gold-900/5 backdrop-blur-sm rounded-[2.5rem] border border-gold-400/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <div className="flex items-baseline gap-4 mb-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter">৳{product.discountPrice.toLocaleString()}</span>
                    <span className="text-xl text-gold-200/20 font-bold line-through tracking-tighter">৳{product.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter">৳{product.price.toLocaleString()}</span>
                )}
              </div>
              <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} className="text-primary/60" /> ট্যাক্স এবং ডেলিভারি চার্জ চেকআউটে যুক্ত হবে
              </p>
            </div>

            <div className="space-y-8">
               <div className="flex flex-col gap-8">
                  {product.hasColors && product.colorVariants && product.colorVariants.length > 0 && (
                    <div className="space-y-4 border-b border-gold-400/10 pb-8">
                      <p className="text-[11px] font-black text-gold-100 uppercase tracking-widest">ভ্যারিয়েন্ট: <span className="text-primary">{selectedColor?.name}</span></p>
                      <div className="flex flex-wrap items-center gap-4">
                        {product.colorVariants.map((color, i) => (
                          <button
                            key={color.id || color._id || i}
                            onClick={() => setSelectedColor(color)}
                            className={`w-14 h-14 rounded-2xl border-4 transition-all shadow-sm ${selectedColor?.id === color.id || selectedColor?._id === color._id ? 'border-primary scale-110 shadow-xl shadow-primary/10' : 'border-gold-950 hover:border-gold-400/30'}`}
                            style={{ backgroundColor: color.hexCode }}
                            title={color.name}
                          >
                             {(selectedColor?.id === color.id || selectedColor?._id === color._id) && (
                               <div className="w-full h-full flex items-center justify-center">
                                 <CheckCircle size={20} className="text-white drop-shadow-md" />
                               </div>
                             )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                     <p className="text-[11px] font-black text-gold-100 uppercase tracking-widest">পরিমাণ নির্বাচন করুন</p>
                     
                     {(() => {
                       const currentStock = product.hasColors ? (selectedColor?.stock || 0) : product.stock;
                       if (currentStock > 0 && currentStock < 10) {
                         return (
                           <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg">
                             <Flame size={12} className="animate-pulse" />
                             <span className="text-[9px] font-black uppercase tracking-widest">মাত্র {currentStock} টি স্টকে আছে</span>
                           </div>
                         );
                       }
                       return (
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${currentStock > 0 ? 'bg-primary/10 text-primary' : 'bg-gold-900/10 text-gold-200/20'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${currentStock > 0 ? 'bg-primary animate-pulse' : 'bg-gold-200/20'}`} />
                           <span className="text-[9px] font-black uppercase tracking-widest">
                             {currentStock > 0 ? `ইন স্টক` : 'আউট অফ স্টক'}
                           </span>
                         </div>
                       );
                     })()}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center bg-gold-900/10 rounded-2xl p-1.5 h-16 w-full sm:w-44 border border-gold-400/10 shadow-inner">
                      <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-12 h-full flex items-center justify-center text-gold-200/60 hover:text-primary hover:bg-gold-900/20 rounded-xl transition-all shadow-sm"
                      >
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="flex-1 text-center font-black text-gold-100 text-xl tracking-tighter">{qty}</span>
                      <button 
                        onClick={() => {
                          const currentStock = product.hasColors ? (selectedColor?.stock || 0) : product.stock;
                          setQty(q => Math.min(currentStock, q + 1));
                        }}
                        className="w-12 h-full flex items-center justify-center text-gold-200/60 hover:text-primary hover:bg-gold-900/20 rounded-xl transition-all shadow-sm"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      disabled={(product.hasColors ? (selectedColor?.stock || 0) : product.stock) <= 0}
                      className="w-full h-16 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gold-600 disabled:bg-gold-900/20 disabled:text-gold-200/20 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/20 group flex items-center justify-center gap-4"
                    >
                      <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                      কার্টে যোগ করুন
                    </button>
                  </div>
               </div>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gold-400/10">
               {[
                 { icon: Truck, text: 'দ্রুত ডেলিভারি', sub: 'দেশজুড়ে হোম ডেলিভারি' },
                 { icon: ShieldCheck, text: 'নিরাপদ পেমেন্ট', sub: '১০০% ক্যাশ অন ডেলিভারি' },
               ].map((f, i) => (
                 <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-gold-900/10 border border-gold-400/10">
                   <div className="w-10 h-10 bg-gold-900/20 rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                     <f.icon size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gold-100 uppercase tracking-widest">{f.text}</p>
                     <p className="text-[9px] text-gold-200/60 font-bold uppercase tracking-tight mt-1">{f.sub}</p>
                   </div>
                 </div>
               ))}
            </div>

            {/* Description */}
            <div className="pt-8 border-t border-gold-400/10">
               <h3 className="text-[11px] font-black text-gold-100 uppercase tracking-[0.3em] mb-4">পণ্যের বিস্তারিত</h3>
               <div className="prose prose-invert max-w-none">
                 <p className="text-gold-200/70 font-medium leading-relaxed text-sm whitespace-pre-line">
                    {product.description || 'এই পণ্যটির কোনো বিস্তারিত বর্ণনা পাওয়া যায়নি।'}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-24">
          <div className="flex items-end justify-between mb-10 border-b border-gold-400/10 pb-6">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">এক্সক্লুসিভ কালেকশন</p>
              <h2 className="text-2xl md:text-4xl font-black text-gold-100 tracking-tighter leading-none">সম্পর্কিত পণ্যসমূহ।</h2>
            </div>
            <Link href="/products" className="text-[10px] font-black text-gold-200/60 hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {relatedProducts.length > 0 ? relatedProducts.map((p) => (
               <ProductCard key={(p._id || p.id) as string} product={p} />
             )) : (
               [...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gold-900/10 rounded-[2.5rem] animate-pulse" />)
             )}
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mb-24">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-8 border-b border-gold-400/10 pb-8">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">কাস্টমার ফিডব্যাক</p>
              <h2 className="text-2xl md:text-4xl font-black text-gold-100 tracking-tighter leading-none">ভেরিফাইড রিভিউ।</h2>
            </div>
            <div className="flex items-center gap-6 bg-gold-900/10 p-6 rounded-3xl border border-gold-400/10">
               <div className="flex flex-col items-center">
                 <span className="text-5xl font-black text-primary tracking-tighter">4.9</span>
                 <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-[0.2em] mt-1">আউট অফ ৫</p>
               </div>
               <div className="h-12 w-px bg-gold-400/20" />
               <div className="flex flex-col gap-1.5">
                 <div className="flex items-center gap-1 text-primary">
                   {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
                 <span className="text-[11px] font-black text-gold-100 uppercase tracking-widest">১২৮ টি কাস্টমার রিভিউ</span>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <div className="bg-gold-950 p-8 rounded-[2.5rem] border border-gold-400/20 shadow-premium-subtle sticky top-28">
                <h3 className="text-xl font-black text-gold-100 mb-6 tracking-tight">আপনার মতামত দিন</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-widest ml-1">আপনার নাম</p>
                      <input type="text" placeholder="নাম লিখুন" required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-gold-900/10 border border-gold-400/10 rounded-2xl px-5 py-4 text-sm font-bold text-gold-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-widest ml-1">রেটিং</p>
                      <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full bg-gold-900/10 border border-gold-400/10 rounded-2xl px-5 py-4 text-sm font-bold text-gold-100 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all appearance-none cursor-pointer">
                        {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} স্টার</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-widest ml-1">রিভিউ</p>
                      <textarea placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..." required value={reviewForm.body} onChange={e => setReviewForm({...reviewForm, body: e.target.value})} className="w-full bg-gold-900/10 border border-gold-400/10 rounded-2xl px-5 py-4 text-sm font-bold text-gold-100 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all"></textarea>
                    </div>
                  </div>
                  <button type="submit" disabled={submittingReview} className="w-full bg-primary text-black py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gold-600 transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
                    {submittingReview ? 'জমা দেওয়া হচ্ছে...' : 'রিভিউ পাবলিশ করুন'}
                  </button>
                </form>
              </div>
            </div>

            {/* Review List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={(review.id || review._id) as string} 
                  className="bg-gold-900/5 rounded-[2.5rem] p-8 border border-gold-400/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-primary/20 transition-colors" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gold-900/20 rounded-2xl flex items-center justify-center text-gold-100 font-black shadow-sm border border-gold-400/10 uppercase text-lg">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-black text-gold-100 tracking-tight">{review.name}</p>
                        <p className="text-[10px] font-black text-gold-200/60 uppercase tracking-widest mt-0.5">{new Date(review.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary bg-gold-900/10 px-3 py-1.5 rounded-full border border-gold-400/10 shadow-sm">
                      {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  
                  <p className="text-gold-200/70 font-medium leading-relaxed text-sm">"{review.body}"</p>
                  
                  <div className="mt-8 pt-6 border-t border-gold-400/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                      <CheckCircle size={14} />
                      <span className="text-[9px] font-black uppercase tracking-[0.1em]">ভেরিফাইড পারচেজ</span>
                    </div>
                    <button className="text-[9px] font-black text-gold-200/60 hover:text-primary uppercase tracking-widest transition-colors">রিপোর্ট করুন</button>
                  </div>
                </motion.div>
              )) : (
                <div className="bg-gold-900/5 rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gold-400/10">
                   <div className="w-16 h-16 bg-gold-900/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                     <MessageCircle size={24} className="text-gold-200/20" />
                   </div>
                   <h3 className="text-lg font-black text-gold-100 mb-2">এখনও কোনো রিভিউ নেই</h3>
                   <p className="text-xs text-gold-200/60 font-medium">প্রথম কাস্টমার হিসেবে আপনার অভিজ্ঞতা শেয়ার করুন।</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <motion.div 
        style={{ opacity: showSticky }}
        className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none"
      >
        <div className="container mx-auto max-w-4xl pointer-events-auto">
          <div className="bg-gold-950/95 backdrop-blur-2xl border border-gold-400/20 rounded-[2.5rem] p-3 sm:p-4 flex items-center justify-between shadow-2xl">
            <div className="hidden sm:flex items-center gap-4 px-4 border-r border-gold-400/10 mr-4">
              <div className="w-12 h-12 bg-gold-900/10 rounded-xl overflow-hidden shrink-0 border border-gold-400/10">
                <img src={product.images[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="truncate max-w-[180px]">
                <p className="text-[11px] font-black text-gold-100 truncate tracking-tight mb-0.5">{product.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">৳{product.discountPrice?.toLocaleString() ?? product.price.toLocaleString()}</p>
                  {product.isDiscounted && <span className="text-[9px] font-bold text-gold-200/20 line-through">৳{product.price.toLocaleString()}</span>}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className="flex items-center bg-gold-900/10 rounded-2xl p-1 h-14 w-32 border border-gold-400/10">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-gold-200/60 hover:text-primary transition-colors">
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="flex-1 text-center font-black text-gold-100 text-sm tracking-tighter">{qty}</span>
                  <button 
                    onClick={() => {
                      const currentStock = product.hasColors ? (selectedColor?.stock || 0) : product.stock;
                      setQty(q => Math.min(currentStock, q + 1));
                    }} 
                    className="w-10 h-full flex items-center justify-center text-gold-200/60 hover:text-primary transition-colors"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
               </div>
               <button 
                  onClick={handleAddToCart}
                  disabled={(product.hasColors ? (selectedColor?.stock || 0) : product.stock) <= 0}
                  className="flex-1 sm:flex-none h-14 px-8 bg-primary text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gold-600 disabled:bg-gold-900/20 disabled:text-gold-200/20 transition-all shadow-xl shadow-primary/20 whitespace-nowrap flex items-center justify-center gap-3 group"
                >
                  <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                  কার্টে যোগ করুন
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

  );
}
