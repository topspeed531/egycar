import './globals.css';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

export const metadata = {
  title: 'EgyCar | سوق السيارات في مصر',
  description: 'سوق سيارات مصري حديث',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}