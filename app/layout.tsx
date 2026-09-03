'use client';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export const metadata = {
  title: 'EgyCar | سوق السيارات في مصر',
  description: 'سوق سيارات مصري حديث',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <body>
          <FavoritesProvider>{children}</FavoritesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}