"use client";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // الفلاتر
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    // جلب المفضلة من LocalStorage
    const savedFavs = JSON.parse(localStorage.getItem("egycar_favs") || "[]");
    setFavorites(savedFavs);

    const unsubscribe = onSnapshot(collection(db, "cars"), (snapshot) => {
      setCars(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = (e: React.MouseEvent, carId: string) => {
    e.stopPropagation(); // منع الانتقال لصفحة التفاصيل عند الضغط على القلب
    let updated = [...favorites];
    if (updated.includes(carId)) {
      updated = updated.filter((id) => id !== carId);
    } else {
      updated.push(carId);
    }
    setFavorites(updated);
    localStorage.setItem("egycar_favs", JSON.stringify(updated));
  };

  const brands = useMemo(() => Array.from(new Set(cars.map((c) => c.name?.split(" ")[0]).filter(Boolean))), [cars]);
  const locations = useMemo(() => Array.from(new Set(cars.map((c) => c.location).filter(Boolean))), [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesSearch = !searchTerm || car.name?.toLowerCase().includes(searchTerm.toLowerCase()) || car.model?.toString().includes(searchTerm);
      const matchesBrand = !selectedBrand || car.name?.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesLocation = !selectedLocation || car.location === selectedLocation;
      return matchesSearch && matchesBrand && matchesLocation;
    });
  }, [cars, searchTerm, selectedBrand, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="bg-blue-600 text-white font-black text-sm px-2.5 py-1 rounded-lg">EC</div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight block leading-none">EgyCar</span>
              <span className="text-[10px] text-gray-400 font-medium">سوق السيارات في مصر</span>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 px-3 py-1.5 rounded-lg bg-gray-100">
              ❤️ <span className="text-xs font-bold text-blue-600">{favorites.length}</span>
            </div>
            <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition">
              🚘 بيع عربية
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white pt-10 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-blue-700/60 text-blue-200 text-xs px-3 py-1 rounded-full mb-3 border border-blue-500/30">سوق السيارات في مصر</span>
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">بيع واشتري عربيتك <br /> بثقة وبأفضل سعر</h1>
          <p className="text-xs md:text-sm text-blue-200 max-w-xl mx-auto">ابحث بين السيارات من مختلف المحافظات وتعرف على الأسعار والتفاصيل</p>
        </div>
      </section>

      {/* البحث والفلاتر */}
      <div className="max-w-2xl mx-auto -mt-12 relative z-20 px-4 mb-10">
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 space-y-3">
          <h2 className="text-base font-extrabold text-gray-900">إبحث عن عربيتك</h2>
          <input
            type="text"
            placeholder="ماركة أو موديل... (مثلاً BMW)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold">
              <option value="">كل المحافظات</option>
              {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold">
              <option value="">كل الشركات</option>
              {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm shadow-md">عرض {filteredCars.length} سيارة ←</button>
        </div>
      </div>

      {/* الكروت */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-16 text-gray-400">جاري تحميل السيارات...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredCars.map((car) => {
              const img = car.images?.[0] || car.imageUrl;
              const isFav = favorites.includes(car.id);

              return (
                <div
                  key={car.id}
                  onClick={() => router.push(`/cars/${car.id}`)}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-44 bg-gray-100">
                      {img ? <img src={img} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">بدون صورة</div>}
                      
                      <button
                        onClick={(e) => toggleFavorite(e, car.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-md transition ${isFav ? "bg-red-500 text-white" : "bg-white/90 text-gray-600 hover:text-red-500"}`}
                      >
                        {isFav ? "❤️" : "🤍"}
                      </button>

                      {car.model && <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">{car.model}</span>}
                    </div>

                    <div className="p-4 text-center">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{car.name}</h3>
                      <p className="text-blue-600 font-extrabold text-base mb-3">{car.price} <span className="text-xs font-normal">جنيه</span></p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div>🛣️ {car.km || "غير محدد"}</div>
                        <div>📍 {car.location || "غير محدد"}</div>
                        <div>⚙️ أوتوماتيك</div>
                        <div>⛽ بنزين</div>
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