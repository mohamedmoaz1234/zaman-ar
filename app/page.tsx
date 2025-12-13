"use client";
import { useState } from "react";

type Place = {
  id: string;
  name: string;
  era: string;
  description: string;
  guideName: string;
};

const PLACES: Place[] = [
  {
    id: "diriyah",
    name: "الدرعية التاريخية",
    era: "عام 1744م",
    description: "شاهد بداية الدولة السعودية الأولى وتجول في أسواق الطريف.",
    guideName: "الشيخ محمد بن سعود",
  },
  {
    id: "alula",
    name: "مملكة دادان (العلا)",
    era: "القرن السادس قبل الميلاد",
    description: "استكشف حضارة الأنباط والبيوت المنحوتة في الجبال.",
    guideName: "حارثة بن عمرو",
  },
  {
    id: "old_jeddah",
    name: "جدة التاريخية (البلد)",
    era: "عام 1920م",
    description: "تمشى في حارات جدة القديمة واستمع لأهازيج البحارة.",
    guideName: "العم سالم النخوذة",
  },
];

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<Place>(PLACES[0]); // اخترنا الأول تلقائياً عشان ما تكون الشاشة فاضية

  return (
    // الحاوية الرئيسية: في الجوال تسمح بالسكرول، في الكمبيوتر تثبت الارتفاع
    <div className="flex flex-col h-screen bg-black text-white font-sans overflow-hidden" dir="rtl">
      
      {/* 1. الهيدر ثابت في الكل */}
      <header className="flex-none p-4 border-b border-slate-800 bg-slate-900 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <h1 className="text-xl md:text-2xl font-bold text-yellow-500">
            Zaman AR ⏳
          </h1>
          <span className="text-[10px] md:text-xs bg-yellow-900/30 text-yellow-200 px-2 py-1 rounded-full border border-yellow-700/50">
            نسخة العرض
          </span>
        </div>
      </header>

      {/* 2. جسم الصفحة: مقسوم قسمين (قائمة + محتوى) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* أ) القائمة الجانبية (الأماكن) */}
        {/* في الجوال: تكون شريط أفقي فوق. في الكمبيوتر: قائمة عمودية يمين */}
        <aside className="flex-none md:w-80 bg-slate-900/50 border-b md:border-b-0 md:border-l border-slate-800 z-20 overflow-x-auto md:overflow-y-auto">
          <div className="flex md:flex-col p-2 md:p-4 gap-2 min-w-max md:min-w-0">
            {PLACES.map((place) => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`flex-none w-40 md:w-full text-right p-3 rounded-xl border transition-all duration-200 ${
                  selectedPlace.id === place.id
                    ? "border-yellow-500 bg-yellow-900/20 shadow-lg shadow-yellow-900/10"
                    : "border-slate-700 hover:border-slate-500 bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-sm md:text-lg truncate">{place.name}</div>
                <div className="text-xs text-yellow-500/80 truncate">{place.era}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* ب) منطقة المحتوى (المرشد + زر AR) */}
        {/* قابلة للسكرول عشان لو الشاشة صغيرة يظهر باقي الكلام */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-black via-slate-900 to-black relative">
          <div className="max-w-3xl mx-auto space-y-6 pb-20"> {/* pb-20 عشان زرار الموبايل ما يغطي */}
            
            {/* عنوان ووصف المكان */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-md">
                {selectedPlace.name}
              </h2>
              <p className="text-sm md:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
                {selectedPlace.description}
              </p>
            </div>

            {/* كارت المرشد */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 md:p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-slate-700 pb-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-tr from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg">
                  👳🏽‍♂️
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-xl text-white">{selectedPlace.guideName}</h3>
                  <div className="flex items-center gap-1.5 text-green-400 text-xs md:text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    متصل (AI Guide)
                  </div>
                </div>
              </div>

              {/* الشات */}
              <div className="bg-black/30 rounded-xl p-3 h-32 md:h-40 overflow-y-auto mb-4 border border-slate-700/50 space-y-3">
                <div className="bg-slate-700/80 text-slate-100 p-3 rounded-2xl rounded-tr-none text-sm w-fit ml-auto max-w-[85%]">
                   حياك الله في {selectedPlace.name}.. أنا {selectedPlace.guideName.split(' ')[1]}، اسألني عن تاريخنا؟
                </div>
                <div className="text-center text-[10px] text-slate-500 pt-4">
                  (هنا يظهر رد الذكاء الاصطناعي في النسخة الكاملة)
                </div>
              </div>

              {/* زر AR الكبير */}
              <button
                onClick={() => window.location.href = "/ar"}
                className="w-full py-3 md:py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-base md:text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all"
              >
                <span className="text-xl">🎥</span>
                <span>ابدأ تجربة الواقع المعزز</span>
              </button>
            </div>

            <p className="text-[10px] md:text-xs text-slate-500 text-center px-4">
              * ملاحظة للجنة التحكيم: هذا نموذج أولي (MVP) يوضح تدفق المستخدم.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
