export const dynamic = 'force-dynamic';
'use client';

import Header from '@/components/Header';
import CarCard from '@/components/CarCard';
import { cars } from '@/lib/data';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const favoritedCars = cars.filter((car) => favorites.includes(car.id));

  return (
    <>
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-black mb-6">سياراتي المفضلة</h1>
        {favoritedCars.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p>لسه معندكش أي عربية في المفضلة</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritedCars.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        )}
      </main>
    </>
  );
}