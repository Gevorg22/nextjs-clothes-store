import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { Header } from '@/components/shared/header';
import { Suspense } from 'react';
import { Providers } from '@/components/shared/providers';
import { ClientModals } from '@/components/shared/client-modals';

const nunito = Nunito({
  subsets: ['cyrillic'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Next Clothes Store',
  description: 'Your one-stop shop for the latest fashion trends',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={nunito.className}>
        <Providers>
          <NextTopLoader color="#000" showSpinner={false} />
          <main className="min-h-screen">
            <Header />
            {children}
          </main>
          <Suspense>
            <ClientModals />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
