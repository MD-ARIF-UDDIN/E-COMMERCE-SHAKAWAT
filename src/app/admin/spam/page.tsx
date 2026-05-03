'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Phone, 
  AlertOctagon, 
  UserX, 
  Lock, 
  ShieldAlert,
  ArrowRight,
  Database,
  Search,
  Activity,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSpamPage() {
  const [spamList, setSpamList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ phoneNumber: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchSpam = async () => {
    setLoading(true);
    const res = await api.get('/admin/spam');
    setSpamList(res.data);
    setLoading(false);
  };
  useEffect(() => { fetchSpam(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phoneNumber) return toast.error('Phone number is required');
    setSubmitting(true);
    try {
      await api.post('/admin/spam', form);
      toast.success('User blocked successfully');
      setForm({ phoneNumber: '', reason: '' });
      fetchSpam();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to block user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, phone: string) => {
    if (!confirm(`Are you sure you want to unblock ${phone}?`)) return;
    try {
      await api.delete(`/admin/spam/${id}`);
      toast.success('User unblocked successfully');
      fetchSpam();
    } catch { toast.error('Failed to unblock user'); }
  };

  return (
    <div className="space-y-16 pb-32 max-w-5xl">
      {/* Header */}
      <div className="px-4">
         <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={14} className="text-rose-600" />
            <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.3em]">Security Management</p>
         </div>
         <h1 className="text-4xl lg:text-6xl font-black text-gold-900 tracking-tighter">Blacklist</h1>
         <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-lg">
           Manage blocked phone numbers and users. Blacklisted numbers are prohibited from placing orders.
         </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Block User Form */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-gold-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-premium group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 blur-[100px] rounded-full group-hover:bg-rose-600/20 transition-all duration-700" />
              <div className="relative z-10 space-y-10">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400">
                       <UserX size={22} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest">Block New User</h2>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-gold-400 uppercase tracking-widest px-1">Phone Number</label>
                      <div className="relative">
                         <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-600" />
                         <input 
                            type="tel" 
                            value={form.phoneNumber} 
                            onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))}
                            required 
                            placeholder="01XXXXXXXXX"
                            className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:bg-white/10 focus:border-rose-500 focus:outline-none transition-all" 
                         />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-gold-400 uppercase tracking-widest px-1">Reason for Blocking</label>
                      <input 
                         type="text" 
                         value={form.reason} 
                         onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                         placeholder="e.g. Fake Orders"
                         className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white focus:bg-white/10 focus:border-rose-500 focus:outline-none transition-all placeholder:text-gold-700" 
                      />
                    </div>

                    <button type="submit" disabled={submitting} className="w-full h-20 bg-rose-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-rose-600 transition-all shadow-lg flex items-center justify-center gap-4 pt-1">
                      {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={18} />}
                      {submitting ? 'Blocking...' : 'Add to Blacklist'}
                    </button>
                 </form>
              </div>
           </div>

           <div className="bg-gold-50 border border-gold-100 rounded-[3rem] p-10 space-y-6">
              <div className="flex items-center gap-3">
                 <Activity size={16} className="text-gold-400" />
                 <h4 className="text-[10px] font-black text-gold-900 uppercase tracking-widest">System Stats</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-white rounded-2xl border border-gold-100">
                    <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest mb-2">Total Blocked</p>
                    <p className="text-3xl font-black text-rose-600 tracking-tighter">{spamList.length}</p>
                 </div>
                 <div className="p-6 bg-white rounded-2xl border border-gold-100">
                    <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest mb-2">Safety Rating</p>
                    <p className="text-3xl font-black text-emerald-500 tracking-tighter">99%</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Blacklist List */}
        <div className="lg:col-span-7 space-y-8">
           <div className="bg-white rounded-[3rem] border border-gold-100 shadow-premium overflow-hidden">
              <div className="px-10 py-8 border-b border-gold-50 flex items-center justify-between bg-gold-50/50">
                 <div className="flex items-center gap-3">
                    <Database size={16} className="text-gold-900" />
                    <h3 className="text-[10px] font-black text-gold-900 uppercase tracking-widest">Restricted Identifier Registry</h3>
                 </div>
                 <Search size={16} className="text-gold-300" />
              </div>

              {loading ? (
                <div className="px-10 py-24 text-center">
                   <div className="w-8 h-8 border-2 border-gold-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4" />
                   <p className="text-[10px] font-black text-gold-400 uppercase tracking-widest">Synchronizing Registry...</p>
                </div>
              ) : spamList.length === 0 ? (
                <div className="px-10 py-32 text-center space-y-4">
                   <Shield size={48} className="mx-auto text-gold-100" strokeWidth={1} />
                   <p className="text-[10px] font-black text-gold-400 uppercase tracking-[0.4em]">Zero anomalies detected</p>
                </div>
              ) : (
                <div className="divide-y divide-gold-50">
                   {spamList.map((entry, i) => (
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={entry._id} 
                        className="flex items-center gap-6 px-10 py-8 group hover:bg-gold-50/50 transition-all duration-300"
                     >
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                           <AlertOctagon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-lg font-black text-gold-900 tracking-tighter mb-1 font-mono">{entry.phoneNumber}</p>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-gold-400 uppercase tracking-widest">{entry.reason || 'Anomalous Activity'}</span>
                              <div className="w-1 h-1 bg-gold-200 rounded-full" />
                              <span className="text-[9px] font-bold text-gold-300 uppercase tracking-tighter">{new Date(entry.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <button 
                           onClick={() => handleDelete(entry._id, entry.phoneNumber)}
                           className="w-12 h-12 bg-gold-50 text-gold-300 rounded-xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all group/btn"
                        >
                           <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                     </motion.div>
                   ))}
                </div>
              )}
              
              <div className="px-10 py-6 border-t border-gold-50 bg-gold-50/20">
                 <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-gold-400 uppercase tracking-widest">Total Registry Entropy: {spamList.length}</p>
                    <div className="flex items-center gap-1.5">
                       <Zap size={10} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-emerald-600 uppercase">System Integrity Nominal</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
