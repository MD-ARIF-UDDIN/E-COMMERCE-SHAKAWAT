'use client';
import { useState } from 'react';
import { api } from '@/lib/axios';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, Box } from 'lucide-react';

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  Pending:    { icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50',  label: 'Pending'    },
  Processing: { icon: Package,      color: 'text-blue-600',   bg: 'bg-blue-50',    label: 'Processing' },
  Packed:     { icon: Box,          color: 'text-purple-600', bg: 'bg-purple-50',  label: 'Packed'     },
  Shipped:    { icon: Truck,        color: 'text-indigo-600', bg: 'bg-indigo-50',  label: 'Shipped'    },
  Delivered:  { icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',   label: 'Delivered'  },
  Cancelled:  { icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50',     label: 'Cancelled'  },
};

const STEPS = ['Pending', 'Processing', 'Packed', 'Shipped', 'Delivered'];

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
    <div className="container mx-auto px-4 pt-32 pb-12 max-w-2xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Truck size={32} className="text-indigo-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your order number and phone number to check your delivery status.</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
            <input
              type="text"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="e.g. ORD-AB12CD34"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="e.g. 01XXXXXXXXX"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm mb-6">{error}</div>
      )}

      {/* Result */}
      {order && statusCfg && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Status Header */}
          <div className={`${statusCfg.bg} p-6 border-b border-gray-100`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                <statusCfg.icon size={28} className={statusCfg.color} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Order #{order.orderNumber}</p>
                <p className={`text-2xl font-bold ${statusCfg.color}`}>{statusCfg.label}</p>
              </div>
            </div>
          </div>

          {/* Progress Steps (not shown for Cancelled) */}
          {order.status !== 'Cancelled' && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
                  <div
                    className="h-full bg-indigo-500 transition-all"
                    style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                {STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                        ${done ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      <span className={`text-[10px] font-medium ${done ? 'text-indigo-600' : 'text-gray-400'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Customer Name</p>
                <p className="font-semibold text-gray-900">{order.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-semibold text-gray-900">{order.customerPhone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Delivery Address</p>
                <p className="font-semibold text-gray-900">{order.address}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
              </div>
              {order.deliveryCompany && (
                <div>
                  <p className="text-gray-500">Delivery By</p>
                  <p className="font-semibold text-gray-900">{order.deliveryCompany}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
              <div className="space-y-2">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-gray-50 rounded-lg px-4 py-2.5">
                    <span className="text-gray-700">{item.product?.name || 'Product'} × {item.quantity}</span>
                    <span className="font-semibold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4 font-bold text-lg">
              <span className="text-gray-900">Total Amount</span>
              <span className="text-indigo-600">৳{order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
