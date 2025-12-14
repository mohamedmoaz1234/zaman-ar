// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function ARPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // إجبار الجسم على عدم التحرك لمنع ظهور حواف بيضاء عند السحب
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    
    return () => {
      // تنظيف الستايل عند الخروج من الصفحة
      document.body.style.overflow = '';
      document.body.style.margin = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 1. تحميل المكتبات بترتيب صحيح ومضمون */}
      <Script 
        src="https://aframe.io/releases/1.4.2/aframe.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" 
        strategy="afterInteractive" 
      />

      {/* 2. ستايل خاص لإجبار الفيديو على ملء الشاشة */}
      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden !important;
          width: 100%;
          height: 100%;
        }
        /* إخفاء زر الـ VR المزعج أسفل الشاشة */
        .a-enter-vr-button {
          display: none !important;
        }
        /* التأكد من أن الكانفس يغطي كل شيء */
        .a-canvas {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
          position: fixed !important;
        }
        /* إصلاح مشكلة الفيديو الذي يظهر بحجم صغير أحياناً */
        video {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            position: absolute !important;
            top: 0;
            left: 0;
            z-index: -1;
        }
      `}</style>

      {/* 3. مشهد الواقع المعزز */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true"
        >
          {/* الإضاءة */}
          <a-light type="ambient" intensity="1"></a-light>
          <a-light type="directional" intensity="1.5" position="1 1 1"></a-light>

          {/* الماركر Hiro */}
          <a-marker preset="hiro">
            
            {/* البوابة الزمنية (Torus) */}
            <a-torus 
              position="0 0.5 0" 
              rotation="0 0 0" 
              radius="1.2" 
              radius-tubular="0.05" 
              color="#00FFFF"
              material="opacity: 0.8; metalness: 0.8; roughness: 0.2;"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear"
            >
            </a-torus>
            
            {/* حلقة داخلية للبوابة بلون مختلف للتأثير */}
            <a-torus 
              position="0 0.5 0" 
              rotation="90 0 0" 
              radius="1.0" 
              radius-tubular="0.02" 
              color="#FFD700"
              animation="property: rotation; to: 360 0 0; loop: true; dur: 3000; easing: linear"
            >
            </a-torus>

            {/* نص يظهر فوق البوابة */}
            <a-text 
                value="ZAMAN GATE" 
                position="0 2 0" 
                align="center" 
                color="#FFFFFF" 
                scale="1.5 1.5 1.5"
                animation="property: position; dir: alternate; dur: 2000; loop: true; to: 0 2.2 0"
            ></a-text>

          </a-marker>

          {/* الكاميرا */}
          <a-entity camera></a-entity>
        </a-scene>
      </div>
    </>
  );
}
