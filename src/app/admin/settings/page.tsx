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
    <div className="space-y-12 pb-12 px-4 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Configuration</p>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-950 tracking-tighter">Admin Settings</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Business Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-10 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">Business Profile</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                <input 
                  value={settings.businessName}
                  onChange={e => setSettings(s => ({ ...s, businessName: e.target.value }))}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <div className="relative">
                   <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                    value={settings.contactPhone}
                    onChange={e => setSettings(s => ({ ...s, contactPhone: e.target.value }))}
                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                <div className="relative">
                   <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                    value={settings.contactEmail}
                    onChange={e => setSettings(s => ({ ...s, contactEmail: e.target.value }))}
                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Delivery Charges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-10 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-950 tracking-tight">Delivery Fees</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inside Chittagong (৳)</label>
                <input 
                  type="number"
                  value={settings.insideChittagong}
                  onChange={e => setSettings(s => ({ ...s, insideChittagong: Number(e.target.value) }))}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Outside Chittagong (৳)</label>
                <input 
                  type="number"
                  value={settings.outsideChittagong}
                  onChange={e => setSettings(s => ({ ...s, outsideChittagong: Number(e.target.value) }))}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-950 focus:bg-white focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
              
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                   Note: These charges will be dynamically applied during the checkout process based on the customer's selection.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-12 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:shadow-indigo-200 shadow-xl transition-all active:scale-95 disabled:opacity-50"
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
