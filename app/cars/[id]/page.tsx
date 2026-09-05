"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function CarDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string>("");
  const [isFav, setIsFav] = useState(false);

  const PHONE_NUMBER = "01015113347";
  const WA_NUMBER = "201015113347";

  useEffect(() => {
    if (!id) return;

    // فحص المفضلة
    const savedFavs = JSON.parse(localStorage.getItem("egycar_favs") || "[]");
    setIsFav(savedFavs.includes(id));

    const fetchCar = async () => {
      try {
        const docRef = doc(db, "cars", id as string);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setCar({ id: snapshot.id, ...data });
          const mainImg = data.images?.[0] || data.imageUrl || "";
          setSelectedImg(mainImg);
        }
      } catch (err) {
        console.error("Error fetching car details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const toggleFavorite = () => {
    let savedFavs = JSON.parse(localStorage.getItem("egycar_favs") || "[]");
    if (savedFavs.includes(id)) {
      savedFavs = savedFavs.filter((item: string) => item !== id);
      setIsFav(false);
    } else {
      savedFavs.push(id);
      setIsFav(true);
    }
    localStorage.setItem("egycar_favs", JSON.stringify(savedFavs));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold">جاري تحميل التفاصيل...</div>;
  }

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4" dir="rtl">
        <h2 className="text-xl font-bold mb-2">عذراً، السيارة غير موجودة</h2>
        <button onClick={() => router.push("/")} className="text-blue-600 font-bold underline">العودة للرئيسية</button>
      </div>
    );
  }

  const allImages = car.images && car.images.length > 0 ? car.images : car.imageUrl ? [car.imageUrl] : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-28 text-gray-900" dir="rtl">
      {/* Header علوي */}
      <header className="bg-white border-b sticky top-0 z-50 p-4 shadow-sm flex justify-between items-center max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="text-gray-600 font-bold text-sm flex items-center gap-1">
          ← عودة
        </button>
        <span className="font-extrabold text-lg text-blue-600">EgyCar</span>
        <button onClick={toggleFavorite} className="text-2xl">
          {isFav ? "❤️" : "🤍"}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* معرض الصور */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div className="w-full h-72 md:h-96 bg-gray-100 relative">
            {selectedImg ? (
              <img src={selectedImg} alt={car.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">بدون صورة</div>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50 border-t">
              {allImages.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImg(img)}
                  className={`w-20 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${selectedImg === img ? "border-blue-600 scale-95" : "border-transparent opacity-70"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* عنوان السيارة والسعر */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
          <h1 className="text-2xl font-black mb-1">{car.name}</h1>
          <p className="text-blue-600 font-black text-2xl">{car.price} <span className="text-sm font-normal text-gray-500">جنيه</span></p>
        </div>

        {/* المواصفات الأساسية */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">المواصفات والتفاصيل</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block mb-1">الموديل</span>
              <span className="font-bold text-sm">{car.model || "غير محدد"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block mb-1">الكيلومترات</span>
              <span className="font-bold text-sm">{car.km || "غير محدد"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block mb-1">المكان</span>
              <span className="font-bold text-sm">{car.location || "غير محدد"}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block mb-1">الناقل</span>
              <span className="font-bold text-sm">أوتوماتيك</span>
            </div>
          </div>
        </div>

        {/* الوصف */}
        {car.description && (
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">وصف السيارة</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{car.description}</p>
          </div>
        )}
      </main>

      {/* الشريط السفلي الثابت لأزرار التواصل */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto flex gap-3">
          <a
            href={`tel:${PHONE_NUMBER}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center text-sm shadow flex items-center justify-center gap-2 transition"
          >
            📞 اتصل بالبائع
          </a>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`السلام عليكم، استفسار عن سيارة ${car.name} المعروضة بسعر ${car.price} جنيه`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-center text-sm shadow flex items-center justify-center gap-2 transition"
          >
            💬 واتساب
          </a>
        </div>
      </div>
    </div>
  );
}