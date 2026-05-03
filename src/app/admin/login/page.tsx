'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff, ShieldCheck, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import BrandLogo from '@/components/ui/BrandLogo';

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
    <div className="min-h-screen bg-gold-950 flex items-center justify-center p-6 relative overflow-hidden selection:bg-primary selection:text-black">
      <div className="absolute inset-0 bg-mesh-gradient opacity-40 pointer-events-none z-0" />
      
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <BrandLogo size="lg" className="justify-center mb-4" />
          <p className="text-[10px] font-black text-gold-200/40 uppercase tracking-[0.4em] mt-6">অ্যাডমিন কন্ট্রোল প্যানেল</p>
        </div>

        {/* Card */}
        <div className="bg-gold-900/10 backdrop-blur-3xl rounded-[3rem] border border-gold-400/20 shadow-2xl p-10 sm:p-12">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gold-200/40 uppercase tracking-widest ml-2">ইমেইল অ্যাড্রেস</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@bronzemart.com"
                required
                className="w-full h-16 bg-gold-950/50 border border-gold-400/10 rounded-2xl px-6 text-sm font-bold text-gold-900 focus:outline-none focus:ring-8 focus:ring-primary/5 focus:bg-gold-950 focus:border-primary/40 transition-all placeholder:text-gold-200/20"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gold-200/40 uppercase tracking-widest ml-2">সিক্রেট পাসওয়ার্ড</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-16 bg-gold-950/50 border border-gold-400/10 rounded-2xl px-6 text-sm font-bold text-gold-900 focus:outline-none focus:ring-8 focus:ring-primary/5 focus:bg-gold-950 focus:border-primary/40 transition-all placeholder:text-gold-200/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gold-200/20 hover:text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 bg-primary hover:bg-gold-600 text-black font-black text-sm uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-primary/20 active:scale-95 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-8 h-8 border-4 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  প্রবেশ করুন
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center space-y-6">
          <p className="text-[10px] font-black text-gold-200/20 uppercase tracking-[0.4em]">
            সুরক্ষিত ও এনক্রিপ্টেড প্যানেল
          </p>
          <div className="flex items-center justify-center gap-4 opacity-20">
            <div className="w-12 h-1 bg-gold-400 rounded-full" />
            <div className="w-12 h-1 bg-primary rounded-full" />
            <div className="w-12 h-1 bg-gold-400 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
