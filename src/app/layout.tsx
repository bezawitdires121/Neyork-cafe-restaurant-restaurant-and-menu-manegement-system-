import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/lib/theme-context";
import { LanguageProvider } from "@/lib/language-context";
import ActiveOrderWidget from "@/components/ActiveOrderWidget";
import Script from "next/script";
import AudioUnlocker from "@/components/AudioUnlocker";
const notoEthiopic = Noto_Sans_Ethiopic({ variable: "--font-ethiopic", subsets: ["ethiopic"], weight: ["400", "600", "700"] });


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ኒዮርክ ካፌ እና ሬስቶራንት",
  description: "New York Cafe & Restaurant - A luxurious dining experience ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
   <html
  lang="en"
  suppressHydrationWarning
  className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${inter.variable} ${notoEthiopic.variable}`}
>
  
  <body className="min-h-full flex flex-col">

<Script
  id="theme-and-lang"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      try {
        var theme = localStorage.getItem('nyc-theme');
        if (theme === 'light') {
          document.documentElement.classList.add('light');
        }
        window.__nycLang = localStorage.getItem('nyc-lang') || 'en';
      } catch (e) {}
    `,
  }}
/>

  <ThemeProvider>
    <LanguageProvider>
      {children}
      <Toaster
  position="top-right"
  richColors
  closeButton
  duration={3000}
  expand
/>
      <ActiveOrderWidget />
      <AudioUnlocker />
    </LanguageProvider>
  </ThemeProvider>
</body>
</html>
  );
}