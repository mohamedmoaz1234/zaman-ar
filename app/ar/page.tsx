// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [aframeReady, setAframeReady] = useState(false);
  const [arjsReady, setArjsReady] = useState(false);

  useEffect(() => {
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

      if (video) {
        // الحل الأساسي لمشكلة التقريب: نخلي الفيديو بحجمه الفعلي
        // بدون ما AR.js يعدّل عليه (تكبير/تصغير)
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        video.style.position = "fixed";
        video.style.left = "0";
        video.style.top = "0";
        video.style.width = "100vw";
        video.style.height = "100vh";
        video.style.objectFit = "cover";
        video.style.zIndex = "0";
        video.style.transform = "none"; // لا تقريب ولا تحريك

        // اجبر الفيديو يشتغل كامل الشاشة
        video.setAttribute("width", String(vw));
        video.setAttribute("height", String(vh));
      }

      if (canvas) {
        canvas.style.position = "fixed";
        canvas.style.left = "0";
        canvas.style.top = "0";
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
        canvas.style.zIndex = "1";
        canvas.style.transform = "none";
      }
    };

    const it = setInterval(fixLayout, 200);
    window.addEventListener("resize", fixLayout);

    return () => {
      clearInterval(it);
      window.removeEventListener("resize", fixLayout);
    };
  }, []);

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

        #arjs-video {
          max-width: none !important;
          max-height: none !important;
        }

        .a-enter-vr-button,
        .a-enter-ar-button {
          display: none !important;
        }
      `}</style>

      {libsReady && (
        <div suppressHydrationWarning>
          <a-scene
            embedded
            background="transparent: true"
            renderer="alpha: true; antialias: true; logarithmicDepthBuffer: true; precision: highp;"
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
          >
            {/* إضاءة متقدمة */}
            <a-light type="ambient" intensity="1.5" color="#fff"></a-light>
            <a-light type="directional" intensity="2" position="5 10 5" color="#fff"></a-light>
            <a-light type="point" intensity="1.2" position="0 2 0" color="#00FFFF"></a-light>

            {/* ماركر Hiro - البوابة الزمنية المتقدمة */}
            <a-marker preset="hiro" smooth="true" smoothCount="10" smoothTolerance="0.01" smoothThreshold="5">
              
              {/* الحلقة الخارجية (الأساس) */}
              <a-torus
                position="0 0.5 0"
                radius="1.2"
                radius-tubular="0.08"
                color="#00FFFF"
                material="opacity: 0.95; metalness: 0.9; roughness: 0.1; emissive: #0099FF; emissiveIntensity: 0.3;"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"
              ></a-torus>

              {/* الحلقة الثانية (عكس الاتجاه) */}
              <a-torus
                position="0 0.5 0"
                rotation="90 0 0"
                radius="0.95"
                radius-tubular="0.06"
                color="#FFD700"
                material="opacity: 0.9; metalness: 0.95; roughness: 0.05; emissive: #FFA500; emissiveIntensity: 0.4;"
                animation="property: rotation; to: 360 0 0; loop: true; dur: 5000; easing: linear"
              ></a-torus>

              {/* الحلقة الثالثة (قطر صغير) */}
              <a-torus
                position="0 0.5 0"
                rotation="45 45 0"
                radius="0.65"
                radius-tubular="0.04"
                color="#FF00FF"
                material="opacity: 0.85; metalness: 0.8; roughness: 0.15; emissive: #FF1493; emissiveIntensity: 0.3;"
                animation="property: rotation; to: -360 -360 0; loop: true; dur: 6000; easing: linear"
              ></a-torus>

              {/* نواة البوابة (كرة نابضة متوهجة) */}
              <a-sphere
                position="0 0.5 0"
                radius="0.3"
                color="#00FFFF"
                material="opacity: 0.8; metalness: 1; roughness: 0; emissive: #00FFFF; emissiveIntensity: 0.8;"
                animation="property: scale; dir: alternate; dur: 1200; loop: true; to: 1.3 1.3 1.3"
              ></a-sphere>

              {/* النص الرئيسي */}
              <a-text
                value="⚡ ZAMAN ⚡"
                position="0 2.2 0"
                align="center"
                color="#FFFFFF"
                scale="2.2 2.2 2.2"
                material="emissive: #00FFFF; emissiveIntensity: 0.5;"
                animation="property: position; dir: alternate; dur: 2500; loop: true; to: 0 2.5 0"
              ></a-text>

              {/* نص ثانوي (البوابة) */}
              <a-text
                value="GATEWAY"
                position="0 -0.5 0"
                align="center"
                color="#FFD700"
                scale="1.2 1.2 1.2"
                material="emissive: #FF8C00; emissiveIntensity: 0.3;"
              ></a-text>

              {/* جسيمات/نجوم حول البوابة (أعمدة متوهجة) */}
              <a-sphere
                position="1.5 0.5 0"
                radius="0.15"
                color="#00FFFF"
                material="emissive: #00FFFF; emissiveIntensity: 0.9;"
                animation="property: position; dir: alternate; dur: 3000; loop: true; to: 2 0.5 0"
              ></a-sphere>

              <a-sphere
                position="-1.5 0.5 0"
                radius="0.15"
                color="#FFD700"
                material="emissive: #FFD700; emissiveIntensity: 0.9;"
                animation="property: position; dir: alternate; dur: 3000; loop: true; to: -2 0.5 0"
              ></a-sphere>

              <a-sphere
                position="0 0.5 1.5"
                radius="0.15"
                color="#FF00FF"
                material="emissive: #FF00FF; emissiveIntensity: 0.9;"
                animation="property: position; dir: alternate; dur: 3000; loop: true; to: 0 0.5 2"
              ></a-sphere>

              <a-sphere
                position="0 0.5 -1.5"
                radius="0.15"
                color="#00FF88"
                material="emissive: #00FF88; emissiveIntensity: 0.9;"
                animation="property: position; dir: alternate; dur: 3000; loop: true; to: 0 0.5 -2"
              ></a-sphere>

            </a-marker>

            {/* الكاميرا */}
            <a-entity camera="active: true; fov: 80;"></a-entity>
          </a-scene>
        </div>
      )}
    </>
  );
}
