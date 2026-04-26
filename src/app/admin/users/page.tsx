'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { User, UserPlus, Trash2, Mail, Shield, ShieldCheck, ShieldAlert, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLE_CONFIG: Record<string, { icon: any, color: string, bg: string }> = {
  SuperAdmin: { icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  Admin:      { icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Employee:   { icon: Shield,      color: 'text-slate-600', bg: 'bg-slate-50' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Employee' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Only SuperAdmin can manage users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/users', form);
      toast.success('User created successfully');
      setForm({ name: '', email: '', password: '', role: 'Employee' });
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will permanently delete the user from both Auth and Database.')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4">
        <div>
           <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={14} className="text-rose-600" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Security</p>
           </div>
           <h1 className="text-3xl lg:text-5xl font-black text-slate-950 tracking-tighter">Staff Control</h1>
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
             Managed Profiles: <span className="text-slate-950">{users.length}</span>
           </p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="h-14 px-8 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:shadow-indigo-200 shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <UserPlus size={16} /> Create User
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Users List */}
        <div className="lg:col-span-8 space-y-4 px-4 lg:px-0">
          {loading ? (
            <div className="p-24 text-center">
               <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Personnel...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-24 text-center bg-slate-50 rounded-[3rem] border border-slate-100">
               <p className="text-slate-950 font-black text-xl tracking-tight mb-2">No users found</p>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Create staff accounts to manage your store</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {users.map((user, i) => {
                const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.Employee;
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={user.id} 
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-6 lg:p-8 flex items-center gap-6 group hover:border-indigo-100 transition-all shadow-sm hover:shadow-premium"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${cfg.bg} ${cfg.color}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm lg:text-base font-black text-slate-950 truncate tracking-tight">{user.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-current ${cfg.bg} ${cfg.color}`}>
                            {user.role}
                          </span>
                       </div>
                       <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail size={12} />
                          <p className="text-[10px] lg:text-xs font-medium truncate">{user.email}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <button 
                         onClick={() => handleDelete(user.id)}
                         className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Form Sidebar */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-4"
            >
              <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-8 lg:p-10 space-y-10 shadow-inner shadow-slate-200/20 sticky top-28 mx-4 lg:mx-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-black text-slate-950 uppercase tracking-[0.2em]">New Personnel</h2>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Role-Based Access Control</p>
                  </div>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secret Key</label>
                    <input 
                      required
                      type="password"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-950 focus:border-indigo-600 focus:outline-none transition-all appearance-none"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </div>

                  <button
                    disabled={submitting}
                    className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus size={16} /> Authorize User
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
