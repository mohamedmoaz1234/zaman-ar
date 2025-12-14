// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  useEffect(() => {
    // صفّر الصفحة
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.background = "#000";

    const fixARView = () => {
      const video = document.getElementById("arjs-video") as HTMLVideoElement | null;
      const canvas = document.querySelector("canvas.a-canvas") as HTMLCanvasElement | null;

      if (!video || !canvas) return;

      // 1) نختار الحاوية (غالباً هي parent للفيديو)
      let container = video.parentElement as HTMLElement | null;
      if (!container) return;

      // 2) إذا الـ canvas ما داخل نفس الحاوية، ندخلو جوّاها (عشان ينطبق عليهم نفس التحجيم)
      // هذا هو سبب مشكلة "يمين/يسار" غالباً: عنصرين في حاويتين مختلفات [web:243]
      if (canvas.parentElement !== container) {
        try {
          container.appendChild(canvas);
        } catch (e) {
          // لو فشل النقل لأي سبب، نكمل بدون كسر الصفحة
        }
      }

      // 3) حساب مقاس "Cover" للحاوية نفسها (عشان يملا الشاشة بدون فراغ)
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const videoAR =
        video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
      const screenAR = vw / vh;

      let W = vw;
      let H = vh;

      if (videoAR > screenAR) {
        // الفيديو أعرض: نخلي الارتفاع يملأ ونقص من الجنب
        H = vh;
        W = Math.ceil(vh * videoAR);
      } else {
        // الفيديو أضيق: نخلي العرض يملأ ونقص من فوق/تحت
        W = vw;
        H = Math.ceil(vw / videoAR);
      }

      // 4) ثبّت الحاوية في وسط الشاشة وبالمقاس الجديد
      container.style.position = "fixed";
      container.style.left = "50%";
      container.style.top = "50%";
      container.style.transform = "translate(-50%, -50%)";
      container.style.width = `${W}px`;
      container.style.height = `${H}px`;
      container.style.margin = "0";
      container.style.padding = "0";
      container.style.overflow = "hidden";
      container.style.background = "transparent";
      container.style.zIndex = "0";

      // 5) خلي الفيديو يملأ الحاوية (بدون أي transform قديم)
      video.style.position = "absolute";
      video.style.left = "0";
      video.style.top = "0";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.style.transform = "none";
      video.style.zIndex = "0";
      video.setAttribute("playsinline", "true");

      // 6) خلي الـ canvas يملأ الحاوية وفوق الفيديو
      canvas.style.position = "absolute";
      canvas.style.left = "0";
      canvas.style.top = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.background = "transparent";
      canvas.style.zIndex = "1";
    };

    const it = setInterval(fixARView, 200);
    window.addEventListener("resize", fixARView);

    return () => {
      clearInterval(it);
      window.removeEventListener("resize", fixARView);
      document.body.style.overflow = "";
      document.body.style.background = "";
    };
  }, []);

  // تحميل AR.js بعد A-Frame (ترتيب ثابت)
  const onAframeLoad = () => {
    setAframeReady(true);

    if (document.getElementById("arjs-lib")) return;
    const s = document.createElement("script");
    s.id = "arjs-lib";
    s.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    s.onload = () => setArjsReady(true);
    document.head.appendChild(s);
  };

  const libsReady = aframeReady && arjsReady;

  return (
    <>
      {/* A-Frame نسخة متوافقة */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={onAframeLoad}
      />

      <style jsx global>{`
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          overflow: hidden !important;
          background: #000 !important;
        }

        /* نخفي أزرار VR/AR */
        .a-enter-vr-button,
        .a-enter-ar-button {
          display: none !important;
        }

        /* نخلي المشهد نفسه “موجود” لكن ما يفرض مقاسات */
        a-scene {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: transparent !important;
          z-index: 0 !important;
        }
      `}</style>

      {!libsReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "#0bb4e4",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
            zIndex: 9999,
          }}
        >
          جاري تحميل AR...
        </div>
      )}

      {libsReady && (
        <div suppressHydrationWarning>
          <a-scene
            embedded
            background="transparent: true"
            renderer="alpha: true; antialias: true;"
            arjs="sourceType: webcam; facingMode: environment; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
          >
            <a-light type="ambient" intensity="1.2"></a-light>
            <a-light type="directional" intensity="1.5" position="1 1 0"></a-light>

            <a-marker preset="hiro" smooth="true" smoothCount="10" smoothTolerance="0.01" smoothThreshold="5">
              <a-torus
                position="0 0.5 0"
                radius="1.4"
                radius-tubular="0.05"
                color="#00FFFF"
                material="opacity: 0.9; metalness: 0.8; roughness: 0.2;"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
              ></a-torus>

              <a-torus
                position="0 0.5 0"
                rotation="90 0 0"
                radius="1.0"
                radius-tubular="0.03"
                color="#FFD700"
                material="opacity: 1; metalness: 1; roughness: 0;"
                animation="property: rotation; to: 360 0 0; loop: true; dur: 3500; easing: linear"
              ></a-torus>

              <a-text value="ZAMAN GATE" position="0 2.2 0" align="center" color="#FFFFFF" scale="2 2 2"></a-text>
            </a-marker>

            <a-entity camera></a-entity>
          </a-scene>
        </div>
      )}
    </>
  );
}
