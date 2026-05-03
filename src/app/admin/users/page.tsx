'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import { User, UserPlus, Trash2, Mail, Shield, ShieldCheck, ShieldAlert, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ROLE_CONFIG: Record<string, { icon: any, color: string, bg: string }> = {
  SuperAdmin: { icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  Admin:      { icon: ShieldCheck, color: 'text-primary', bg: 'bg-primary/10' },
  Employee:   { icon: Shield,      color: 'text-gold-600', bg: 'bg-gold-50' },
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

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-2xl font-bold text-gold-900 tracking-tight">Staff Management</h1>
           <p className="text-gold-400 text-[13px] font-medium mt-1">Manage personnel and access roles.</p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className="h-11 px-5 bg-gold-900 text-white rounded-xl font-bold text-[13px] hover:bg-primary transition-all flex items-center justify-center gap-2"
        >
          <UserPlus size={16} /> New User
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Users List */}
        <div className={showForm ? "lg:col-span-8" : "lg:col-span-12"}>
          {loading ? (
            <div className="p-20 text-center">
               <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-20 text-center bg-gold-50/50 rounded-2xl border border-dashed border-gold-200">
               <p className="text-gold-900 font-bold text-lg mb-1">No users found</p>
               <p className="text-gold-400 text-[13px]">Create staff accounts to manage your store.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {users.map((user) => {
                const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.Employee;
                return (
                  <motion.div 
                    layout
                    key={user.id} 
                    className="bg-white rounded-2xl border border-gold-100 p-5 flex items-center gap-5 hover:border-gold-200 transition-all"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-sm ${cfg.bg} ${cfg.color}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-[13px] font-bold text-gold-900 truncate tracking-tight">{user.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${cfg.bg} ${cfg.color}`}>
                            {user.role}
                          </span>
                       </div>
                       <p className="text-[11px] font-medium text-gold-400 truncate">{user.email}</p>
                    </div>

                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gold-300 hover:text-rose-500 transition-colors"
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
              <div className="bg-white border border-gold-100 rounded-2xl p-6 lg:p-8 space-y-8 sticky top-28">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-bold text-gold-900 uppercase tracking-widest">New Personnel</h2>
                  <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gold-400 hover:text-gold-900 transition-colors">
                    <X size={14} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-11 px-4 bg-gold-50 border border-gold-100 rounded-xl text-[13px] font-semibold text-gold-900 focus:bg-white focus:border-gold-200 outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full h-11 px-4 bg-gold-50 border border-gold-100 rounded-xl text-[13px] font-semibold text-gold-900 focus:bg-white focus:border-gold-200 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest px-1">Password</label>
                    <input 
                      required
                      type="password"
                      value={form.password}
                      onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full h-11 px-4 bg-gold-50 border border-gold-100 rounded-xl text-[13px] font-semibold text-gold-900 focus:bg-white focus:border-gold-200 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gold-900 uppercase tracking-widest px-1">Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full h-11 px-4 bg-gold-50 border border-gold-100 rounded-xl text-[13px] font-semibold text-gold-900 focus:bg-white focus:border-gold-200 outline-none transition-all"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </div>

                  <button
                    disabled={submitting}
                    className="w-full h-12 bg-gold-900 text-white rounded-xl font-bold text-[13px] hover:bg-primary transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
