'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { api } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CheckCircle2, Copy, Package, ShieldCheck, Lock, CreditCard, Box, MapPin, Smartphone, User, ChevronRight, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Box },
  { id: 'bKash', label: 'bKash', desc: 'Mobile banking', icon: Smartphone },
  { id: 'Nagad', label: 'Nagad', desc: 'Digital payment', icon: Smartphone },
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

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentPin, setPaymentPin] = useState('');

  const deliveryCharge = 60;
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
        address,
        paymentMethod,
        totalAmount: total,
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
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Package size={32} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-950 mb-2 tracking-tight">Your cart is empty</h2>
        <p className="text-sm text-slate-400 mb-8">Add some products to get started</p>
        <Link href="/products" className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm border border-slate-100">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Checkout</h1>
            <p className="text-xs text-slate-400 mt-0.5">{items.length} item{items.length > 1 ? 's' : ''} in your order</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column — Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            {/* Order Items */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100">
              <h2 className="text-sm font-bold text-slate-950 mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                      {item.colorName && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full border border-slate-200" style={{ backgroundColor: item.colorHex || '#ccc' }}></span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.colorName}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-1">৳{item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        type="button"
                        onClick={() => item.quantity > 1 ? updateQuantity(item.cartItemId, item.quantity - 1) : removeItem(item.cartItemId)}
                        className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all"
                      >
                        {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="text-sm font-black text-slate-950 w-20 text-right shrink-0">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100">
              <h2 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-indigo-600" />
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Your Name <span className="text-slate-300">(optional)</span></label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rahim Ahmed"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Phone Number <span className="text-rose-500">*</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-950 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Delivery Address <span className="text-rose-500">*</span></label>
                  <textarea
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="House, Road, Area, City..."
                    required
                    rows={3}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all resize-none placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100">
              <h2 className="text-sm font-bold text-slate-950 mb-4 flex items-center gap-2">
                <CreditCard size={16} className="text-indigo-600" />
                Payment Method
              </h2>
              
              <div className="space-y-2">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
                      ${paymentMethod === method.id 
                        ? 'border-indigo-600 bg-indigo-50/50' 
                        : 'border-slate-100 bg-white hover:border-slate-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                      ${paymentMethod === method.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <method.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${paymentMethod === method.id ? 'text-indigo-600' : 'text-slate-900'}`}>
                        {method.label}
                      </p>
                      <p className="text-xs text-slate-400">{method.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                      ${paymentMethod === method.id ? 'border-indigo-600' : 'border-slate-200'}`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit — mobile only */}
            <button
              type="submit"
              disabled={loading}
              className="w-full lg:hidden h-14 bg-slate-950 hover:bg-indigo-600 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} />
                  Place Order — ৳{total.toLocaleString()}
                </>
              )}
            </button>
          </form>

          {/* Right Column — Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 sm:p-6 sticky top-28 border border-slate-100">
              <h2 className="text-sm font-bold text-slate-950 mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-slate-700">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery</span>
                  <span className="font-semibold text-slate-700">৳{deliveryCharge}</span>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-bold text-slate-950">Total</span>
                  <span className="text-xl font-black text-indigo-600">৳{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit — desktop only */}
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                disabled={loading}
                className="hidden lg:flex w-full mt-6 h-14 bg-slate-950 hover:bg-indigo-600 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Place Order
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-300">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-medium">Secure checkout</span>
              </div>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} className="text-emerald-500" />
              </div>
              
              <h2 className="text-2xl font-black text-slate-950 mb-1 tracking-tight">Order Placed!</h2>
              <p className="text-sm text-slate-400 mb-6">Thank you for your purchase</p>

              <div className="bg-slate-50 rounded-2xl p-5 mb-6">
                <p className="text-xs text-slate-400 mb-1">Order Number</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-2xl font-black text-indigo-600 tracking-wide">{orderNumber}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(orderNumber); toast.success('Copied!'); }}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/track-order" className="w-full h-12 bg-slate-950 hover:bg-indigo-600 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center">
                  Track My Order
                </Link>
                <Link href="/" className="w-full h-12 bg-white hover:bg-slate-50 text-slate-500 font-bold text-sm rounded-xl border border-slate-200 transition-all flex items-center justify-center">
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg
                  ${paymentMethod === 'bKash' ? 'bg-[#e2136e]' : 'bg-[#ed1c24]'}`}>
                  {paymentMethod === 'bKash' ? 'bK' : 'N'}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">{paymentMethod} Payment</h2>
                  <p className="text-xs text-slate-400">Amount: ৳{total.toLocaleString()}</p>
                </div>
              </div>

              <form onSubmit={handleMockPayment} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">{paymentMethod} Number</label>
                  <input
                    type="tel"
                    required
                    value={paymentPhone}
                    onChange={e => setPaymentPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-950 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">PIN</label>
                  <input
                    type="password"
                    required
                    value={paymentPin}
                    onChange={e => setPaymentPin(e.target.value)}
                    placeholder="••••"
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-950 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-300 tracking-widest"
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    disabled={paymentProcessing}
                    className="w-1/3 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className={`flex-1 h-12 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2
                      ${paymentMethod === 'bKash' ? 'bg-[#e2136e] hover:bg-[#c2105e]' : 'bg-[#ed1c24] hover:bg-[#c8161d]'}
                      disabled:opacity-50`}
                  >
                    {paymentProcessing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Confirm Payment'
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
