// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARRealPage() {
  const [arReady, setArReady] = useState(false);

  return (
    <div className="bg-black min-h-screen overflow-hidden relative">
      {/* 1. تحميل مكتبات AR.js و A-Frame */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        onLoad={() => console.log("A-Frame Loaded")}
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        onLoad={() => {
          console.log("AR.js Loaded");
          setArReady(true);
        }}
      />

      {/* 2. زر رجوع وزر إرشادات */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <a
          href="/"
          className="pointer-events-auto bg-black/50 text-white px-4 py-2 rounded-full text-xs border border-white/20 backdrop-blur-md"
        >
          ⬅ خروج
        </a>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-50 text-center pointer-events-none">
        <div className="bg-black/60 text-yellow-400 inline-block px-4 py-2 rounded-lg text-sm backdrop-blur-md border border-yellow-500/30">
           وجه الكاميرا نحو علامة "HIRO" 🔳
        </div>
      </div>

      {/* 3. مشهد الواقع المعزز */}
      {arReady && (
        // @ts-ignore
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true;"
        >
          {/* الإضاءة */}
          {/* @ts-ignore */}
          <a-light type="ambient" color="#fff" intensity="1.2" />
          
          {/* 
            الماركر (Marker): الصورة التي سيبحث عنها الكاميرا.
            نستخدم 'hiro' وهو الماركر الافتراضي المشهور.
          */}
          {/* @ts-ignore */}
          <a-marker preset="hiro">
            
            {/* هنا المجسم الذي سيظهر فوق الماركر */}
            {/* مكعب أصفر يلف */}
            {/* @ts-ignore */}
            <a-box 
              position="0 0.5 0" 
              material="color: yellow; opacity: 0.8; transparent: true;"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
            >
            </a-box>

            {/* نص يطفو فوق المكعب */}
            {/* @ts-ignore */}
            <a-text
              value="Zaman AR"
              position="0 1.5 0"
              align="center"
              color="#fff"
              scale="2 2 2"
            ></a-text>

          </a-marker>

          {/* الكاميرا */}
          {/* @ts-ignore */}
          <a-entity camera></a-entity>
        </a-scene>
      )}
    </div>
  );
}
