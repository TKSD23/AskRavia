import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';

export const metadata: Metadata = {
  title: 'NumaWise - Your Personal AI Numerologist',
  description: 'Get personalized numerology readings, chat with our AI numerologist Numa, and explore your Life Path, Destiny, and Soul Urge numbers with NumaWise.',
  keywords: ['numerology', 'ai', 'life path number', 'destiny number', 'soul urge number', 'compatibility', 'astrology', 'spirituality'],
  authors: [{ name: 'NumaWise' }],
  creator: 'NumaWise AI',
  publisher: 'Firebase Studio',
  openGraph: {
    title: 'NumaWise - Your Personal AI Numerologist',
    description: 'Discover your true self with AI-powered numerology readings.',
    url: 'https://numawise.com', // placeholder domain
    siteName: 'NumaWise',
    images: [
      {
        url: 'https://placehold.co/1200x630.png',
        width: 1200,
        height: 630,
        alt: 'NumaWise AI Numerologist',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NumaWise - Your Personal AI Numerologist',
    description: 'Get personalized numerology readings and explore your core numbers with Numa, your AI guide.',
    images: ['https://placehold.co/1200x630.png'], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#30475E' },
    { media: '(prefers-color-scheme: dark)', color: '#020c21' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
