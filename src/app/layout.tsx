import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MainWrapper from "@/components/layout/MainWrapper";
import Providers from "./providers";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import FloatingCart from "@/components/ui/FloatingCart";

const hindSiliguri = Hind_Siliguri({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["bengali", "latin"],
  display: 'swap',
});

export async function generateMetadata() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const fetchUrl = apiUrl.endsWith('/api') ? `${apiUrl}/settings` : `${apiUrl}/api/settings`;
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    const settings = await res.json();
    return {
      title: `${settings.businessName} | প্রিমিয়াম লাইফস্টাইল মার্কেটপ্লেস`,
      description: `${settings.businessName}-এর সাথে কেনাকাটার নতুন অভিজ্ঞতা। আমাদের কিউরেটেড কালেকশন থেকে বেছে নিন আপনার পছন্দের পণ্য।`,
    };
  } catch (err) {
    return {
      title: "NovaCart | প্রিমিয়াম লাইফস্টাইল মার্কেটপ্লেস",
      description: "আমাদের কিউরেটেড কালেকশন থেকে বেছে নিন আপনার পছন্দের পণ্য।",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={`${hindSiliguri.className} min-h-screen bg-mesh-gradient text-slate-900 antialiased selection:bg-indigo-600 selection:text-white relative`}>
        <div className="fixed inset-0 bg-dot-pattern opacity-[0.03] pointer-events-none z-0" />
        <Providers>
          <MainWrapper>
            {children}
          </MainWrapper>
          <FloatingWhatsApp />
          <FloatingCart />
        </Providers>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '1rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </body>
    </html>
  );
}
