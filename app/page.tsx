"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function HomePage() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // المزامنة اللحظية مع قاعدة البيانات Firestore
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
    return <div className="text-center py-20 text-gray-500">جاري تحميل السيارات...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">معرض السيارات المتاحة</h1>

      {cars.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 text-lg">لا توجد سيارات متاحة حالياً في المعرض.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="border rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
              {/* عرض الصورة الأولى للسيارة */}
              {car.images && car.images.length > 0 ? (
                <img src={car.images[0]} alt={car.name} className="w-full h-48 object-cover" />
              ) : car.imageUrl ? (
                <img src={car.imageUrl} alt={car.name} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">بدون صورة</div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{car.name}</h2>
                  {car.model && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">
                      {car.model}
                    </span>
                  )}
                </div>

                <p className="text-green-700 font-bold text-lg mb-3">{car.price} جنيه</p>

                <div className="flex justify-between text-xs text-gray-500 border-t pt-2 mb-2">
                  <span>🛣️ {car.km || "غير محدد"}</span>
                  <span>📍 {car.location || "غير محدد"}</span>
                </div>

                {car.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2 bg-gray-50 p-2 rounded">
                    {car.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}