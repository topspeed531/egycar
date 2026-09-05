"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";

// 1. مكون الهيدر (Header)
function Header({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (v: string) => void }) {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
          🚗 <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">EgyCar</span>
        </Link>

        {/* شريط البحث المباشر */}
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث باسم السيارة أو الموديل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-800 text-white placeholder-slate-400 border border-slate-700 text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>
    </header>
  );
}

// 2. مكون كارت السيارة (CarCard)
function CarCard({ car }: { car: any }) {
  const displayImg = car.images?.[0] || car.imageUrl;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* صوة الكارت والشارات */}
        <div className="relative w-full h-52 bg-gray-100 overflow-hidden">
          {displayImg ? (
            <img
              src={displayImg}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">بدون صورة</div>
          )}

          {car.model && (
            <span className="absolute top-3 right-3 bg-slate-900/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
              {car.model}
            </span>
          )}

          {car.images?.length > 1 && (
            <span className="absolute bottom-3 left-3 bg-blue-600/90 text-white text-xs font-medium px-2.5 py-0.5 rounded-md backdrop-blur-sm">
              📷 {car.images.length} صور
            </span>
          )}
        </div>

        {/* معلومات السيارة */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {car.name}
          </h3>

          <div className="text-2xl font-extrabold text-emerald-600 mb-4">
            {car.price} <span className="text-xs font-bold text-gray-500">جنيه</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 mb-3">
            <div className="flex items-center gap-1.5 truncate">
              <span>🛣️</span>
              <span>{car.km || "غير محدد"}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span>📍</span>
              <span>{car.location || "غير محدد"}</span>
            </div>
          </div>

          {car.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {car.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. الصفحة الرئيسية (HomePage)
export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cars"), (snapshot) => {
      setCars(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCars = cars.filter(
    (car) =>
      car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500 font-bold animate-pulse text-lg">جاري تحميل السيارات...</div>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="text-xl font-bold text-gray-700">لا توجد سيارات مطابقة</h3>
            <p className="text-gray-500 text-sm mt-1">جرّب البحث باسم آخر أو أضف سيارات جديدة من لوحة الأدمن.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}