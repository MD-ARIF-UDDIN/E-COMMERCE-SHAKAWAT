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
    <div className="bg-black min-h-screen pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-2xl relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -left-48 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black-800 rounded-[2rem] mb-6 shadow-premium border border-gold-900/10">
            <Truck size={32} className="text-primary" />
          </div>
          <h1 className="text-4xl font-black text-gold-100 mb-3 tracking-tighter">অর্ডার ট্র্যাক করুন।</h1>
          <p className="text-[10px] font-black text-gold-900/40 uppercase tracking-[0.2em]">আপনার ডেলিভারি স্ট্যাটাস চেক করুন</p>
        </div>

        {/* Search Form */}
        <div className="bg-black-900/50 backdrop-blur-sm rounded-[2.5rem] shadow-premium-subtle border border-gold-900/10 p-8 sm:p-10 mb-10 relative z-10">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-900/40 uppercase tracking-widest ml-1">অর্ডার নম্বর</label>
              <div className="relative">
                <Box size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-900/20" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="উদা: ORD-AB12CD34"
                  required
                  className="w-full h-14 pl-12 pr-5 bg-black-800 border border-gold-900/10 rounded-2xl text-sm font-bold text-gold-100 focus:border-primary focus:bg-black-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gold-900/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gold-900/40 uppercase tracking-widest ml-1">ফোন নম্বর</label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-900/20" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="উদা: ০১৭XXXXXXXX"
                  required
                  className="w-full h-14 pl-12 pr-5 bg-black-800 border border-gold-900/10 rounded-2xl text-sm font-bold text-gold-100 focus:border-primary focus:bg-black-900 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gold-900/20"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary hover:bg-gold-600 disabled:bg-black-800 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={18} className="group-hover:scale-110 transition-transform" />
                  খুঁজুন
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-center mb-10 shadow-sm">{error}</div>
        )}

        {/* Result */}
        {order && statusCfg && (
          <div className="bg-black-900/50 backdrop-blur-sm rounded-[2.5rem] shadow-premium border border-gold-900/10 overflow-hidden relative z-10">
            {/* Status Header */}
            <div className={`${statusCfg.bg} p-8 sm:p-10 border-b border-gold-900/10 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <statusCfg.icon size={128} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-black-800 flex items-center justify-center shadow-lg border border-gold-900/10">
                  <statusCfg.icon size={32} className={statusCfg.color} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gold-900/40 uppercase tracking-widest mb-1">অর্ডার #{order.orderNumber}</p>
                  <p className={`text-3xl font-black tracking-tight ${statusCfg.color}`}>{statusCfg.label}</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== 'Cancelled' && (
              <div className="p-8 sm:p-10 border-b border-gold-900/10 bg-black-800/30">
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute top-5 left-8 right-8 h-1 bg-black-800 z-0 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                    />
                  </div>
                  {STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-3 z-10">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all duration-500
                          ${done 
                            ? 'bg-primary border-primary text-black shadow-lg shadow-primary/20' 
                            : 'bg-black-800 border-gold-900/10 text-gold-900/20 shadow-sm'}`}>
                          {active ? <div className="w-2 h-2 bg-black rounded-full animate-pulse" /> : i + 1}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${done ? 'text-primary' : 'text-gold-900/20'}`}>{STEP_LABELS[i]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="p-8 sm:p-10 space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gold-900/40 uppercase tracking-widest">কাস্টমার</p>
                  <p className="text-sm font-bold text-gold-100">{order.customerName || 'N/A'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-gold-900/40 uppercase tracking-widest">ফোন নম্বর</p>
                  <p className="text-sm font-bold text-gold-100">{order.customerPhone}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[9px] font-black text-gold-900/40 uppercase tracking-widest">ঠিকানা</p>
                  <p className="text-sm font-bold text-gold-100 leading-relaxed">{order.address}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gold-100 uppercase tracking-[0.2em] mb-4">অর্ডার আইটেম</h3>
                <div className="grid gap-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-black-800 border border-gold-900/10 rounded-2xl px-6 py-4 transition-all hover:bg-black-900 hover:shadow-md group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black-900 rounded-xl flex items-center justify-center text-gold-900/20 group-hover:text-primary shadow-sm border border-gold-900/10 transition-colors">
                          <Package size={18} />
                        </div>
                        <span className="text-xs font-bold text-gold-100">{item.product?.name || 'Product'} × {item.quantity}</span>
                      </div>
                      <span className="text-sm font-black text-primary tracking-tighter">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gold-900/10 space-y-4">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gold-900/40">
                  <span>সাবটোটাল</span>
                  <span className="text-gold-100">৳{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gold-900/40">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-gold-100">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                </div>
                <div className="pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gold-900/40 uppercase tracking-widest mb-1">সর্বমোট</p>
                    <p className="text-4xl font-black text-primary tracking-tighter">৳{order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20">
                    <CheckCircle size={16} />
                    <span className="text-[9px] font-black uppercase tracking-widest">ভেরিফাইড অর্ডার</span>
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
