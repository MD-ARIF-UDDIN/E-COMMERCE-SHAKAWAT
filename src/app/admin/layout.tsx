'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useHydrated } from '@/hooks/useHydrated';
import {
  LayoutDashboard, Package, ShoppingCart, Warehouse, ShoppingBag,
  Shield, Settings, Tag, Layers, LogOut, ChevronRight, BarChart3, Sun,
  Bell, Search, Zap, Menu, X as CloseIcon, Users, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import BrandLogo from '@/components/ui/BrandLogo';

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
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading</p>
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
    <div className="min-h-screen bg-slate-50 flex relative text-slate-900 selection:bg-primary selection:text-white">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="h-20 px-6 flex items-center border-b border-slate-50">
          <Link href="/" className="flex items-center group">
            <BrandLogo size="sm" hideText />
            <span className="ml-3 text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">Admin Panel</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-6">
          <div className="px-3 pb-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
          </div>
          {visibleNav.map(item => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all group relative ${
                  active
                    ? 'text-primary bg-primary/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors ${active ? 'text-primary' : 'text-slate-400 group-hover:text-slate-900'}`}
                />
                <span className="flex-1 tracking-tight">{item.label}</span>
                {active && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-4 bg-primary rounded-full" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-900 font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 text-xs font-bold truncate">{user.name}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tight">{user.role}</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/admin/login'); }}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full">
        <header className="h-20 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500 border border-slate-200"
            >
              <Menu size={18} />
            </button>
            <h2 className="text-base font-bold text-slate-900">
              {visibleNav.find(n => pathname.startsWith(n.href))?.label ?? 'Overview'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 focus-within:border-primary/40 focus-within:bg-white transition-all">
               <Search size={14} className="text-slate-400" />
               <input
                 type="text"
                 placeholder="Search..."
                 className="bg-transparent border-none text-[13px] font-medium w-32 md:w-48 focus:outline-none placeholder:text-slate-400 text-slate-900"
               />
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all">
                <Bell size={16} />
              </button>
              <button className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all">
                <Moon size={16} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-10 bg-slate-50/50 flex-1 w-full">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </main>
      </div>
    </div>
  );
}
