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
    return <div className="text-center py-20 text-gray-500">جاري التحميل...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto my-10 p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-center">معرض السيارات المتاحة</h1>

      {cars.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد سيارات متاحة حالياً.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cars.map((car) => {
            const img = (car.images && car.images.length > 0) ? car.images[0] : car.imageUrl;
            return (
              <div key={car.id} className="border rounded-lg p-4 shadow bg-white flex flex-col justify-between">
                <div>
                  {img ? (
                    <img src={img} alt={car.name} className="w-full h-48 object-cover rounded mb-3" />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">بدون صورة</div>
                  )}
                  <h2 className="text-xl font-bold">{car.name} {car.model ? `(${car.model})` : ''}</h2>
                  <p className="text-green-600 font-bold text-lg my-1">{car.price} جنيه</p>
                  
                  <div className="flex gap-4 text-sm text-gray-500 my-2">
                    {car.km && <span>🛣️ {car.km}</span>}
                    {car.location && <span>📍 {car.location}</span>}
                  </div>

                  {car.description && (
                    <p className="text-sm text-gray-600 border-t pt-2 mt-2">{car.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}