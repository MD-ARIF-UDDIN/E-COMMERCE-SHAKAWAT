'use client';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isLogin = pathname === '/admin/login';
  const hideNav = isAdmin || isLogin;

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {!hideNav && <Navbar />}
      <main className={`flex-grow ${!hideNav ? 'pt-4 lg:pt-6' : ''}`}>
        {children}
      </main>
      {!hideNav && <Footer />}
    </div>
  );
}
