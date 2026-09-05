"use client";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // حالات بيانات السيارة التفصيلية
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [km, setKm] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]); // مصفوفة لحفظ أكثر من صورة

  const [editingId, setEditingId] = useState<string | null>(null);
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(collection(db, "cars"), (s) => 
      setCars(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [user]);

  // 🖼️ رفع ورعاية أكثر من صورة من المعرض/الجهاز
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const promises = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Images) => {
      setImages((prev) => [...prev, ...base64Images]);
    });
  };

  // حذف صورة محددة من المعاينة قبل الحفظ
  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err: any) {
      alert(`خطأ في الدخول: ${err.message}`);
    }
  };

  const resetForm = () => {
    setName("");
    setModel("");
    setPrice("");
    setKm("");
    setLocation("");
    setDescription("");
    setImages([]);
    setEditingId(null);
  };

  // ➕ إضافة أو ✏️ تعديل بيانات السيارة
  const handleSubmitCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const carData = {
      name,
      model,
      price,
      km,
      location,
      description,
      images,
      updatedAt: new Date(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "cars", editingId), carData);
      } else {
        await addDoc(collection(db, "cars"), {
          ...carData,
          createdAt: new Date(),
        });
      }
      resetForm();
    } catch (err: any) {
      alert(`حدث خطأ أثناء الحفظ: ${err.message}`);
    }
  };

  const startEditing = (car: any) => {
    setEditingId(car.id);
    setName(car.name || "");
    setModel(car.model || "");
    setPrice(car.price || "");
    setKm(car.km || "");
    setLocation(car.location || "");
    setDescription(car.description || "");
    setImages(car.images || (car.imageUrl ? [car.imageUrl] : []));
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت تأكد من مسح هذه السيارة؟")) {
      await deleteDoc(doc(db, "cars", id));
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 border rounded-lg shadow-lg bg-white" dir="rtl">
        <h2 className="text-xl font-bold mb-4 text-center">تسجيل دخول الأدمن</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input className="border p-2 rounded" type="email" placeholder="الإيميل" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="border p-2 rounded" type="password" placeholder="الباسورد" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold">دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">لوحة إدارة المعرض</h1>
        <button onClick={() => signOut(auth)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold">تسجيل خروج</button>
      </div>

      {/* نموذج الإضافة والتعديل */}
      <form onSubmit={handleSubmitCar} className="flex flex-col gap-4 border p-6 rounded-lg mb-8 bg-gray-50 shadow-sm">
        <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
          {editingId ? "✏️ تعديل بيانات السيارة" : "➕ إضافة سيارة جديدة"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم السيارة:</label>
            <input className="border p-2 rounded w-full bg-white" placeholder="مثال: تويوتا كورولا" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الموديل (السنة):</label>
            <input className="border p-2 rounded w-full bg-white" placeholder="مثال: 2024" value={model} onChange={(e) => setModel(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر (جنيه):</label>
            <input className="border p-2 rounded w-full bg-white" placeholder="مثال: 850,000" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عدد الكيلومترات (KM):</label>
            <input className="border p-2 rounded w-full bg-white" placeholder="مثال: 45,000 كم" value={km} onChange={(e) => setKm(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المكان / المدينة:</label>
          <input className="border p-2 rounded w-full bg-white" placeholder="مثال: القاهرة - نصر سيتي" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">وصف السيارة التفصيلي:</label>
          <textarea className="border p-2 rounded w-full bg-white h-24" placeholder="اكتب تفاصيل الحالة، الدهان، الصيانة..." value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* 🖼️ رفع أكثر من صورة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">🖼️ رفع صور السيارة (يمكنك اختيار أكثر من صورة):</label>
          <input type="file" accept="image/*" multiple onChange={handleImagesUpload} className="border p-2 rounded w-full bg-white cursor-pointer" />
        </div>

        {/* معاينة الصور المرفوعة مع إمكانية مسح أي صورة منها */}
        {images.length > 0 && (
          <div>
            <span className="text-xs text-gray-500 block mb-2">الصور المختارة ({images.length}):</span>
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-20 border rounded overflow-hidden group">
                  <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button type="submit" className={`p-2 rounded text-white font-bold flex-1 ${editingId ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}`}>
            {editingId ? "حفظ التعديلات" : "إضافة السيارة"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded font-bold">
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* قائمة السيارات المتاحة */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800">السيارات المتاحة ({cars.length})</h2>
        {cars.map((car) => (
          <div key={car.id} className="flex justify-between items-center border p-4 rounded-lg shadow-sm bg-white hover:shadow transition">
            <div className="flex items-center gap-4">
              {car.images && car.images.length > 0 ? (
                <div className="relative">
                  <img src={car.images[0]} alt={car.name} className="w-24 h-20 object-cover rounded border" />
                  {car.images.length > 1 && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      +{car.images.length - 1}
                    </span>
                  )}
                </div>
              ) : car.imageUrl ? (
                <img src={car.imageUrl} alt={car.name} className="w-24 h-20 object-cover rounded border" />
              ) : (
                <div className="w-24 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">بدون صور</div>
              )}

              <div>
                <h3 className="font-bold text-lg text-gray-800">{car.name} ({car.model})</h3>
                <p className="text-green-700 font-bold">{car.price} جنيه</p>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>🛣️ {car.km}</span>
                  <span>📍 {car.location}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => startEditing(car)} className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded font-semibold text-sm">
                ✏️ تعديل
              </button>
              <button onClick={() => handleDelete(car.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold text-sm">
                🗑️ مسح
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}