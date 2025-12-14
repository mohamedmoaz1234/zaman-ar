// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  useEffect(() => {
    // منع أي هوامش/سكرول
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.background = "#000";

    const forceFullscreenLayers = () => {
      const video = document.getElementById("arjs-video") as HTMLVideoElement | null;
      const videoWrap = (video?.parentElement as HTMLElement | null) ?? null;
      const canvas = document.querySelector("canvas.a-canvas") as HTMLCanvasElement | null;
      const scene = document.querySelector("a-scene") as HTMLElement | null;

      // 1) إصلاح الحاوية التي AR.js يضع فيها transform/scale (المشكلة الأساسية في الجوال)
      if (videoWrap) {
        videoWrap.style.position = "fixed";
        videoWrap.style.left = "0";
        videoWrap.style.top = "0";
        videoWrap.style.width = "100vw";
        videoWrap.style.height = "100vh";
        // إلغاء أي تمركز/تحجيم من AR.js
        videoWrap.style.transform = "none";
        videoWrap.style.margin = "0";
        videoWrap.style.padding = "0";
        videoWrap.style.zIndex = "0";
        videoWrap.style.background = "transparent";
      }

      // 2) الفيديو داخل الحاوية: يملأ ويقص الزوائد
      if (video) {
        video.style.position = "absolute";
        video.style.left = "0";
        video.style.top = "0";
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        // إلغاء أي transform على الفيديو نفسه
        video.style.transform = "none";
        video.style.zIndex = "0";
        video.style.background = "transparent";
        // بعض الأجهزة تحتاج attributes
        video.setAttribute("playsinline", "true");
      }

      // 3) كانفس A-Frame فوق الفيديو
      if (canvas) {
        canvas.style.position = "fixed";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.zIndex = "1";
        canvas.style.background = "transparent";
      }

      // 4) المشهد نفسه يغطي الشاشة
      if (scene) {
        scene.style.position = "fixed";
        (scene.style as any).inset = "0";
        scene.style.width = "100vw";
        scene.style.height = "100vh";
        scene.style.zIndex = "1";
      }
    };

    // كرر لفترة لأن الفيديو/الحاوية تتولد بعد ثواني من بدء AR.js
    const it = setInterval(forceFullscreenLayers, 200);
    window.addEventListener("resize", forceFullscreenLayers);

    // بعد 8 ثواني خفف الضغط (خليه مرة واحدة كل ثانية)
    const relax = setTimeout(() => {
      clearInterval(it);
      const it2 = setInterval(forceFullscreenLayers, 1000);
      (window as any).__ar_fix_it2 = it2;
    }, 8000);

    return () => {
      clearInterval(it);
      clearTimeout(relax);
      if ((window as any).__ar_fix_it2) clearInterval((window as any).__ar_fix_it2);
      window.removeEventListener("resize", forceFullscreenLayers);
      document.body.style.overflow = "";
      document.body.style.background = "";
    };
  }, []);

  // تحميل AR.js بعد A‑Frame بالترتيب
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
      {/* A‑Frame نسخة متوافقة مع AR.js */}
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

        /* حماية إضافية: لا تخلي أي شيء يطلع برا الشاشة */
        #ar-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        /* نخلي الكانفس دايماً فوق */
        canvas.a-canvas {
          z-index: 1 !important;
          background: transparent !important;
        }

        .a-enter-vr-button,
        .a-enter-ar-button {
          display: none !important;
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
        <div id="ar-root" suppressHydrationWarning>
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

              <a-text
                value="ZAMAN GATE"
                position="0 2.2 0"
                align="center"
                color="#FFFFFF"
                scale="2 2 2"
              ></a-text>
            </a-marker>

            <a-entity camera></a-entity>
          </a-scene>
        </div>
      )}
    </>
  );
}
