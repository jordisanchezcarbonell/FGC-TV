import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FGC TV - 24/7 Fighting Game Replays',
  description:
    'Watch non-stop fighting game replays from Street Fighter, Tekken, Guilty Gear, and more',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <link rel='preconnect' href='https://www.youtube.com' />
      <link rel='preconnect' href='https://i.ytimg.com' />
      <link rel='preconnect' href='https://www.google.com' />
      <link rel='dns-prefetch' href='https://www.youtube.com' />
      <link rel='dns-prefetch' href='https://i.ytimg.com' />
      <link rel='dns-prefetch' href='https://www.google.com' />

      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
