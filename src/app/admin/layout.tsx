'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useHydrated } from '@/hooks/useHydrated';
import {
  LayoutDashboard, Package, ShoppingCart, Warehouse, ShoppingBag,
  Shield, Settings, Tag, Layers, LogOut, ChevronRight, BarChart3, Sun,
  Bell, Search, Zap, Menu, X as CloseIcon, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import DynamicLogo from '@/components/ui/DynamicLogo';

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
  { label: 'Users',       href: '/admin/users',       icon: Users,           roles: ['SuperAdmin'] },
  { label: 'Settings',    href: '/admin/settings',    icon: Settings,        roles: ['SuperAdmin','Admin'] },
];

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user     = useAuthStore(s => s.user);
  const token    = useAuthStore(s => s.token);
  const logout   = useAuthStore(s => s.logout);
  const router   = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !token && !pathname.includes('/admin/login')) {
      router.replace('/admin/login');
    }
  }, [hydrated, token, pathname, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname.includes('/admin/login')) {
    return <>{children}</>;
  }

  if (!hydrated || !user) {
    return <AdminSkeleton />;
  }

  const visibleNav = NAV_ITEMS.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-white flex relative text-slate-900 selection:bg-indigo-50 selection:text-indigo-600">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="h-24 px-8 flex items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-indigo-400" fill="currentColor" />
            </div>
            <div>
              <p className="text-slate-950 font-bold text-lg tracking-tight leading-none uppercase">Admin</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">Control Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-0.5 overflow-y-auto pb-10">
          <div className="px-4 pb-3 pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main</p>
          </div>
          {visibleNav.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all group relative ${
                  active
                    ? 'text-indigo-600 bg-indigo-50/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-900'}`}
                />
                <span className="flex-1 tracking-tight">{item.label}</span>
                {active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-5 bg-indigo-600 rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-50">
          <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-slate-50/50">
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-950 font-bold text-sm shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-950 text-[13px] font-bold truncate leading-none mb-1">{user.name}</p>
              <p className="text-slate-400 text-[10px] font-medium uppercase tracking-tighter">{user.role}</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/admin/login'); }}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
        <header className="h-24 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-slate-950 tracking-tight">
              {visibleNav.find(n => pathname.startsWith(n.href))?.label ?? 'Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
               <Search size={14} className="text-slate-400" />
               <input
                 type="text"
                 placeholder="Search anything..."
                 className="bg-transparent border-none text-[13px] font-medium w-40 focus:outline-none placeholder:text-slate-400"
               />
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <Bell size={18} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                <Sun size={18} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-12 bg-white flex-1 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
