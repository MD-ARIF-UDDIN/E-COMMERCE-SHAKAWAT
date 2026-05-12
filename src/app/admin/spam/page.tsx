'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  ShieldAlert, 
  Trash2, 
  UserPlus, 
  Search, 
  Database,
  Phone,
  Clock,
  Ban
} from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';

export default function SpamPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSpam = async () => {
    setLoading(true);
    const res = await api.get('/spam');
    setEntries(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchSpam(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return toast.error('Phone number required');
    setSubmitting(true);
    try {
      await api.post('/spam', { phoneNumber: phone, reason });
      toast.success('Added to blacklist');
      setPhone('');
      setReason('');
      setIsModalOpen(false);
      fetchSpam();
    } catch { toast.error('Failed to add'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove from blacklist?')) return;
    try {
      await api.delete(`/spam/${id}`);
      toast.success('Removed');
      fetchSpam();
    } catch { toast.error('Failed'); }
  };

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Blacklist</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">Protect your store from suspicious activity.</p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="h-11 px-6 flex items-center gap-2 bg-slate-900 text-white font-bold text-[13px] rounded-xl hover:bg-rose-600 transition-all active:scale-[0.98] shadow-sm">
          <UserPlus size={16} /> Block Number
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Notice Card */}
        <div className="lg:col-span-4 space-y-4">
           <div className="bg-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-rose-400 mb-6">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2">Registry Control</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Restricted numbers will be blocked from placing orders. Use this to prevent spam or fraudulent activities.
                </p>
                <div className="flex items-center gap-4 py-4 border-t border-white/5">
                   <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Blocked</p>
                      <p className="text-2xl font-bold">{entries.length}</p>
                   </div>
                </div>
              </div>
              <Ban size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
           </div>
        </div>

        {/* List Table */}
        <div className="lg:col-span-8 space-y-4">
           <div className="flex items-center gap-2 px-1">
              <Database size={16} className="text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Blocked Registry</h3>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {loading ? (
                <div className="p-20 text-center">
                   <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : entries.length === 0 ? (
                <div className="p-20 text-center text-slate-400 font-bold text-[13px]">
                   No restricted numbers found.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                   {entries.map(entry => (
                     <div key={entry._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100">
                             <Phone size={14} />
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-slate-900 font-mono tracking-tight">{entry.phoneNumber}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{entry.reason || 'No reason provided'}</p>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                  <Clock size={10} /> {new Date(entry.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                           </div>
                        </div>
                        <button onClick={() => handleDelete(entry._id)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                          <Trash2 size={14} />
                        </button>
                     </div>
                   ))}
                </div>
              )}
           </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Block Phone Number" maxWidth="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className={labelClass}>Phone Number</label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              required 
              placeholder="01XXXXXXXXX"
              className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-rose-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Reason (Optional)</label>
            <textarea 
              value={reason} 
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Repeated fake orders"
              rows={3}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-rose-500 outline-none transition-all resize-none" 
            />
          </div>
          <div className="pt-4 flex gap-3 border-t border-slate-100">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 h-11 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">Cancel</button>
             <button type="submit" disabled={submitting} className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-sm">
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldAlert size={14} />}
                Add to Blacklist
             </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
