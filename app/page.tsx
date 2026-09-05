"use client";
import { useState, useEffect, useMemo } from "react";
import { db, auth, googleProvider } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // حالة حساب الزائر (تسجيل الدخول)
  const [user, setUser] = useState<User | null>(null);

  // تفعيل فلتر المفضلة
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // الفلاتر
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const WA_NUMBER = "201015113347";

  useEffect(() => {
    // متابعة حالة تسجيل الدخول للزائر
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // جلب المفضلة من LocalStorage
    const savedFavs = JSON.parse(localStorage.getItem("egycar_favs") || "[]");
    setFavorites(savedFavs);

    const unsubscribeDb = onSnapshot(collection(db, "cars"), (snapshot) => {
      setCars(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  // دالة تسجيل الدخول بحساب جوجل
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
    }
  };

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("خطأ في تسجيل الخروج:", error);
    }
  };

  const toggleFavorite = (e: React.MouseEvent, carId: string) => {
    e.stopPropagation();
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
      const matchesFav = !showFavoritesOnly || favorites.includes(car.id);
      const matchesSearch = !searchTerm || car.name?.toLowerCase().includes(searchTerm.toLowerCase()) || car.model?.toString().includes(searchTerm);
      const matchesBrand = !selectedBrand || car.name?.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesLocation = !selectedLocation || car.location === selectedLocation;
      return matchesFav && matchesSearch && matchesBrand && matchesLocation;
    });
  }, [cars, favorites, showFavoritesOnly, searchTerm, selectedBrand, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setShowFavoritesOnly(false); router.push("/"); }}>
            <div className="bg-blue-600 text-white font-black text-sm px-2.5 py-1 rounded-lg">EC</div>
            <div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight block leading-none">EgyCar</span>
              <span className="text-[10px] text-gray-400 font-medium">سوق السيارات في مصر</span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            {/* تسجيل دخول الزوار */}
            {user ? (
              <div className="flex items-center gap-2 bg-gray-100 p-1 pl-3 rounded-xl">
                {user.photoURL && (
                  <img src={user.photoURL} alt="User" className="w-7 h-7 rounded-full border border-blue-500" />
                )}
                <span className="text-xs font-bold text-gray-700 hidden sm:inline">{user.displayName?.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="text-[11px] text-red-500 hover:underline font-bold mr-1"
                >
                  خروج
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                👤 <span className="hidden sm:inline">تسجيل الدخول</span>
              </button>
            )}

            {/* زر المفضلة */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl transition shadow-sm border ${
                showFavoritesOnly
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
              }`}
            >
              ❤️ <span className="hidden sm:inline">المفضلة</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${showFavoritesOnly ? "bg-white text-red-600" : "bg-red-500 text-white"}`}>
                {favorites.length}
              </span>
            </button>

            {/* زر بيع عربيتك - يوجه للواتساب مباشرة */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("السلام عليكم، أرغب في إضافة سيارتي للبيع على الموقع")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
            >
              🚗 بيع عربيتك
            </a>

            {/* زر Admin */}
            <Link
              href="/admin"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
            >
              🔑 Admin
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
      <div className="max-w-2xl mx-auto -mt-12 relative z-20 px-4 mb-8">
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

      {/* المعرض */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs text-blue-600 font-bold block">
              {showFavoritesOnly ? "تصفح المحفوظات" : "اختيارات اليوم"}
            </span>
            <h3 className="text-xl font-bold text-gray-900">
              {showFavoritesOnly ? "❤️ السيارات المفضلة لديك" : "سيارات مميزة للبيع"}
            </h3>
          </div>
          {showFavoritesOnly && (
            <button onClick={() => setShowFavoritesOnly(false)} className="text-xs text-blue-600 font-bold underline">
              عرض كل السيارات
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">جاري تحميل السيارات...</div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-6">
            <p className="text-gray-500 font-medium text-sm">
              {showFavoritesOnly ? "لم تقم بإضافة أي سيارة للمفضلة بعد." : "لا توجد سيارات مطابقة للفلاتر المحددة."}
            </p>
          </div>
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