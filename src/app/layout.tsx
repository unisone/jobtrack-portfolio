import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import { Bricolage_Grotesque } from 'next/font/google';
import { ClientProviders } from '@/components/providers/client-providers';
import { CustomCursor } from '@/components/ui/custom-cursor';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Distinctive display font for headlines - crafted, modern feel
const bricolage = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
  // Variable font - no weight needed
});

// Cinematic Serif for "Emotional" typography
const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

// Viewport config must be exported separately in Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  title: 'Job Hunt Tracker | Alex Zaytsev',
  description: 'Track your job applications, interviews, and career progress',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Job Hunt Tracker',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Job Hunt Tracker',
    title: 'Job Hunt Tracker',
    description: 'Track your job applications, interviews, and career progress',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Hunt Tracker',
    description: 'Track your job applications, interviews, and career progress',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${playfair.variable} antialiased`}>
        <CustomCursor />
        {children}
        <ClientProviders />
      </body>
    </html>
  );
}
