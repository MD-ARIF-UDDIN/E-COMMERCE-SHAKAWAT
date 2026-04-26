'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import DynamicLogo from '@/components/ui/DynamicLogo';

export default function AdminLoginPage() {
  const businessName = useSettingsStore(s => s.settings.businessName);
  const router = useRouter();
  const login = useAuthStore(s => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success('Welcome back, ' + res.data.user.name);
      router.push('/admin/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-gradient flex items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none z-0" />
      
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-premium border border-white/20">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter">
            <DynamicLogo />
            <span className="text-indigo-600 ml-1">Admin</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">অ্যাডমিন কন্ট্রোল প্যানেল</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white shadow-premium p-10 sm:p-12">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ইমেইল অ্যাড্রেস</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="arif@gmail.com"
                required
                className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-950 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">সিক্রেট পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-bold text-slate-950 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 transition-all placeholder:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-slate-950 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.25em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                  প্রবেশ করুন
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            সুরক্ষিত ও এনক্রিপ্টেড প্যানেল
          </p>
          <div className="flex items-center justify-center gap-4 opacity-30">
            <div className="w-8 h-1 bg-slate-200 rounded-full" />
            <div className="w-8 h-1 bg-indigo-200 rounded-full" />
            <div className="w-8 h-1 bg-slate-200 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
