// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARRealPage() {
  const [arReady, setArReady] = useState(false);

  return (
    <>
      {/* 
        هنا نلغي أي هوامش للصفحة ونخلي الخلفية شفافة 
        عشان الفيديو يظهر 
      */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden !important; /* ممنوع السكرول نهائياً */
          background-color: transparent !important;
        }
        
        /* اجبار فيديو الكاميرا يملأ الشاشة */
        #arjs-video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          position: fixed !important;
          top: 0;
          left: 0;
          z-index: -1 !important; /* في الخلفية تماماً */
          margin: 0 !important;
        }

        /* اجبار الكانفاس (المجسمات) يجي فوق الفيديو */
        .a-canvas {
          width: 100% !important;
          height: 100% !important;
          position: fixed !important;
          top: 0;
          left: 0;
          z-index: 0 !important;
        }
      `}</style>

      {/* سكريبتات AR */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        onLoad={() => console.log("A-Frame Loaded")}
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        onLoad={() => {
          console.log("AR.js Loaded");
          // تأخير بسيط للتأكد من تحميل كل شيء
          setTimeout(() => setArReady(true), 1000);
        }}
      />

      {/* واجهة المستخدم (فوق كل شيء z-50) */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
        <a
          href="/"
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '20px',
            textDecoration: 'none',
            fontSize: '12px',
            fontFamily: 'sans-serif'
          }}
        >
          ⬅ خروج
        </a>
      </div>

      <div style={{ position: 'fixed', bottom: '20px', left: 0, right: 0, textAlign: 'center', zIndex: 9999, pointerEvents: 'none' }}>
        <span style={{
          background: 'rgba(0,0,0,0.6)',
          color: '#FFD700',
          padding: '8px 15px',
          borderRadius: '10px',
          fontSize: '14px',
          fontFamily: 'sans-serif'
        }}>
           وجه الكاميرا لعلامة HIRO
        </span>
      </div>

      {/* المشهد */}
      {arReady && (
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; alpha: true;"
        >
          <a-marker preset="hiro">
            <a-box 
              position="0 0.5 0" 
              material="color: yellow; opacity: 0.8;"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
            ></a-box>
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
      )}
    </>
  );
}
