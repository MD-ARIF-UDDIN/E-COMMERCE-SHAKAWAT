'use client';
import { useEffect, useState, useRef } from 'react';
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
  Activity
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
      toast.error('Selected item is out of stock');
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
    toast.success(`${product.name} added to cart`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewForm.name || !reviewForm.body) return;
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${(product._id || product.id) as string}/reviews`, reviewForm);
      setReviews([res.data, ...reviews]);
      setReviewForm({ name: '', rating: 5, body: '' });
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading Product</p>
      </div>
    </div>
  );

  if (!product) return null;

  const discountPct = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-12 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Home</Link>
          <ChevronRight size={12} className="text-slate-300 shrink-0" />
          <Link href="/products" className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Products</Link>
          <ChevronRight size={12} className="text-slate-300 shrink-0" />
          <Link href={`/products?category=${product.category.slug}`} className="text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{product.category.name}</Link>
          <ChevronRight size={12} className="text-slate-300 shrink-0" />
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 mb-16">
          {/* Gallery Section */}
          <div className="lg:col-span-5 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-64 sm:h-80 lg:h-auto lg:aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-50 group cursor-crosshair flex items-center justify-center p-4"
            >
              <motion.img 
                src={product.images[activeImage] || 'https://via.placeholder.com/800'} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain transition-transform duration-700" 
                whileHover={{ scale: 1.2 }}
              />
              {product.isDiscounted && (
                <div className="absolute top-8 left-8 bg-rose-500 text-white text-[10px] font-black px-5 py-2.5 rounded-full uppercase tracking-widest shadow-xl shadow-rose-200 flex items-center gap-2">
                  <Flame size={14} /> SALE {discountPct}% OFF
                </div>
              )}
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center p-2 ${
                      activeImage === i ? 'border-indigo-600 scale-95 shadow-lg' : 'border-slate-50 bg-slate-50 opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={img} className="max-w-full max-h-full object-contain" alt={`${product.name} ${i}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Section - High Conversion Zone */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{product.category.name}</span>
                 {product.isFeatured && (
                   <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                     <Sparkles size={10} fill="currentColor" /> Featured
                   </span>
                 )}
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full">
                   <Activity size={10} className="animate-pulse" />
                   <span className="text-[9px] font-black uppercase tracking-widest">{viewers} viewing now</span>
                 </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter leading-tight">
                {product.name}
              </h1>
              
              {/* Review Snippet */}
              <a href="#reviews" className="flex items-center gap-4 pt-2 group cursor-pointer w-fit">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">128 Reviews</span>
              </a>
            </div>

            <div className="space-y-3 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              {product.discountPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-950 tracking-tighter">৳{product.discountPrice.toLocaleString()}</span>
                  <span className="text-lg text-slate-300 font-bold line-through tracking-tighter">৳{product.price.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-slate-950 tracking-tighter">৳{product.price.toLocaleString()}</span>
              )}
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxes and shipping calculated at checkout</p>
            </div>

            <div className="space-y-6">
               <div className="flex flex-col gap-6">
                  {product.hasColors && product.colorVariants && product.colorVariants.length > 0 && (
                    <div className="space-y-4 border-b border-slate-100 pb-6">
                      <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Select Variant: <span className="text-indigo-600">{selectedColor?.name}</span></p>
                      <div className="flex flex-wrap items-center gap-4">
                        {product.colorVariants.map((color, i) => (
                          <button
                            key={color.id || color._id || i}
                            onClick={() => setSelectedColor(color)}
                            className={`w-12 h-12 rounded-full border-4 transition-all ${selectedColor?.id === color.id || selectedColor?._id === color._id ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent hover:scale-105 shadow-sm'}`}
                            style={{ backgroundColor: color.hexCode }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest">Quantity</p>
                     
                     {/* Scarcity Injector */}
                     {(() => {
                       const currentStock = product.hasColors ? (selectedColor?.stock || 0) : product.stock;
                       if (currentStock > 0 && currentStock < 10) {
                         return (
                           <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                             <Flame size={12} className="animate-pulse" /> Only {currentStock} left
                           </p>
                         );
                       }
                       return (
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                           {currentStock > 0 ? `In Stock` : 'Out of Stock'}
                         </p>
                       );
                     })()}
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-slate-50 rounded-[2rem] p-2 h-20 w-48 border border-slate-100 shadow-inner">
                      <button 
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-14 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Minus size={20} strokeWidth={3} />
                      </button>
                      <span className="flex-1 text-center font-black text-slate-950 text-2xl tracking-tighter">{qty}</span>
                      <button 
                        onClick={() => {
                          const currentStock = product.hasColors ? (selectedColor?.stock || 0) : product.stock;
                          setQty(q => Math.min(currentStock, q + 1));
                        }}
                        className="w-14 h-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm"
                      >
                        <Plus size={20} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={handleAddToCart}
                      disabled={(product.hasColors ? (selectedColor?.stock || 0) : product.stock) <= 0}
                      className="flex-1 h-20 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-premium group"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </div>
                    </button>
                  </div>
               </div>


            </div>

            {/* Description Tab Style */}
            <div className="pt-8 border-t border-slate-100">
               <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] mb-4">Description</h3>
               <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                 <p className="text-slate-600 font-medium leading-relaxed text-sm whitespace-pre-line">
                    {product.description || 'No description available.'}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* Synergistic Assets (Cross-sell mock) */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-6">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">You may also like</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter">RELATED PRODUCTS.</h2>
            </div>
          </div>
          
          <div className="flex flex-wrap -mx-4">
             {relatedProducts.length > 0 ? relatedProducts.map((p) => (
               <div key={(p._id || p.id) as string} className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8">
                 <ProductCard product={p} />
               </div>
             )) : (
               <p className="text-slate-400 px-4 text-sm font-bold">No related products found.</p>
             )}
          </div>
        </div>

        {/* Field Reports (Reviews mock) */}
        <div id="reviews" className="mb-16">
          <div className="flex items-end justify-between mb-8 border-b border-slate-100 pb-6">
            <div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Verified Reviews</p>
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter">CUSTOMER REVIEWS.</h2>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black text-slate-950 tracking-tighter">4.9</span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">128 Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Submission Form */}
          <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 mb-8">
            <h3 className="text-xl font-black text-slate-950 mb-6">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                  <input type="text" placeholder="Your Name" required value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition-colors" />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-600 transition-colors">
                    {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                  </select>
                </div>
              </div>
              <textarea placeholder="Your Review" required value={reviewForm.body} onChange={e => setReviewForm({...reviewForm, body: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:border-indigo-600 transition-colors"></textarea>
              <button type="submit" disabled={submittingReview} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-950 transition-colors disabled:opacity-50">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          <div className="flex flex-wrap -mx-4">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={(review.id || review._id) as string} className="w-full md:w-1/2 px-4 mb-6">
                <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-sm border border-slate-100">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-950 tracking-tight">{review.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">"{review.body}"</p>
                  <div className="mt-6 flex items-center gap-2 text-emerald-600">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Verified Purchase</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 px-4 text-sm font-bold">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <motion.div 
        style={{ opacity: showSticky }}
        className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none"
      >
        <div className="container mx-auto max-w-4xl pointer-events-auto">
          <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl">
            <div className="hidden md:flex items-center gap-4 px-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl overflow-hidden shrink-0">
                <img src={product.images[0] || 'https://via.placeholder.com/100'} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="truncate max-w-[200px]">
                <p className="text-xs font-black text-white truncate tracking-tight">{product.name}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">৳{product.discountPrice?.toLocaleString() ?? product.price.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="hidden sm:flex items-center bg-white/10 rounded-2xl p-1 h-14 w-32">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <span className="flex-1 text-center font-black text-white text-sm">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
                    <Plus size={14} strokeWidth={3} />
                  </button>
               </div>
               <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 md:flex-none h-14 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 disabled:bg-white/10 disabled:text-white/30 transition-all shadow-premium whitespace-nowrap flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Add to Cart
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
