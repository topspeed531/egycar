"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";

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

  const filteredCars = cars.filter((car) =>
    car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      {/* 1. Header العلوي الأبيض */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white font-black text-sm px-2.5 py-1 rounded-lg">EC</div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">EgyCar</span>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <input
              type="text"
              placeholder="عن إيه بتدور؟"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 border-none px-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <Link href="/" className="text-blue-600">الرئيسية</Link>
            <span className="cursor-pointer hover:text-gray-900 flex items-center gap-1">
              ♡ المفضلة
            </span>
            <Link href="/admin" className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition">
              بيع عربية
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. شبكة السيارات */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium">جاري تحميل السيارات...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCars.map((car) => {
              const img = car.images?.[0] || car.imageUrl;
              return (
                <div key={car.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    {/* الصورة والـ Badge */}
                    <div className="relative h-44 bg-gray-100">
                      {img ? (
                        <img src={img} alt={car.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">بدون صورة</div>
                      )}
                      <button className="absolute top-3 left-3 bg-white/80 p-1.5 rounded-full text-gray-600 hover:text-red-500 backdrop-blur-sm shadow-sm">
                        ♡
                      </button>
                      {car.model && (
                        <span className="absolute top-3 right-3 bg-white/90 text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {car.model}
                        </span>
                      )}
                    </div>

                    {/* تفاصيل الكارت */}
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-gray-900 text-base mb-1">{car.name}</h3>
                      <p className="text-blue-600 font-extrabold text-lg mb-3">{car.price} <span className="text-xs font-normal">جنيه</span></p>

                      {/* شبكة المواصفات الأربعة */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-center gap-1">🛣️ {car.km || "كيلومترات"}</div>
                        <div className="flex items-center justify-center gap-1">📍 {car.location || "المكان"}</div>
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

        {/* 3. سكشن التجربة المميزة */}
        <section className="mt-16 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-8">تجربة أوضح من أول بحث لحد البيع</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-bold mb-1">إعلانات منظمة</h4>
              <p className="text-xs text-gray-500">بيانات وأسعار واضحة ومواصفات في مكان واحد</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-bold mb-1">ثقة أعلى</h4>
              <p className="text-xs text-gray-500">تجهيزات للتحقق والتأكد من إعلانات السيارات</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">🎧</div>
              <h4 className="font-bold mb-1">تواصل مباشر</h4>
              <p className="text-xs text-gray-500">أزرار اتصال وواتساب للتسهيل والتواصل مع البائع</p>
            </div>
          </div>
        </section>

        {/* 4. البانر الأزرق في الأسفل */}
        <div className="mt-12 bg-blue-600 text-white rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
          <div>
            <span className="text-xs bg-blue-500 px-2.5 py-1 rounded-full font-medium">EgyCar</span>
            <h3 className="text-xl font-bold mt-2">عايز تبيع عربيتك؟ اعمل إعلانك في دقائق</h3>
            <p className="text-xs text-blue-100 mt-1">أضف الصور والسعر والتفاصيل ليصل إعلانك للمشترين فوراً</p>
          </div>
          <Link href="/admin" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow">
            ابدأ إضافة سيارة
          </Link>
        </div>
      </main>
    </div>
  );
}