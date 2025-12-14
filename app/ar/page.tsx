// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  // ضبط صفحة العرض ومنع الحواف والسكروول
  useEffect(() => {
    const root = document.documentElement;
    root.style.margin = "0";
    root.style.padding = "0";
    root.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";

    // إجبار فيديو الكاميرا يملأ الشاشة دائماً
    const fixVideoSize = () => {
      const v = document.getElementById("arjs-video") as HTMLVideoElement | null;
      if (!v) return;
      v.style.position = "fixed";
      v.style.inset = "0";
      v.style.width = "100vw";
      v.style.height = "100vh";
      v.style.objectFit = "cover";
      v.style.zIndex = "-1";
      v.setAttribute("width", String(window.innerWidth));
      v.setAttribute("height", String(window.innerHeight));
    };
    const it = setInterval(fixVideoSize, 500);
    window.addEventListener("resize", fixVideoSize);

    return () => {
      clearInterval(it);
      window.removeEventListener("resize", fixVideoSize);
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  // بعد تحميل A‑Frame: حقن AR.js يدوياً ثم تفعيل الجاهزية بالتسلسل
  const onAframeLoad = () => {
    setAframeReady(true);
    if (document.getElementById("arjs-lib")) return;
    const s = document.createElement("script");
    s.id = "arjs-lib";
    s.src =
      "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    s.onload = () => setArjsReady(true);
    document.head.appendChild(s);
  };

  const libsReady = aframeReady && arjsReady;

  return (
    <>
      {/* 1) نثبت نسخة A‑Frame المتوافقة مع AR.js */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={onAframeLoad}
      />

      {/* 2) ستايل عام لإجبار ملء الشاشة وإخفاء أزرار VR */}
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #000;
        }
        #ar-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
        }
        .a-canvas,
        #arjs-video,
        video {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          object-fit: cover !important;
        }
        .a-enter-vr-button,
        .a-enter-ar-button {
          display: none !important;
        }
      `}</style>

      {/* 3) واجهة تحميل بسيطة لتفادي أخطاء الهيدرشن */}
      {!libsReady && (
        <div
          suppressHydrationWarning
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "#0bb4e4",
            color: "#003",
            fontFamily: "system-ui",
          }}
        >
          <div>Loading AR…</div>
        </div>
      )}

      {/* 4) لا نرسم مشهد A‑Frame إلا بعد جاهزية المكتبات 100% */}
      {libsReady && (
        <div id="ar-root" suppressHydrationWarning>
          <a-scene
            embedded
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
          >
            <a-light type="ambient" intensity="1"></a-light>
            <a-light type="directional" intensity="1.5" position="1 1 1"></a-light>

            <a-marker
              preset="hiro"
              smooth="true"
              smoothCount="10"
              smoothTolerance="0.01"
              smoothThreshold="5"
            >
              <a-torus
                position="0 0.5 0"
                rotation="0 0 0"
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

              <a-torus
                position="0 0.5 0"
                radius="0.6"
                radius-tubular="0.02"
                color="#FFFFFF"
                material="opacity: 0.5; metalness: 0.5;"
                animation="property: scale; dir: alternate; dur: 1000; loop: true; to: 1.15 1.15 1.15"
              ></a-torus>

              <a-text
                value="ZAMAN GATE"
                position="0 2.2 0"
                align="center"
                color="#FFFFFF"
                scale="2 2 2"
                animation="property: position; dir: alternate; dur: 2000; loop: true; to: 0 2.4 0"
              ></a-text>
            </a-marker>

            <a-entity camera></a-entity>
          </a-scene>
        </div>
      )}
    </>
  );
}
