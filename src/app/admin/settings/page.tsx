'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { 
  Settings, 
  Save, 
  Store, 
  Phone, 
  Mail, 
  Image as ImageIcon,
  Shield,
  Cpu,
  Globe,
  Zap,
  Lock,
  Database,
  ArrowRight,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ businessName: '', contactPhone: '', contactEmail: '', logoUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => {
      const s = r.data;
      setForm({
        businessName: s.businessName || '',
        contactPhone: s.contactPhone || '',
        contactEmail: s.contactEmail || '',
        logoUrl: s.logoUrl || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Loading Settings...</p>
    </div>
  );

  return (
    <div className="space-y-16 pb-32 max-w-5xl">
      {/* Header */}
      <div className="px-4">
         <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-indigo-600" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Admin Settings</p>
         </div>
         <h1 className="text-4xl lg:text-6xl font-black text-slate-950 tracking-tighter">Settings</h1>
         <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
           Manage your business information and website configurations.
         </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid lg:grid-cols-12 gap-12">
           {/* Business Info */}
           <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-inner shadow-slate-200/20 space-y-10">
                 <div>
                    <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">Business Info</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Business contact details</p>
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Business Name</label>
                      <div className="relative">
                         <Store size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                         <input 
                            value={form.businessName} 
                            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                            required 
                            placeholder="e.g. My Awesome Store"
                            className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" 
                         />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                          <div className="relative">
                             <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                                value={form.contactPhone} 
                                onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))}
                                required 
                                placeholder="+880 1..."
                                className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" 
                             />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                          <div className="relative">
                             <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                                type="email" 
                                value={form.contactEmail} 
                                onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))}
                                required 
                                placeholder="hello@store.com"
                                className="w-full h-16 pl-14 pr-6 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-950 focus:border-indigo-600 focus:shadow-premium focus:outline-none transition-all" 
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-premium">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full" />
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                          <ImageIcon size={22} />
                       </div>
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SVG / PNG / WEBP</span>
                    </div>
                    <div>
                       <h2 className="text-xl font-black tracking-tight">Logo Image</h2>
                       <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Business logo URL</p>
                    </div>
                    <input 
                       value={form.logoUrl} 
                       onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                       placeholder="https://example.com/logo.png"
                       className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-black text-white focus:bg-white/10 focus:border-indigo-500 focus:outline-none transition-all" 
                    />
                 </div>
              </div>
           </div>

           {/* System Status */}
           <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-premium space-y-10">
                 <div>
                    <h2 className="text-sm font-black text-slate-950 uppercase tracking-widest">System Status</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Current website status</p>
                 </div>
                 
                 <div className="space-y-4">
                    {[
                      { label: 'Website Status', status: 'Online', icon: Globe, color: 'text-emerald-500' },
                      { label: 'Database Status', status: 'Healthy', icon: Database, color: 'text-indigo-500' },
                      { label: 'SSL Security', status: 'Active', icon: Lock, color: 'text-amber-500' },
                      { label: 'Server Speed', status: 'Fast', icon: Activity, color: 'text-emerald-500' }
                    ].map((node, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-950 hover:border-slate-950 transition-all duration-500">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:bg-white/10 transition-colors">
                               <node.icon size={14} className={node.color} />
                            </div>
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest group-hover:text-white transition-colors">{node.label}</span>
                         </div>
                         <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-slate-500 transition-colors">{node.status}</span>
                      </div>
                    ))}
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                       System nodes are automatically monitored. Any deviation in security protocols will trigger a Tier-1 alert to registered administrative terminals.
                    </p>
                 </div>
              </div>

              <div className="flex justify-end">
                 <button 
                   type="submit" 
                   disabled={saving}
                   className="w-full lg:w-auto h-20 px-12 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-950 transition-all shadow-premium flex items-center justify-center gap-4 group"
                 >
                   {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                   {saving ? 'Commiting State...' : 'Update System Configuration'}
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
