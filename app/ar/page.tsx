// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  useEffect(() => {
    // 1) تصفير الهوامش ومنع السكروول
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.documentElement.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.background = "#000";

    // 2) دالة "Cover" حقيقية: تملأ الشاشة بدون فراغات سوداء
    const fixLayers = () => {
      const video = document.getElementById("arjs-video") as HTMLVideoElement | null;
      const canvas = document.querySelector("canvas.a-canvas") as HTMLCanvasElement | null;
      const scene = document.querySelector("a-scene") as any;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // خلي المشهد يغطي الشاشة
      if (scene) {
        scene.style.position = "fixed";
        scene.style.inset = "0";
        scene.style.width = "100vw";
        scene.style.height = "100vh";
        scene.style.zIndex = "1";
      }

      // دالة Cover: تكبر العنصر وتوسّطو عشان يملأ الشاشة
      const cover = (el: HTMLElement, ar: number) => {
        const screenAR = vw / vh;
        let w = vw;
        let h = vh;

        if (ar > screenAR) {
          h = vh;
          w = Math.ceil(vh * ar);
        } else {
          w = vw;
          h = Math.ceil(vw / ar);
        }

        el.style.position = "fixed";
        el.style.left = "50%";
        el.style.top = "50%";
        el.style.transform = "translate(-50%, -50%)";
        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        (el.style as any).objectFit = "cover";
      };

      // الفيديو (الكاميرا)
      if (video) {
        video.style.zIndex = "0";
        video.style.background = "transparent";

        // أهم نقطة: احسب نسبة الأبعاد من الفيديو الحقيقي
        const ar =
          video.videoWidth && video.videoHeight
            ? video.videoWidth / video.videoHeight
            : 16 / 9;
        cover(video, ar);
      }

      // الكانفس (WebGL فوق الفيديو)
      if (canvas) {
        canvas.style.zIndex = "1";
        canvas.style.background = "transparent";

        const ar =
          video && video.videoWidth && video.videoHeight
            ? video.videoWidth / video.videoHeight
            : vw / vh;
        cover(canvas, ar);
      }
    };

    // كرر fixLayers كل 300ms عشان تتأكد الفيديو اتحمل
    const interval = setInterval(fixLayers, 300);
    window.addEventListener("resize", fixLayers);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", fixLayers);
      document.body.style.overflow = "";
      document.body.style.background = "";
    };
  }, []);

  // 3) تحميل AR.js بعد A-Frame بالترتيب
  const onAframeLoad = () => {
    setAframeReady(true);

    if (document.getElementById("arjs-lib")) return;

    const script = document.createElement("script");
    script.id = "arjs-lib";
    script.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    script.onload = () => setArjsReady(true);
    document.head.appendChild(script);
  };

  const libsReady = aframeReady && arjsReady;

  return (
    <>
      {/* تحميل A-Frame 1.2.0 (النسخة المتوافقة) */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={onAframeLoad}
      />

      {/* ستايلات عامة */}
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden !important;
          background: #000;
        }

        #ar-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        #arjs-video {
          position: fixed !important;
          z-index: 0 !important;
          background: transparent !important;
        }

        canvas.a-canvas {
          position: fixed !important;
          z-index: 1 !important;
          background: transparent !important;
        }

        a-scene {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 1 !important;
        }

        .a-enter-vr-button,
        .a-enter-ar-button {
          display: none !important;
        }
      `}</style>

      {/* شاشة تحميل */}
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
            fontSize: "1.5rem",
            zIndex: 9999,
          }}
        >
          <div>جاري تحميل AR...</div>
        </div>
      )}

      {/* مشهد AR بعد جاهزية المكتبات */}
      {libsReady && (
        <div id="ar-root" suppressHydrationWarning>
          <a-scene
            embedded
            background="transparent: true"
            renderer="alpha: true; antialias: true; logarithmicDepthBuffer: true;"
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
          >
            {/* الإضاءة */}
            <a-light type="ambient" intensity="1.2"></a-light>
            <a-light type="directional" intensity="1.5" position="1 1 0"></a-light>

            {/* ماركر Hiro */}
            <a-marker
              preset="hiro"
              smooth="true"
              smoothCount="10"
              smoothTolerance="0.01"
              smoothThreshold="5"
            >
              {/* بوابة زمنية - الحلقة الخارجية */}
              <a-torus
                position="0 0.5 0"
                rotation="0 0 0"
                radius="1.4"
                radius-tubular="0.05"
                color="#00FFFF"
                material="opacity: 0.9; metalness: 0.8; roughness: 0.2;"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"
              ></a-torus>

              {/* بوابة زمنية - الحلقة الوسطى */}
              <a-torus
                position="0 0.5 0"
                rotation="90 0 0"
                radius="1.0"
                radius-tubular="0.03"
                color="#FFD700"
                material="opacity: 1; metalness: 1; roughness: 0;"
                animation="property: rotation; to: 360 0 0; loop: true; dur: 3500; easing: linear"
              ></a-torus>

              {/* بوابة زمنية - الحلقة الداخلية النابضة */}
              <a-torus
                position="0 0.5 0"
                radius="0.6"
                radius-tubular="0.02"
                color="#FFFFFF"
                material="opacity: 0.6; metalness: 0.5;"
                animation="property: scale; dir: alternate; dur: 1000; loop: true; to: 1.15 1.15 1.15"
              ></a-torus>

              {/* النص فوق البوابة */}
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
      )}
    </>
  );
}
