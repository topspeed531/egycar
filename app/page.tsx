"use client";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // حالة الفلاتر
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cars"), (snapshot) => {
      setCars(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // تجميع قائمة المحافظات والشركات المتاحة ديناميكياً من البيانات
  const brands = useMemo(() => {
    const set = new Set(cars.map((c) => c.name?.split(" ")[0]).filter(Boolean));
    return Array.from(set);
  }, [cars]);

  const locations = useMemo(() => {
    const set = new Set(cars.map((c) => c.location).filter(Boolean));
    return Array.from(set);
  }, [cars]);

  // تطبيق الفلاتر
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch =
        !searchTerm ||
        car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toString().includes(searchTerm);

      const matchesBrand =
        !selectedBrand || car.name?.toLowerCase().includes(selectedBrand.toLowerCase());

      const matchesLocation =
        !selectedLocation || car.location === selectedLocation;

      return matchesSearch && matchesBrand && matchesLocation;
    });
  }, [cars, searchTerm, selectedBrand, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      {/* 1. Header العلوي */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white font-black text-sm px-2.5 py-1 rounded-lg">
              EC
            </div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight block leading-none">
                EgyCar
              </span>
              <span className="text-[10px] text-gray-400 font-medium">سوق السيارات في مصر</span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-red-500 px-3 py-1.5 rounded-lg transition">
              ♡ <span className="hidden sm:inline">المفضلة</span>
            </button>
            <Link
              href="/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <span>🚘</span> بيع عربية
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section الأزرق */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white pt-10 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-blue-700/60 text-blue-200 text-xs px-3 py-1 rounded-full mb-3 border border-blue-500/30">
            سوق السيارات في مصر
          </span>
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            بيع واشتري عربيتك <br /> بثقة وبأفضل سعر
          </h1>
          <p className="text-xs md:text-sm text-blue-200 max-w-xl mx-auto leading-relaxed">
            ابحث بين السيارات من مختلف المحافظات، وتعرف على السعر والمواصفات والصور في مكان واحد
          </p>
        </div>
      </section>

      {/* 3. المربع العائم للبحث والفلاتر */}
      <div className="max-w-2xl mx-auto -mt-12 relative z-20 px-4 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
          <div className="mb-4 text-right">
            <h2 className="text-base font-extrabold text-gray-900">إبحث عن عربيتك</h2>
            <p className="text-xs text-gray-400">استخدم الفلاتر للوصول لإعلانك</p>
          </div>

          <div className="space-y-3">
            {/* حقل البحث بالاسم */}
            <div className="relative">
              <span className="absolute right-3.5 top-3 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="ماركة أو موديل... (مثلاً BMW)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
              />
            </div>

            {/* الفلاتر المنسدلة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">كل المحافظات</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">كل الشركات</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* زر العرض مع عداد النتائج */}
            <button 
              onClick={() => {}}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              عرض {filteredCars.length} سيارة ←
            </button>
          </div>
        </div>
      </div>

      {/* 4. عرض كروت السيارات */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs text-blue-600 font-bold block">اختيارات اليوم</span>
            <h3 className="text-xl font-bold text-gray-900">سيارات مميزة للبيع</h3>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 font-medium">جاري تحميل السيارات...</div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
            <p className="text-gray-500 text-sm">لا توجد سيارات مطابقة للفلاتر المحددة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCars.map((car) => {
              const img = car.images?.[0] || car.imageUrl;
              return (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* صورة الكارت */}
                    <div className="relative h-44 bg-gray-100">
                      {img ? (
                        <img src={img} alt={car.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">بدون صورة</div>
                      )}
                      <button className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-gray-600 hover:text-red-500 shadow-sm transition">
                        ♡
                      </button>
                      {car.model && (
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {car.model}
                        </span>
                      )}
                    </div>

                    {/* معلومات السيارة */}
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{car.name}</h3>
                      <p className="text-blue-600 font-extrabold text-base mb-3">
                        {car.price} <span className="text-xs font-normal">جنيه</span>
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-center gap-1">🛣️ {car.km || "غير محدد"}</div>
                        <div className="flex items-center justify-center gap-1">📍 {car.location || "غير محدد"}</div>
                        <div className="flex items-center justify-center gap-1">⚙️ أوتوماتيك</div>
                        <div className="flex items-center justify-center gap-1">⛽ بنزين</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}