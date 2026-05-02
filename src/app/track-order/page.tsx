'use client';
import { useState } from 'react';
import { api } from '@/lib/axios';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, Box, Smartphone } from 'lucide-react';

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  Pending:    { icon: Clock,        color: 'text-amber-500',  bg: 'bg-amber-500/10',   label: 'পেন্ডিং'    },
  Processing: { icon: Package,      color: 'text-blue-500',   bg: 'bg-blue-500/10',    label: 'প্রসেসিং' },
  Packed:     { icon: Box,          color: 'text-purple-500', bg: 'bg-purple-500/10',  label: 'প্যাক করা হয়েছে'     },
  Shipped:    { icon: Truck,        color: 'text-primary',    bg: 'bg-primary/10',     label: 'শিপ করা হয়েছে'    },
  Delivered:  { icon: CheckCircle,  color: 'text-emerald-500',bg: 'bg-emerald-500/10', label: 'ডেলিভারড'  },
  Cancelled:  { icon: XCircle,      color: 'text-rose-500',   bg: 'bg-rose-500/10',    label: 'বাতিল করা হয়েছে'  },
};

const STEPS = ['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered'];
const STEP_LABELS = ['পেন্ডিং', 'প্রসেসিং', 'প্যাক করা', 'শিপ করা', 'ডেলিভারড'];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const res = await api.get('/orders/track', { params: { orderNumber, phone } });
      setOrder(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Order not found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STEPS.indexOf(order.status) : -1;
  const statusCfg = order ? STATUS_CONFIG[order.status] : null;

  return (
    <div className="bg-white min-h-screen pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-2xl relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -left-48 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gold-50 rounded-[2.5rem] mb-6 shadow-premium border border-gold-100">
            <Truck size={40} className="text-primary" />
          </div>
          <h1 className="text-5xl font-black text-gold-900 mb-3 tracking-tighter">অর্ডার ট্র্যাক করুন</h1>
          <p className="text-[11px] font-black text-gold-400 uppercase tracking-[0.3em]">আপনার ডেলিভারি স্ট্যাটাস চেক করুন</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-premium-subtle border border-gold-100 p-10 sm:p-12 mb-10 relative z-10">
          <form onSubmit={handleTrack} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gold-400 uppercase tracking-[0.2em] ml-2">অর্ডার নম্বর</label>
              <div className="relative">
                <Box size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-200" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="উদা: ORD-AB12CD34"
                  required
                  className="w-full h-16 pl-14 pr-6 bg-gold-50 border border-gold-100 rounded-2xl text-base font-black text-black focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-gold-200 shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gold-400 uppercase tracking-[0.2em] ml-2">ফোন নম্বর</label>
              <div className="relative">
                <Smartphone size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-200" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="উদা: ০১৭XXXXXXXX"
                  required
                  className="w-full h-16 pl-14 pr-6 bg-gold-50 border border-gold-100 rounded-2xl text-base font-black text-black focus:border-primary/50 focus:bg-white focus:outline-none focus:ring-8 focus:ring-primary/5 transition-all placeholder:text-gold-200 shadow-inner"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 bg-primary hover:bg-gold-600 disabled:bg-gold-50 text-white font-black text-sm uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group active:scale-95"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={22} className="group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  খুঁজুন
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl p-6 text-[11px] font-black uppercase tracking-widest text-center mb-10 shadow-lg backdrop-blur-sm animate-pulse">{error}</div>
        )}

        {/* Result */}
        {order && statusCfg && (
          <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-premium border border-gold-100 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            {/* Status Header */}
            <div className={`${statusCfg.bg} p-10 sm:p-14 border-b border-gold-100 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none -mr-10 -mt-10">
                <statusCfg.icon size={192} strokeWidth={1} />
              </div>
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center shadow-2xl border border-gold-100">
                  <statusCfg.icon size={40} className={statusCfg.color} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-gold-400 uppercase tracking-[0.3em] mb-2">অর্ডার #{order.orderNumber}</p>
                  <p className={`text-4xl font-black tracking-tighter ${statusCfg.color}`}>{statusCfg.label}</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== 'Cancelled' && (
              <div className="p-10 sm:p-14 border-b border-gold-100 bg-gold-50/30">
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute top-6 left-10 right-10 h-1.5 bg-gold-100 z-0 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary shadow-[0_0_20px_rgba(184,134,11,0.5)] transition-all duration-1000"
                      style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                  </div>
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-4 z-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all duration-500
                          ${done 
                            ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/40 scale-110' 
                            : 'bg-white border-gold-100 text-gold-200 shadow-inner'}`}>
                          {active ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" /> : i + 1}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${done ? 'text-primary' : 'text-gold-200'}`}>{STEP_LABELS[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="p-10 sm:p-14 space-y-12">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.3em]">কাস্টমার</p>
                  <p className="text-base font-black text-gold-900">{order.customerName || 'N/A'}</p>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.3em]">ফোন নম্বর</p>
                  <p className="text-base font-black text-gold-900">{order.customerPhone}</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.3em]">ঠিকানা</p>
                  <p className="text-base font-black text-gold-900 leading-relaxed">{order.address}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-gold-900 uppercase tracking-[0.4em] border-l-4 border-primary pl-4">অর্ডার আইটেম</h3>
                <div className="grid gap-4">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-gold-50 border border-gold-100 rounded-[1.5rem] px-8 py-6 transition-all hover:bg-white hover:border-primary/30 group shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gold-200 group-hover:text-primary shadow-inner border border-gold-100 transition-colors">
                          <Package size={22} strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-black text-gold-900 uppercase tracking-wider">{item.product?.name || 'Product'} × {item.quantity}</span>
                      </div>
                      <span className="text-lg font-black text-primary tracking-tighter">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-gold-100 space-y-5">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] text-gold-400">
                  <span>সাবটোটাল</span>
                  <span className="text-gold-900">৳{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.3em] text-gold-400">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-gold-900">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                </div>
                <div className="pt-8 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-gold-400 uppercase tracking-[0.3em]">সর্বমোট</p>
                    <p className="text-5xl font-black text-primary tracking-tighter drop-shadow-2xl">৳{order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 bg-primary/5 text-primary rounded-[1.25rem] border border-primary/10 shadow-xl shadow-primary/5">
                    <CheckCircle size={20} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">ভেরিফাইড অর্ডার</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
