'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { User, UserPlus, Trash2, Mail, Shield, ShieldCheck, ShieldAlert, X, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLE_CONFIG: Record<string, { icon: any, color: string, bg: string }> = {
  SuperAdmin: { icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  Admin:      { icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/5' },
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
      toast.error(err?.response?.data?.error || 'Access denied');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/users', form);
      toast.success('User created');
      setForm({ name: '', email: '', password: '', role: 'Employee' });
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Deletion failed');
    }
  };

  const labelClass = "text-[11px] font-bold text-black uppercase tracking-wider ml-1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
           <p className="text-slate-500 text-[13px] font-medium mt-0.5">Manage personnel and access roles.</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="h-11 px-5 bg-slate-900 text-white rounded-xl font-bold text-[13px] hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <UserPlus size={16} /> New User
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Users List */}
        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {loading ? (
            <div className="p-20 text-center">
               <Loader2 size={24} className="text-primary animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
               <p className="text-slate-900 font-bold text-base mb-1">No users found</p>
               <p className="text-slate-400 text-[12px]">Create staff accounts to manage your store.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {users.map((user) => {
                const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.Employee;
                return (
                  <motion.div 
                    layout
                    key={user.id} 
                    className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:border-primary transition-all shadow-sm"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${cfg.bg} ${cfg.color}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{user.name}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${cfg.bg} ${cfg.color}`}>
                            {user.role}
                          </span>
                       </div>
                       <p className="text-[11px] font-medium text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
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
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="lg:col-span-4"
            >
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 sticky top-28 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">New Personnel</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                    <X size={14} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className={labelClass}>Full Name</label>
                    <input 
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Email Address</label>
                    <input 
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Password</label>
                    <input 
                      required
                      type="password"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-primary outline-none transition-all"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </div>

                  <button
                    disabled={submitting}
                    className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 mt-2 shadow-sm"
                  >
                    {submitting ? (
                      <Loader2 size={18} className="animate-spin" />
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
