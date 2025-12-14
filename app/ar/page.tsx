// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  // 1) تهيئة الصفحة + تصليح طبقات الفيديو/الكانفس باستمرار
  useEffect(() => {
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.background = "#000";

    const fixLayers = () => {
      const video = document.getElementById("arjs-video") as HTMLVideoElement | null;
      const canvas = document.querySelector("canvas.a-canvas") as HTMLCanvasElement | null;
      const scene = document.querySelector("a-scene") as any;

      // فيديو الكاميرا
      if (video) {
        video.style.position = "fixed";
        video.style.inset = "0";
        video.style.width = "100vw";
        video.style.height = "100vh";
        // مهم: الفيديو لازم يكون ظاهر (مش تحت -1)
        video.style.zIndex = "0";
        video.style.objectFit = "cover";
        video.style.transform = "translateZ(0)";
      }

      // كانفس A-Frame (لازم يكون شفاف فوق الفيديو)
      if (canvas) {
        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.zIndex = "1";
        canvas.style.background = "transparent";
      }

      // تأكيد حجم المشهد
      if (scene) {
        scene.style.position = "fixed";
        scene.style.inset = "0";
        scene.style.width = "100vw";
        scene.style.height = "100vh";
        scene.style.zIndex = "1";
      }
    };

    const it = setInterval(fixLayers, 250);
    window.addEventListener("resize", fixLayers);

    return () => {
      clearInterval(it);
      window.removeEventListener("resize", fixLayers);
      document.body.style.overflow = "";
      document.body.style.background = "";
    };
  }, []);

  // 2) تحميل AR.js بعد اكتمال A‑Frame (ترتيب مضمون)
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
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={onAframeLoad}
      />

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

        /* مهم: استخدم 100dvh لو مدعوم عشان الجوال ما يترك فراغ */
        #ar-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          background: #000;
        }

        /* الفيديو */
        #arjs-video {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          object-fit: cover !important;
          z-index: 0 !important;
        }

        /* الكانفس فوق الفيديو لكن شفاف */
        canvas.a-canvas {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          z-index: 1 !important;
          background: transparent !important;
        }

        a-scene {
          position: fixed !important;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
          z-index: 1 !important;
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
            color: "#003",
            fontFamily: "system-ui",
            zIndex: 9999,
          }}
        >
          Loading AR…
        </div>
      )}

      {libsReady && (
        <div id="ar-root" suppressHydrationWarning>
          <a-scene
            embedded
            // مهم: شفافية خلفية المشهد
            background="transparent: true"
            renderer="alpha: true; antialias: true; logarithmicDepthBuffer: true;"
            arjs="sourceType: webcam; facingMode: environment; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
          >
            <a-light type="ambient" intensity="1"></a-light>
            <a-light type="directional" intensity="1.5" position="1 1 1"></a-light>

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
