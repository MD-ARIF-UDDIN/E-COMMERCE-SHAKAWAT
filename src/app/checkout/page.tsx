'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle2, Copy, Package, ShieldCheck, Lock, CreditCard, Box, MapPin, Smartphone, User, ChevronRight, Minus, Plus, Trash2, ArrowLeft, Truck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'ক্যাশ অন ডেলিভারি', desc: 'পণ্য হাতে পেয়ে পেমেন্ট করুন', icon: Box },
  { id: 'bKash', label: 'বিকাশ', desc: 'মোবাইল ব্যাংকিং পেমেন্ট', icon: Smartphone },
  { id: 'Nagad', label: 'নগদ', desc: 'ডিজিটাল পেমেন্ট', icon: Smartphone },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, updateQuantity, removeItem } = useCartStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [deliveryType, setDeliveryType] = useState<'inside' | 'outside'>('inside');
  const [settings, setSettings] = useState({ insideChittagong: 60, outsideChittagong: 120 });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentPin, setPaymentPin] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings');
    }
  };

  const deliveryCharge = deliveryType === 'inside' ? settings.insideChittagong : settings.outsideChittagong;
  const subtotal = getTotal();
  const total = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return toast.error('Please enter your phone number');
    if (!address.trim()) return toast.error('Please enter your delivery address');
    if (items.length === 0) return toast.error('Your cart is empty');

    if (paymentMethod === 'bKash' || paymentMethod === 'Nagad') {
      setShowPaymentModal(true);
      return;
    }

    await processOrder();
  };

  const processOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        customerName: name,
        customerPhone: phone,
        address: `${address} (${deliveryType === 'inside' ? 'Inside Chittagong' : 'Outside Chittagong'})`,
        paymentMethod,
        totalAmount: total,
        deliveryCharge,
        items: items.map(i => ({ 
          product: i.product, 
          quantity: i.quantity, 
          price: i.price,
          color: i.color,
          colorName: i.colorName
        })),
      };
      const res = await api.post('/orders', payload);
      setOrderNumber(res.data.orderNumber);
      setShowSuccess(true);
      clearCart();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Something went wrong. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleMockPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentPhone || !paymentPin) return toast.error('Please fill in all fields');
    setPaymentProcessing(true);
    
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
      toast.success(`Payment confirmed via ${paymentMethod}`);
      processOrder();
    }, 2000);
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-24 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-gold-50 rounded-full flex items-center justify-center mb-6 border border-gold-100">
          <Package size={32} className="text-gold-300" />
        </div>
        <h2 className="text-2xl font-black text-gold-900 mb-2 tracking-tight">আপনার কার্ট খালি</h2>
        <p className="text-sm text-gold-400 mb-8">শুরু করতে কিছু পণ্য যোগ করুন</p>
        <Link href="/products" className="bg-primary text-black px-8 py-4 rounded-2xl font-bold text-sm hover:bg-gold-600 transition-all shadow-xl shadow-primary/20">
          কেনাকাটা করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => router.back()} 
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm border border-gold-100 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gold-900 tracking-tight">চেকআউট।</h1>
              <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.2em] mt-1">{items.length} টি পণ্য আপনার কার্টে রয়েছে</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2.5 rounded-2xl">
            <ShieldCheck size={18} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">নিরাপদ এবং ভেরিফাইড চেকআউট</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column — Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {/* Delivery Info */}
            <div className="bg-white border border-gold-100 backdrop-blur-sm rounded-[2.5rem] p-6 sm:p-10 border border-gold-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              
              <h2 className="text-lg font-black text-gold-900 mb-8 flex items-center gap-3 tracking-tight">
                <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center text-primary">
                  <MapPin size={20} />
                </div>
                ডেলিভারি তথ্য
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <button
                     type="button"
                     onClick={() => setDeliveryType('inside')}
                     className={`group relative flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all text-center
                       ${deliveryType === 'inside' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gold-100 bg-gold-50 border border-gold-100 hover:border-gold-200'}`}
                   >
                     {deliveryType === 'inside' && (
                       <div className="absolute top-3 right-3 text-primary">
                         <CheckCircle2 size={16} />
                       </div>
                     )}
                     <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${deliveryType === 'inside' ? 'text-primary' : 'text-gold-400'}`}>চট্টগ্রামের ভেতরে</p>
                     <p className="text-2xl font-black text-gold-900 tracking-tighter">৳{settings.insideChittagong}</p>
                   </button>
                   <button
                     type="button"
                     onClick={() => setDeliveryType('outside')}
                     className={`group relative flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all text-center
                       ${deliveryType === 'outside' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gold-100 bg-gold-50 border border-gold-100 hover:border-gold-200'}`}
                   >
                     {deliveryType === 'outside' && (
                       <div className="absolute top-3 right-3 text-primary">
                         <CheckCircle2 size={16} />
                       </div>
                     )}
                     <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${deliveryType === 'outside' ? 'text-primary' : 'text-gold-400'}`}>চট্টগ্রামের বাইরে</p>
                     <p className="text-2xl font-black text-gold-900 tracking-tighter">৳{settings.outsideChittagong}</p>
                   </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest ml-1">আপনার নাম</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-300" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="উদা: রহিম আহমেদ"
                        className="w-full h-14 pl-12 pr-4 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gold-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest ml-1">ফোন নম্বর <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-300" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="০১৭XXXXXXXX"
                        required
                        className="w-full h-14 pl-12 pr-4 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gold-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest ml-1">ডেলিভারি ঠিকানা <span className="text-rose-500">*</span></label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="বাসা নম্বর, রোড নম্বর, এলাকা, শহর..."
                    required
                    rows={3}
                    className="w-full p-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none placeholder:text-gold-300"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-gold-100 backdrop-blur-sm rounded-[2.5rem] p-6 sm:p-10 border border-gold-100 shadow-sm">
              <h2 className="text-lg font-black text-gold-900 mb-8 flex items-center gap-3 tracking-tight">
                <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                পেমেন্ট পদ্ধতি
              </h2>
              
              <div className="grid gap-4">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`group relative w-full flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left
                      ${paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gold-100 bg-gold-50 border border-gold-100 hover:border-gold-200'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all
                      ${paymentMethod === method.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-gold-50 text-gold-400 border border-gold-100 shadow-sm'}`}>
                      <method.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-black tracking-tight ${paymentMethod === method.id ? 'text-primary' : 'text-gold-900'}`}>
                        {method.label}
                      </p>
                      <p className="text-[10px] font-bold text-gold-400 uppercase tracking-widest mt-0.5">{method.desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${paymentMethod === method.id ? 'border-primary' : 'border-gold-100'}`}>
                      {paymentMethod === method.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full lg:hidden h-16 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-gold-600 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={18} />
                  অর্ডার কনফার্ম করুন — ৳{total.toLocaleString()}
                </>
              )}
            </button>
          </form>

          {/* Right Column — Summary & Items */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gold-100 backdrop-blur-sm rounded-[2.5rem] p-8 sticky top-28 border border-gold-100 shadow-sm">
              <h2 className="text-lg font-black text-gold-900 mb-8 tracking-tight">অর্ডার সামারি।</h2>

              <div className="space-y-4 mb-8">
                {items.map((item, i) => (
                  <div key={item.cartItemId || i} className="flex items-center gap-4 group">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gold-50 border border-gold-100 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gold-900 truncate tracking-tight">{item.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">৳{item.price.toLocaleString()}</span>
                        {item.colorName && (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full border border-gold-100" style={{ backgroundColor: item.colorHex || '#ccc' }}></div>
                            <span className="text-[8px] font-black text-gold-400 uppercase tracking-widest">{item.colorName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-black text-gold-900 tracking-tighter">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gold-100">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gold-400">
                  <span>সাবটোটাল</span>
                  <span className="text-gold-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gold-400">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-primary" />
                    <span>ডেলিভারি</span>
                  </div>
                  <span className="text-gold-900">৳{deliveryCharge}</span>
                </div>
                <div className="pt-4 flex justify-between items-end border-t border-gold-100">
                  <div>
                    <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest mb-1">সর্বমোট</p>
                    <p className="text-3xl font-black text-primary tracking-tighter">৳{total.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">নিরাপদ পেমেন্ট</span>
                  </div>
                </div>
              </div>

              {/* Desktop Submit */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="hidden lg:flex w-full mt-8 h-16 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-gold-600 transition-all items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={18} />
                    অর্ডার কনফার্ম করুন
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Success Modal */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 sm:p-12 max-w-md w-full text-center shadow-2xl border border-gold-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-gold-500 to-primary" />
              
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/20">
                <CheckCircle2 size={40} className="text-primary" />
              </div>
              
              <h2 className="text-3xl font-black text-gold-900 mb-2 tracking-tight">ধন্যবাদ!</h2>
              <p className="text-[11px] font-black text-gold-400 uppercase tracking-[0.2em] mb-10">আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে</p>

              <div className="bg-gold-50 rounded-3xl p-6 mb-10 border border-gold-100">
                <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest mb-2">আপনার অর্ডার নম্বর</p>
                <div className="flex items-center justify-center gap-4">
                  <p className="text-3xl font-black text-primary tracking-wider">{orderNumber}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(orderNumber); toast.success('কপি করা হয়েছে!'); }}
                    className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gold-400 hover:text-primary transition-all shadow-sm border border-gold-100"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                <Link href="/track-order" className="w-full h-14 bg-primary text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:bg-gold-600 transition-all flex items-center justify-center">
                  অর্ডার ট্র্যাক করুন
                </Link>
                <Link href="/" className="w-full h-14 bg-white text-gold-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl border border-gold-100 hover:bg-gold-50 hover:text-gold-900 transition-all flex items-center justify-center">
                  কেনাকাটা চালিয়ে যান
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] p-10 max-sm w-full shadow-2xl border border-gold-100 relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-2 ${paymentMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#ed1c24]'}`} />
              
              <div className="flex items-center gap-5 mb-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg
                  ${paymentMethod === 'bKash' ? 'bg-[#e2136e] shadow-[#e2136e]/20' : 'bg-[#ed1c24] shadow-[#ed1c24]/20'}`}>
                  {paymentMethod === 'bKash' ? 'bK' : 'N'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gold-900 tracking-tight">{paymentMethod === 'bKash' ? 'বিকাশ' : 'নগদ'} পেমেন্ট</h2>
                  <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest mt-0.5">অ্যামাউন্ট: ৳{total.toLocaleString()}</p>
                </div>
              </div>

              <form onSubmit={handleMockPayment} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest ml-1">{paymentMethod === 'bKash' ? 'বিকাশ' : 'নগদ'} নম্বর</label>
                    <input
                      type="tel"
                      required
                      value={paymentPhone}
                      onChange={e => setPaymentPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full h-14 px-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gold-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gold-400 uppercase tracking-widest ml-1">পিন (PIN)</label>
                    <input
                      type="password"
                      required
                      value={paymentPin}
                      onChange={e => setPaymentPin(e.target.value)}
                      placeholder="••••"
                      className="w-full h-14 px-5 bg-gold-50 border border-gold-100 rounded-2xl text-sm font-bold text-gold-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gold-300 tracking-[0.5em]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentProcessing}
                    className="h-14 bg-white text-gold-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gold-50 hover:text-gold-900 transition-all border border-gold-100"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className={`h-14 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2
                      ${paymentMethod === 'bKash' ? 'bg-[#e2136e] hover:bg-[#c2105e]' : 'bg-[#ed1c24] hover:bg-[#c8161d]'}
                      disabled:opacity-50 shadow-lg`}
                  >
                    {paymentProcessing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'পেমেন্ট নিশ্চিত করুন'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
