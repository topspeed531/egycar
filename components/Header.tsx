'use client';

import Link from 'next/link';
import {
  Heart,
  UserRound
} from 'lucide-react';

import { useEffect, useState } from 'react';

import { getFavoriteIds } from './favorites';

export default function Header() {

  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {

    const updateCount = () => {
      setFavoriteCount(getFavoriteIds().length);
    };

    updateCount();

    window.addEventListener(
      'egycar-favorites-change',
      updateCount
    );

    return () => {
      window.removeEventListener(
        'egycar-favorites-change',
        updateCount
      );
    };

  }, []);

  return (

    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">

      <div className="container h-20 flex items-center justify-between gap-5">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white grid place-items-center font-black">
            EC
          </div>

          <div>

            <b className="text-xl">
              Egy<span className="text-blue-600">Car</span>
            </b>

            <small className="block text-slate-500">
              سوق السيارات في مصر
            </small>

          </div>

        </Link>


        {/* Navigation */}

        <nav className="hidden md:flex gap-7 font-bold text-sm">

          <Link href="/">
            الرئيسية
          </Link>

          <a href="/#cars">
            السيارات
          </a>

          <a href="/#how">
            إزاي بيشتغل؟
          </a>

        </nav>


        {/* Right buttons */}

        <div className="flex gap-2">

          {/* Favorites */}

          <Link
            href="/favorites"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold relative"
          >

            <Heart
              size={17}
            />

            المفضلة

            {favoriteCount > 0 && (

              <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] grid place-items-center">

                {favoriteCount}

              </span>

            )}

          </Link>


          {/* User */}

          <button
            className="hidden md:block p-2.5 rounded-xl border"
          >

            <UserRound size={18} />

          </button>

        </div>

      </div>

    </header>

  );
}