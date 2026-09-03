import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

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