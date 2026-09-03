'use client';

import Link from 'next/link';
import { Heart, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFavoriteIds } from './favorites';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const updateCount = () => {
      setFavoriteCount(getFavoriteIds().length);
    };

    updateCount();

    window.addEventListener('egycar-favorites-change', updateCount);

    return () => {
      window.removeEventListener('egycar-favorites-change', updateCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
      <div className="container h-20 flex items-center justify-between gap-5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white grid place-items-center font-black">
            EC
          </div>
          <div>
            <b className="text-xl">
              Egy<span className="text-blue-600">Car</span>
            </b>
            <small className="block text-slate-500">سوق السيارات في مصر</small>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-7 font-bold text-sm">
          <Link href="/">الرئيسية</Link>
          <a href="/#cars">السيارات</a>
          <a href="/#how">إزاي بيشتغل؟</a>
        </nav>

        {/* Right buttons */}
        <div className="flex items-center gap-2">
          {/* Add Car Button */}
          <a
            href="https://wa.me/201015113347?text=السلام%20عليهم،%20عايز%20أضيف%20عربيتي%20للبيع%20على%20الموقع"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-1.5 transition"
          >
            <Plus size={16} />
            <span>إضافة سيارة</span>
          </a>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl border font-bold relative text-sm"
          >
            <Heart size={17} />
            <span className="hidden sm:inline">المفضلة</span>
            {favoriteCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[11px] grid place-items-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* User Authentication */}
          {isLoaded && (
            isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2.5 rounded-xl border font-bold text-sm hover:bg-slate-50 transition">
                  دخول
                </button>
              </SignInButton>
            )
          )}
        </div>
      </div>
    </header>
  );
}