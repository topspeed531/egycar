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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-semibold animate-pulse">جاري تحميل السيارات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800" dir="rtl">
      {/* الهيدر الرئيسي للموقع */}
      <header className="bg-slate-900 text-white py-8 px-4 text-center shadow-md">
        <h1 className="text-3xl font-extrabold tracking-wide">EgyCar Marketplace</h1>
        <p className="text-slate-400 text-sm mt-2">تصفح أحدث السيارات المعروضة للبيع</p>
      </header>

      {/* شبكة عرض السيارات */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {cars.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-500">لا توجد سيارات معروضة حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const displayImg = (car.images && car.images.length > 0) ? car.images[0] : car.imageUrl;
              
              return (
                <div 
                  key={car.id} 
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200 flex flex-col justify-between"
                >
                  <div>
                    {/* صورة السيارة */}
                    <div className="w-full h-48 bg-gray-200 relative">
                      {displayImg ? (
                        <img src={displayImg} alt={car.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">بدون صورة</div>
                      )}
                      
                      {car.model && (
                        <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                          {car.model}
                        </span>
                      )}
                    </div>

                    {/* تفاصيل السيارة */}
                    <div className="p-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{car.name}</h2>
                      <p className="text-emerald-600 font-black text-xl mb-3">
                        {car.price} <span className="text-xs font-normal text-gray-500">جنيه</span>
                      </p>

                      <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-3">
                        <span>🛣️ {car.km || "غير محدد"}</span>
                        <span>📍 {car.location || "غير محدد"}</span>
                      </div>

                      {car.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
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