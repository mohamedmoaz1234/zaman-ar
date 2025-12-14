// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function ARPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // تنظيف أي إعدادات سابقة للجسم
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* 
         التغيير الحاسم هنا:
         استبدلنا نسخة 1.4.2 بنسخة 1.2.0 
         هذا سيحل مشكلة EventDispatcher فوراً 
      */}
      <Script 
        src="https://aframe.io/releases/1.2.0/aframe.min.js" 
        strategy="beforeInteractive" 
      />
      <Script 
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" 
        strategy="afterInteractive" 
      />

      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden !important;
          width: 100%;
          height: 100%;
          background-color: black; /* خلفية سوداء بدل الأبيض المزعج */
        }
        .a-enter-vr-button, .a-enter-ar-button {
          display: none !important;
        }
        /* إجبار الفيديو والكانفس على الامتلاء */
        .a-canvas, #arjs-video {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
          left: 0 !important;
          position: absolute !important;
          z-index: 0 !important;
          object-fit: cover !important;
        }
      `}</style>

      {/* مشهد AR */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
        >
          {/* إضاءة */}
          <a-light type="ambient" intensity="1"></a-light>
          <a-light type="directional" intensity="1" position="-1 1 0"></a-light>

          {/* الماركر Hiro */}
          <a-marker preset="hiro">
            
            {/* البوابة الزمنية - الحلقات */}
            <a-torus 
              position="0 0.5 0" 
              rotation="0 0 0" 
              radius="1.2" 
              radius-tubular="0.05" 
              color="#00FFFF"
              material="opacity: 0.9; metalness: 0.8; roughness: 0.2;"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear">
            </a-torus>
            
            <a-torus 
              position="0 0.5 0" 
              rotation="90 0 0" 
              radius="1.0" 
              radius-tubular="0.03" 
              color="#FFD700"
              animation="property: rotation; to: 360 0 0; loop: true; dur: 3000; easing: linear">
            </a-torus>

            <a-text 
                value="ZAMAN GATE" 
                position="0 2 0" 
                align="center" 
                color="#FFFFFF" 
                scale="2 2 2"
                animation="property: position; dir: alternate; dur: 2000; loop: true; to: 0 2.2 0">
            </a-text>

          </a-marker>

          <a-entity camera></a-entity>
        </a-scene>
      </div>
    </>
  );
}
