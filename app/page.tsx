"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cars"), (snapshot) => {
      const carList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-bold text-gray-600 animate-pulse">جاري تحميل المعرض...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      {/* الهيدر العلوي */}
      <header className="bg-white border-b shadow-sm py-5 mb-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">معرض السيارات المتاحة</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">تصفح أحدث السيارات المضافة للبيع</p>
          </div>
          <a 
            href="/admin" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
          >
            لوحة التحكم ⚙️
          </a>
        </div>
      </header>

      {/* حاوي الكروت الرئيسي */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {cars.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="text-4xl mb-3">🚗</div>
            <h3 className="text-xl font-bold text-gray-700">لا توجد سيارات متاحة حالياً</h3>
            <p className="text-gray-500 text-sm mt-1">قم بإضافة سيارات جديدة من لوحة التحكم لتظهر هنا.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const displayImg = (car.images && car.images.length > 0) ? car.images[0] : car.imageUrl;

              return (
                <div 
                  key={car.id} 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* صورة السيارة */}
                    <div className="relative w-full h-48 bg-gray-100 border-b overflow-hidden">
                      {displayImg ? (
                        <img 
                          src={displayImg} 
                          alt={car.name} 
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                          بدون صورة
                        </div>
                      )}

                      {/* شارة الموديل */}
                      {car.model && (
                        <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {car.model}
                        </span>
                      )}

                      {/* شارة عدد الصور */}
                      {car.images && car.images.length > 1 && (
                        <span className="absolute bottom-3 left-3 bg-blue-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded-md">
                          📷 {car.images.length} صور
                        </span>
                      )}
                    </div>

                    {/* تفاصيل السيارة */}
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{car.name}</h2>
                      
                      {/* السعر */}
                      <div className="text-xl font-black text-green-600 mb-3">
                        {car.price} <span className="text-xs font-bold text-gray-600">جنيه</span>
                      </div>

                      {/* المواصفات السريعة */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mb-3">
                        <div className="flex items-center gap-1">
                          <span>🛣️</span>
                          <span>{car.km ? `${car.km}` : "غير محدد"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span className="truncate">{car.location || "غير محدد"}</span>
                        </div>
                      </div>

                      {/* الوصف */}
                      {car.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {car.description}
                        </p>
                      )}
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