import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MainWrapper from "@/components/layout/MainWrapper";
import Providers from "./providers";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export async function generateMetadata() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecs-server-yl30.onrender.com';
    const res = await fetch(`${apiUrl}/api/settings`, { next: { revalidate: 3600 } });
    const settings = await res.json();
    return {
      title: `${settings.businessName} | Premium Lifestyle Marketplace`,
      description: `Experience the future of commerce with ${settings.businessName}. Curated collection of high-performance products.`,
    };
  } catch (err) {
    return {
      title: "NovaCart | Premium Lifestyle Marketplace",
      description: "Experience the future of commerce with our curated collection of high-performance products.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full light" style={{ colorScheme: 'light' }} suppressHydrationWarning>
      <body className={`${jakarta.className} min-h-screen bg-white text-slate-900 antialiased selection:bg-indigo-600 selection:text-white`}>
        <div className="fixed inset-0 bg-dot-pattern opacity-40 pointer-events-none z-0" />
        <Providers>
          <MainWrapper>
            {children}
          </MainWrapper>
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
