'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { Settings as SettingsIcon, Save, Truck, Building2, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState({
    businessName: 'NovaCommerce',
    contactPhone: '',
    contactEmail: '',
    insideChittagong: 60,
    outsideChittagong: 120
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data) setSettings(res.data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setFetching(false);
    }
  };

  const { updateSettings } = useSettingsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/settings', settings);
      updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-12 text-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Loading Config...</div>;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950 tracking-tight">Settings</h1>
          <p className="text-slate-400 text-[13px] font-medium mt-1">Configure your business profile and delivery parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Business Info */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm shadow-slate-200/20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Building2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 tracking-tight">Business Profile</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest px-1">Store Name</label>
                <input 
                  value={settings.businessName || ''}
                  onChange={e => setSettings(s => ({ ...s, businessName: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest px-1">Contact Phone</label>
                <div className="relative">
                   <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                    value={settings.contactPhone || ''}
                    onChange={e => setSettings(s => ({ ...s, contactPhone: e.target.value }))}
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest px-1">Contact Email</label>
                <div className="relative">
                   <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                    value={settings.contactEmail || ''}
                    onChange={e => setSettings(s => ({ ...s, contactEmail: e.target.value }))}
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Charges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm shadow-slate-200/20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <Truck size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 tracking-tight">Delivery Fees</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest px-1">Inside Chittagong (৳)</label>
                <input 
                  type="number"
                  value={settings.insideChittagong ?? ''}
                  onChange={e => setSettings(s => ({ ...s, insideChittagong: Number(e.target.value) }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-950 uppercase tracking-widest px-1">Outside Chittagong (৳)</label>
                <input 
                  type="number"
                  value={settings.outsideChittagong ?? ''}
                  onChange={e => setSettings(s => ({ ...s, outsideChittagong: Number(e.target.value) }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-semibold text-slate-950 focus:bg-white focus:border-slate-200 outline-none transition-all"
                />
              </div>
              
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                   Note: These charges are applied dynamically at checkout based on location.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 h-14 px-10 bg-slate-950 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-slate-900/10"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
