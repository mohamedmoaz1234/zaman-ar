// @ts-nocheck
"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function ARPage() {
  useEffect(() => {
    // إعدادات الجسم لمنع السكروول والحواف
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";

    // دالة إجبار الفيديو يملأ الشاشة
    const fixVideoSize = () => {
      const video = document.getElementById("arjs-video") as HTMLVideoElement | null;
      if (!video) return;

      video.style.position = "fixed";
      video.style.top = "0";
      video.style.left = "0";
      video.style.width = "100vw";
      video.style.height = "100vh";
      video.style.objectFit = "cover";
      video.style.zIndex = "-1";
    };

    // نحاول كل نص ثانية لأن AR.js ينشئ الفيديو بعد شوية
    const interval = setInterval(fixVideoSize, 500);
    window.addEventListener("resize", fixVideoSize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", fixVideoSize);
      document.body.style.overflow = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      {/* مكتبات A‑Frame + AR.js بنسخ متوافقة */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="beforeInteractive"
      />

      {/* ستايل عام لإجبار الكاميرا فل سكرين ومنع أي أزرار إضافية */}
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

        .a-canvas {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
        }

        .a-enter-vr-button,
        .a-enter-ar-button {
          display: none !important;
        }
      `}</style>

      {/* مشهد الـ AR */}
      <div id="ar-root">
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
        >
          {/* إضاءة */}
          <a-light type="ambient" intensity="1"></a-light>
          <a-light type="directional" intensity="1.5" position="1 1 1"></a-light>

          {/* ماركر Hiro + بوابة زمنية */}
          <a-marker
            preset="hiro"
            smooth="true"
            smoothCount="10"
            smoothTolerance="0.01"
            smoothThreshold="5"
          >
            {/* حلقة خارجية */}
            <a-torus
              position="0 0.5 0"
              rotation="0 0 0"
              radius="1.4"
              radius-tubular="0.05"
              color="#00FFFF"
              material="opacity: 0.9; metalness: 0.8; roughness: 0.2;"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
            ></a-torus>

            {/* حلقة داخلية */}
            <a-torus
              position="0 0.5 0"
              rotation="90 0 0"
              radius="1.0"
              radius-tubular="0.03"
              color="#FFD700"
              material="opacity: 1; metalness: 1; roughness: 0;"
              animation="property: rotation; to: 360 0 0; loop: true; dur: 3500; easing: linear"
            ></a-torus>

            {/* حلقة صغيرة نابضة */}
            <a-torus
              position="0 0.5 0"
              radius="0.6"
              radius-tubular="0.02"
              color="#FFFFFF"
              material="opacity: 0.5; metalness: 0.5;"
              animation="property: scale; dir: alternate; dur: 1000; loop: true; to: 1.15 1.15 1.15"
            ></a-torus>

            {/* نص فوق البوابة */}
            <a-text
              value="ZAMAN GATE"
              position="0 2.2 0"
              align="center"
              color="#FFFFFF"
              scale="2 2 2"
              animation="property: position; dir: alternate; dur: 2000; loop: true; to: 0 2.4 0"
            ></a-text>
          </a-marker>

          {/* الكاميرا */}
          <a-entity camera></a-entity>
        </a-scene>
      </div>
    </>
  );
}


