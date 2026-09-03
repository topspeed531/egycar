'use client';

import Link from 'next/link';
import { Heart, Gauge, MapPin, Settings2, Fuel } from 'lucide-react';
import type { Car } from '@/lib/data';
import { useFavorites } from '@/contexts/FavoritesContext';

export default function CarCard({ car }: { car: Car }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(car.id);

  return (
    <article className="card overflow-hidden hover:-translate-y-1 transition-transform relative">
      <button
        onClick={() => toggleFavorite(car.id)}
        aria-label={favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
        className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-white/90 grid place-items-center"
      >
        <Heart size={18} className={favorited ? 'fill-red-500 text-red-500' : 'text-slate-700'} />
      </button>

      <Link href={'/cars/' + car.id} className="block">
        <div className="relative">
          <img src={car.image} alt={car.brand + ' ' + car.model} className="w-full h-56 object-cover" />
          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold">{car.year}</span>
            {car.featured && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">مميزة</span>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-black text-lg mb-2">{car.brand} {car.model}</h3>
          <div className="text-2xl font-black text-blue-700 mb-4">
            {car.price.toLocaleString('ar-EG')} <span className="text-sm text-slate-500">جنيه</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <span className="flex gap-2 items-center"><Gauge size={15} />{car.km.toLocaleString('ar-EG')} كم</span>
            <span className="flex gap-2 items-center"><Settings2 size={15} />{car.gear}</span>
            <span className="flex gap-2 items-center"><Fuel size={15} />{car.fuel}</span>
            <span className="flex gap-2 items-center"><MapPin size={15} />{car.city}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}