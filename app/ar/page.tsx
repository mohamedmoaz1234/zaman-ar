// @ts-nocheck
"use client";

import Script from "next/script";

export default function ARRealPage() {
  return (
    <>
      <style jsx global>{`
        /* إلغاء أي هوامش في الصفحة */
        body {
          margin: 0;
          overflow: hidden;
          background-color: black;
        }
        
        /* هذا الكلاس هو المسؤول عن الفيديو */
        #arjs-video {
          width: 100vw !important;
          height: 100vh !important;
          object-fit: cover !important;
          position: absolute !important;
          top: 0;
          left: 0;
          z-index: -1 !important;
        }
      `}</style>

      {/* تحميل المكتبات */}
      <Script src="https://aframe.io/releases/1.2.0/aframe.min.js" />
      <Script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" />

      {/* زر خروج بسيط */}
      <div style={{position: 'fixed', top: 10, right: 10, zIndex: 999}}>
        <a href="/" style={{color: 'white', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: 5, textDecoration: 'none'}}>خروج</a>
      </div>

      {/* المشهد: هنا نستخدم embedded عشان نتحكم في الحجم */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        vr-mode-ui="enabled: false"
        style={{
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 1
        }}
      >
        <a-marker preset="hiro">
            {/* البوابة الزمنية (حلقة) */}
            <a-torus 
                position="0 0.5 0" 
                color="yellow" 
                radius="0.5" 
                radius-tubular="0.05"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
            ></a-torus>
            
            <a-text 
                value="Zaman AR" 
                position="0 1.5 0" 
                align="center" 
                color="white" 
                scale="2 2 2"
            ></a-text>
        </a-marker>
        
        <a-entity camera></a-entity>
      </a-scene>
    </>
  );
}
