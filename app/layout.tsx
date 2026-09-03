import './globals.css';
import Providers from '@/components/Providers';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export const metadata = {
  title: 'EgyCar | سوق السيارات في مصر',
  description: 'سوق سيارات مصري حديث',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>
          <FavoritesProvider>{children}</FavoritesProvider>
        </Providers>
      </body>
    </html>
  );
}