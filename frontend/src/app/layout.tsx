import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/contexts/ThemeContext';
import ClientWrapper from '@/components/layout/ClientWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AegisRL™ – Enterprise Adaptive RL Portfolio Platform',
  description: 'Institutional-grade AI trading platform with real-time regime detection.',
};

const themeScript = `
(function(){
  var t=localStorage.getItem('theme');
  if(t==='light'||t==='dark') document.documentElement.setAttribute('data-theme',t);
  else if(window.matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.setAttribute('data-theme','dark');
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <ThemeProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
