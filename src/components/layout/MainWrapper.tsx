'use client';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
      <motion.main 
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex-grow ${!hideNav ? 'pt-2 lg:pt-4' : ''}`}
      >
        {children}
      </motion.main>
      {!hideNav && <Footer />}
    </div>
  );
}
