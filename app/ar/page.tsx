// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [libsLoaded, setLibsLoaded] = useState(false);

  useEffect(() => {
    // إعدادات الصفحة الأساسية
    document.documentElement.style.cssText = "margin:0; padding:0; height:100%; overflow:hidden;";
    document.body.style.cssText = "margin:0; padding:0; height:100%; overflow:hidden; background-color:#000;";

    const fixLayout = () => {
      const video = document.getElementById("arjs-video");
      const canvas = document.querySelector("canvas.a-canvas");

      // الحيلة الجديدة: لا تكبير (Scale) بل ملء الشاشة بذكاء
      if (video && canvas) {
        // الفيديو يملأ الشاشة بالكامل (Cover) بدون ما ينضغط
        video.style.cssText = `
          position: fixed !important; 
          top: 0 !important; left: 0 !important; 
          width: 100vw !important; height: 100vh !important; 
          object-fit: cover !important; 
          z-index: 0 !important; 
          margin: 0 !important;
        `;
        
        // الكانفس يطابق الفيديو
        canvas.style.cssText = `
          position: fixed !important; 
          top: 0 !important; left: 0 !important; 
          width: 100vw !important; height: 100vh !important; 
          z-index: 1 !important; 
          background: transparent !important;
        `;
      }
    };

    const timer = setInterval(fixLayout, 500);
    window.addEventListener("resize", fixLayout);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", fixLayout);
    };
  }, []);

  const onAframeLoad = () => {
    if (document.getElementById("arjs-script")) return;
    const s = document.createElement("script");
    s.id = "arjs-script";
    s.src = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";
    s.onload = () => {
      // تسجيل مكونات إضافية للتأثيرات البصرية
      setTimeout(() => {
        setLibsLoaded(true);
      }, 100);
    };
    document.head.appendChild(s);
  };

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={onAframeLoad}
      />

      <style jsx global>{`
        /* تأثير توهج للنص */
        .glow-text {
          text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
        }
        .a-enter-vr-button, .a-enter-ar-button { display: none !important; }
      `}</style>

      {libsLoaded && (
        <div suppressHydrationWarning>
          <a-scene
            embedded
            renderer="logarithmicDepthBuffer: true; antialias: true; colorManagement: true; sortObjects: true;"
            arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
            vr-mode-ui="enabled: false"
          >
            {/* إضاءة سينمائية */}
            <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
            <a-light type="point" color="#00ffff" intensity="2" position="0 2 0" distance="10" decay="2"></a-light>
            <a-light type="directional" color="#ffd700" intensity="1" position="-1 1 0"></a-light>

            <a-marker preset="hiro" smooth="true" smoothCount="10" smoothTolerance="0.01" smoothThreshold="5">
              
              {/* مجموعة البوابة الزمنية */}
              <a-entity position="0 0.5 0" rotation="-90 0 0">
                
                {/* 1. الحلقة الرئيسية (الزجاجية) */}
                <a-torus
                  radius="1.2"
                  radius-tubular="0.1"
                  segments-tubular="64"
                  material="color: #00ffff; opacity: 0.3; transparent: true; metalness: 0.9; roughness: 0.1;"
                  animation="property: rotation; to: 0 0 360; loop: true; dur: 10000; easing: linear"
                ></a-torus>

                {/* 2. حلقات الطاقة (مضيئة) */}
                <a-torus
                  radius="1.4"
                  radius-tubular="0.02"
                  segments-tubular="64"
                  material="color: #00ffff; emissive: #00ffff; emissiveIntensity: 2;"
                  animation="property: rotation; to: 0 0 -360; loop: true; dur: 5000; easing: linear"
                ></a-torus>

                {/* 3. النواة الذهبية (تنبض) */}
                <a-sphere
                  radius="0.3"
                  material="color: #ffd700; emissive: #ffd700; emissiveIntensity: 1; wireframe: true;"
                  animation="property: scale; dir: alternate; dur: 1500; loop: true; to: 1.2 1.2 1.2"
                ></a-sphere>

                {/* 4. جزيئات تدور (كأنها كواكب صغيرة) */}
                <a-entity animation="property: rotation; to: 0 360 0; loop: true; dur: 4000; easing: linear">
                    <a-sphere position="1.2 0 0" radius="0.05" color="#fff" material="emissive: #fff; emissiveIntensity: 5"></a-sphere>
                </a-entity>
                 <a-entity rotation="0 90 0" animation="property: rotation; to: 0 360 90; loop: true; dur: 6000; easing: linear">
                    <a-sphere position="1.2 0 0" radius="0.05" color="#ffd700" material="emissive: #ffd700; emissiveIntensity: 5"></a-sphere>
                </a-entity>

              </a-entity>

              {/* نص ثلاثي الأبعاد بتصميم جديد */}
              <a-text
                value="ZAMAN AR"
                font="exo2bold"
                position="0 1.5 0.5"
                align="center"
                color="#ffffff"
                width="6"
                rotation="-90 0 0"
              ></a-text>

            </a-marker>

            <a-entity camera></a-entity>
          </a-scene>
        </div>
      )}
    </>
  );
}
