'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useHydrated } from '@/hooks/useHydrated';
import {
  LayoutDashboard, Package, ShoppingCart, Warehouse, ShoppingBag,
  Shield, Settings, Tag, Layers, LogOut, ChevronRight, BarChart3, Sun,
  Bell, Search, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Dashboard',   href: '/admin/dashboard',   icon: LayoutDashboard, roles: ['SuperAdmin','Admin','Employee'] },
  { label: 'Reports',     href: '/admin/reports',     icon: BarChart3,       roles: ['SuperAdmin','Admin'] },
  { label: 'Products',    href: '/admin/products',    icon: Package,         roles: ['SuperAdmin','Admin'] },
  { label: 'Categories',  href: '/admin/categories',  icon: Tag,             roles: ['SuperAdmin','Admin'] },
  { label: 'Brands',      href: '/admin/brands',      icon: Layers,          roles: ['SuperAdmin','Admin'] },
  { label: 'Orders',      href: '/admin/orders',      icon: ShoppingCart,    roles: ['SuperAdmin','Admin','Employee'] },
  { label: 'Purchases',   href: '/admin/purchases',   icon: ShoppingBag,     roles: ['SuperAdmin','Admin'] },
  { label: 'Inventory',   href: '/admin/inventory',   icon: Warehouse,       roles: ['SuperAdmin','Admin'] },
  { label: 'Blacklist',   href: '/admin/spam',        icon: Shield,          roles: ['SuperAdmin','Admin'] },
  { label: 'Settings',    href: '/admin/settings',    icon: Settings,        roles: ['SuperAdmin','Admin'] },
];

// ── Loading Skeleton ──────────────────────────────────────────
function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Authenticating</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // ── All hooks unconditional ───────────────────────────────────
  const user     = useAuthStore(s => s.user);
  const token    = useAuthStore(s => s.token);
  const logout   = useAuthStore(s => s.logout);
  const router   = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated(); // solves Zustand persist SSR mismatch

  useEffect(() => {
    if (hydrated && !token && !pathname.includes('/login')) {
      router.replace('/login');
    }
  }, [hydrated, token, pathname, router]);

  // ── Login passthrough ─────────────────────────────────────────
  // Uses a fragment — always same shape so React is happy
  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  // ── Pre-hydration or unauthenticated: render skeleton ─────────
  // Must be same JSX shape on every render — no null returns
  if (!hydrated || !user) {
    return <AdminSkeleton />;
  }

  // ── Authenticated shell ───────────────────────────────────────
  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-50 border-r border-slate-100 flex flex-col fixed h-full z-40">
        <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none" />

        {/* Logo */}
        <div className="px-8 py-10 relative z-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-slate-950 rounded-[1.5rem] flex items-center justify-center shadow-premium group-hover:rotate-12 transition-all duration-500">
              <Zap size={22} className="text-indigo-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-slate-950 font-black text-2xl tracking-tighter leading-none uppercase">Nova<span className="text-indigo-600">X</span></p>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em] mt-1.5">Management</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-10 relative z-10">
          <div className="px-6 pb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Main Menu</p>
          </div>
          {visibleNav.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] text-sm font-black transition-all group relative overflow-hidden ${
                  active
                    ? 'bg-white text-slate-950 shadow-premium translate-x-2'
                    : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                {active && (
                  <motion.div layoutId="nav-active" className="absolute inset-0 bg-white rounded-[2rem]" />
                )}
                <item.icon
                  size={18}
                  className={`relative z-10 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-950'}`}
                />
                <span className="flex-1 relative z-10 tracking-tight">{item.label}</span>
                {active && <ChevronRight size={14} className="relative z-10 text-indigo-600" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-6 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-premium border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black shadow-lg text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-950 text-sm font-black truncate leading-none mb-2 tracking-tight">{user.name}</p>
                <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  <Shield size={10} />
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => { logout(); router.push('/login'); }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-80 flex flex-col min-h-screen overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-2xl px-12 py-8 flex items-center justify-between sticky top-0 z-30 border-b border-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Online</p>
            </div>
            <h2 className="text-3xl font-black text-slate-950 tracking-tighter leading-none">
              {visibleNav.find(n => pathname.startsWith(n.href))?.label ?? 'System Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Global Search..."
                  className="bg-transparent border-none text-xs font-black px-4 py-2 w-56 focus:outline-none"
                />
                <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                <Bell size={18} />
              </button>
              <button className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                <Sun size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-10 bg-white flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
