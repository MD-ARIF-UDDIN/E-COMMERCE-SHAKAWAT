'use client';
import { useState } from 'react';
import { api } from '@/lib/axios';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, Box, Smartphone } from 'lucide-react';

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  Pending:    { icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50',  label: 'পেন্ডিং'    },
  Processing: { icon: Package,      color: 'text-blue-600',   bg: 'bg-blue-50',    label: 'প্রসেসিং' },
  Packed:     { icon: Box,          color: 'text-purple-600', bg: 'bg-purple-50',  label: 'প্যাক করা হয়েছে'     },
  Shipped:    { icon: Truck,        color: 'text-indigo-600', bg: 'bg-indigo-50',  label: 'শিপ করা হয়েছে'    },
  Delivered:  { icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',   label: 'ডেলিভারড'  },
  Cancelled:  { icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50',     label: 'বাতিল করা হয়েছে'  },
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
    <div className="bg-slate-50/50 min-h-screen pt-32 pb-32">
      <div className="container mx-auto px-4 max-w-2xl relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 -left-48 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] mb-6 shadow-premium border border-slate-100">
            <Truck size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-950 mb-3 tracking-tighter">অর্ডার ট্র্যাক করুন।</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">আপনার ডেলিভারি স্ট্যাটাস চেক করুন</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-[2.5rem] shadow-premium-subtle border border-slate-100 p-8 sm:p-10 mb-10 relative z-10">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">অর্ডার নম্বর</label>
              <div className="relative">
                <Box size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="উদা: ORD-AB12CD34"
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ফোন নম্বর</label>
              <div className="relative">
                <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="উদা: ০১৭XXXXXXXX"
                  required
                  className="w-full h-14 pl-12 pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-200"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-slate-950 hover:bg-indigo-600 disabled:bg-slate-200 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
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
          <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest text-center mb-10 shadow-sm">{error}</div>
        )}

        {/* Result */}
        {order && statusCfg && (
          <div className="bg-white rounded-[2.5rem] shadow-premium border border-slate-100 overflow-hidden relative z-10">
            {/* Status Header */}
            <div className={`${statusCfg.bg} p-8 sm:p-10 border-b border-slate-100 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <statusCfg.icon size={128} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center shadow-lg border border-white/50">
                  <statusCfg.icon size={32} className={statusCfg.color} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">অর্ডার #{order.orderNumber}</p>
                  <p className={`text-3xl font-black tracking-tight ${statusCfg.color}`}>{statusCfg.label}</p>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {order.status !== 'Cancelled' && (
              <div className="p-8 sm:p-10 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center justify-between relative px-2">
                  <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 z-0 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-1000"
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
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white border-slate-200 text-slate-300 shadow-sm'}`}>
                          {active ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : i + 1}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${done ? 'text-indigo-600' : 'text-slate-300'}`}>{STEP_LABELS[i]}</span>
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
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">কাস্টমার</p>
                  <p className="text-sm font-bold text-slate-950">{order.customerName || 'N/A'}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ফোন নম্বর</p>
                  <p className="text-sm font-bold text-slate-950">{order.customerPhone}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ঠিকানা</p>
                  <p className="text-sm font-bold text-slate-950 leading-relaxed">{order.address}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-4">অর্ডার আইটেম</h3>
                <div className="grid gap-3">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 transition-all hover:bg-white hover:shadow-md group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                          <Package size={18} />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{item.product?.name || 'Product'} × {item.quantity}</span>
                      </div>
                      <span className="text-sm font-black text-slate-950 tracking-tighter">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <span>সাবটোটাল</span>
                  <span className="text-slate-950">৳{(order.totalAmount - (order.deliveryCharge || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-slate-950">৳{(order.deliveryCharge || 0).toLocaleString()}</span>
                </div>
                <div className="pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">সর্বমোট</p>
                    <p className="text-4xl font-black text-indigo-600 tracking-tighter">৳{order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
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
    </div>
  );
}
