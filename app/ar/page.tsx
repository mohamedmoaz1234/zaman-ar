// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  useEffect(() => {
    // 1) تنظيف تام
    const root = document.documentElement;
    root.style.margin = "0";
    root.style.padding = "0";
    root.style.height = "100%";
    root.style.overflow = "hidden";
    
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";

    const fixLayout = () => {
      const video = document.getElementById("arjs-video") as HTMLVideoElement | null;
      const canvas = document.querySelector("canvas.a-canvas") as HTMLCanvasElement | null;
      const scene = document.querySelector("a-scene") as HTMLElement | null;

      // 2) التكبير الإجباري (Scale)
      // بدل ما نحاول نضبط العرض والطول، نكبر العنصر زيادة (1.5x) ونوسّطه
      // كأننا بنعمل "زوم" في الصورة عشان نغطي الحواف السوداء
      const scaleFactor = "scale(1.5)"; 

      if (video) {
        // فك الفيديو من أي حاوية مزعجة
        if (video.parentElement && video.parentElement.tagName !== "BODY") {
           document.body.appendChild(video);
        }
        
        video.style.position = "fixed";
        video.style.left = "50%";
        video.style.top = "50%";
        video.style.minWidth = "100vw";
        video.style.minHeight = "100vh";
        // التحيلة الذكية: كبّر الفيديو ووسّطه
        video.style.transform = `translate(-50%, -50%) ${scaleFactor}`;
        video.style.objectFit = "cover";
        video.style.zIndex = "0";
      }

      if (canvas) {
        canvas.style.position = "fixed";
        canvas.style.left = "50%";
        canvas.style.top = "50%";
        canvas.style.minWidth = "100vw";
        canvas.style.minHeight = "100vh";
        // طبق نفس التكبير على المجسم عشان ينطبقوا على بعض
        canvas.style.transform = `translate(-50%, -50%) ${scaleFactor}`;
        canvas.style.zIndex = "1";
      }

      if (scene) {
        scene.style.position = "fixed";
        (scene.style as any).inset = "0";
        scene.style.zIndex = "1";
      }
    };

    const it = setInterval(fixLayout, 200);
    window.addEventListener("resize", fixLayout);

    return () => {
      clearInterval(it);
      window.removeEventListener("resize", fixLayout);
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const onAframeLoad = () => {
    setAframeReady(true);
    if (document.getElementById("arjs-lib")) return;
    const s = document.createElement("script");
    s.id = "arjs-lib";
    // نستخدم رابط CDN جديد وموثوق أحياناً يكون أسرع
    s.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    s.onload = () => setArjsReady(true);
    document.head.appendChild(s);
  };

  const libsReady = aframeReady && arjsReady;

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={onAframeLoad}
      />

      <style jsx global>{`
        /* ضمان عدم ظهور سكرول بار بسبب التكبير */
        html, body {
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          background: #000;
        }
        #arjs-video, canvas.a-canvas {
          max-width: none !important;
          max-height: none !important;
        }
        .a-enter-vr-button, .a-enter-ar-button {
          display: none !important;
        }
      `}</style>

      {libsReady && (
        <div suppressHydrationWarning>
          <a-scene
            embedded
            background="transparent: true"
            renderer="alpha: true; antialias: true; logarithmicDepthBuffer: true;"
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
          >
            <a-light type="ambient" intensity="1.2"></a-light>
            <a-light type="directional" intensity="1.5" position="1 1 0"></a-light>

            {/* تم تصغير حجم المجسم قليلاً عشان يتناسب مع الزوم */}
            <a-marker preset="hiro" smooth="true" smoothCount="10" smoothTolerance="0.01" smoothThreshold="5">
              
              <a-torus
                position="0 0.5 0"
                radius="0.8" 
                radius-tubular="0.03"
                color="#00FFFF"
                material="opacity: 0.9; metalness: 0.8; roughness: 0.2;"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
              ></a-torus>

              <a-torus
                position="0 0.5 0"
                rotation="90 0 0"
                radius="0.6"
                radius-tubular="0.02"
                color="#FFD700"
                material="opacity: 1; metalness: 1; roughness: 0;"
                animation="property: rotation; to: 360 0 0; loop: true; dur: 3500; easing: linear"
              ></a-torus>

              <a-text value="ZAMAN GATE" position="0 1.5 0" align="center" color="#FFFFFF" scale="1.5 1.5 1.5"></a-text>

            </a-marker>
            <a-entity camera></a-entity>
          </a-scene>
        </div>
      )}
    </>
  );
}
