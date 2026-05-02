import { Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
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
  variable: '--font-hind',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
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
      title: "Bronze Mart | প্রিমিয়াম লাইফস্টাইল মার্কেটপ্লেস",
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
    <html lang="bn" className="h-full dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={`${hindSiliguri.variable} ${jakarta.variable} font-sans min-h-screen bg-mesh-gradient text-[#E6D5B8] antialiased selection:bg-[#C5A021] selection:text-black relative`}>
        <div className="fixed inset-0 bg-dot-pattern opacity-[0.05] pointer-events-none z-0" />
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
              background: '#121212',
              color: '#E6D5B8',
              borderRadius: '1rem',
              border: '1px solid rgba(197, 160, 33, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            },
          }}
        />
      </body>
    </html>
  );
}
