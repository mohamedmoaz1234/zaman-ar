// @ts-nocheck
"use client";

import Script from "next/script";

export default function ARRealPage() {
  return (
    <>
      {/* نضبط الجسم لمنع السكرول وتكبير الكاميرا */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden !important;
          background-color: black !important;
        }

        #arjs-video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          position: fixed !important;
          top: 0;
          left: 0;
          z-index: -1 !important;
          margin: 0 !important;
        }

        .a-canvas {
          width: 100% !important;
          height: 100% !important;
          position: fixed !important;
          top: 0;
          left: 0;
          z-index: 0 !important;
        }

        .a-enter-vr {
          display: none !important;
        }
      `}</style>

      {/* تحميل مكتبات A-Frame و AR.js */}
      <Script src="https://aframe.io/releases/1.2.0/aframe.min.js" />
      <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" />

      {/* زر الرجوع */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 9999,
        }}
      >
        <a
          href="/"
          style={{
            background: "rgba(0,0,0,0.55)",
            color: "white",
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontFamily: "system-ui, sans-serif",
            textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          ⬅ الرجوع
        </a>
      </div>

      {/* تعليمات أسفل الشاشة */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "rgba(0,0,0,0.7)",
            color: "#FBBF24",
            padding: "8px 16px",
            borderRadius: 12,
            fontSize: 14,
            fontFamily: "system-ui, sans-serif",
            border: "1px solid rgba(251,191,36,0.4)",
            boxShadow: "0 0 18px rgba(251,191,36,0.35)",
          }}
        >
          وجه الكاميرا نحو علامة "HIRO" لترى البوابة الزمنية ✨
        </span>
      </div>

      {/* مشهد AR – نعرضه مباشرة بدون useState عشان ما يعلق */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        vr-mode-ui="enabled: false"
        renderer="logarithmicDepthBuffer: true; alpha: true;"
      >
        {/* إضاءة عامة */}
        <a-entity light="type: ambient; color: #ffffff; intensity: 0.8"></a-entity>
        {/* إضاءة نقطية فوق البوابة */}
        <a-entity
          light="type: point; color: #ffffff; intensity: 1.2"
          position="0 1.2 1"
        ></a-entity>

        {/* الماركر */}
        <a-marker preset="hiro">
          {/* البوابة الزمنية – حلقة Torus تدور وتنبض */}
          <a-torus
            position="0 0.6 0"
            rotation="0 0 0"
            radius="0.6"
            radius-tubular="0.08"
            segments-radial="32"
            segments-tubular="48"
            material="color: #FDE68A; metalness: 0.8; roughness: 0.15; emissive: #F59E0B; emissiveIntensity: 0.6"
            animation__spin="property: rotation; to: 0 360 0; loop: true; dur: 3500; easing: linear"
            animation__pulse="property: scale; dir: alternate; dur: 1400; easing: easeInOutSine; loop: true; to: 1.08 1.08 1.08"
          ></a-torus>

          {/* حلقة داخلية أرفع لزيادة العمق */}
          <a-torus
            position="0 0.6 0"
            rotation="0 0 0"
            radius="0.32"
            radius-tubular="0.02"
            segments-radial="32"
            segments-tubular="48"
            material="color: #FEF9C3; metalness: 0.7; roughness: 0.1; emissive: #FACC15; emissiveIntensity: 0.8"
          ></a-torus>

          {/* حلقة ضوئية مسطّحة تتحرك حول البوابة */}
          <a-ring
            position="0 0.6 0.01"
            rotation="-90 0 0"
            radius-inner="0.34"
            radius-outer="0.36"
            material="color: #FCD34D; opacity: 0.5; transparent: true"
            animation__rotate="property: rotation; to: -90 0 360; loop: true; dur: 4200; easing: linear"
          ></a-ring>

          {/* نص تحت البوابة */}
          <a-text
            value="Zaman AR • Time Gate"
            position="0 0.05 0"
            align="center"
            color="#ffffff"
            width="3"
          ></a-text>
        </a-marker>

        {/* الكاميرا */}
        <a-entity camera></a-entity>
      </a-scene>
    </>
  );
}
