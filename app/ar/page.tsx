// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARRealPage() {
  const [arReady, setArReady] = useState(false);

  return (
    // أجبرنا الحاوية تكون سوداء وتغطي الشاشة بالكامل بدون سكرول
    <div className="bg-black w-screen h-screen overflow-hidden relative m-0 p-0">
      
      {/* سكريبتات AR */}
      <Script
        src="https://aframe.io/releases/1.2.0/aframe.min.js"
        onLoad={() => console.log("A-Frame Loaded")}
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        onLoad={() => {
          console.log("AR.js Loaded");
          setArReady(true);
        }}
      />

      {/* زر الخروج */}
      <div className="absolute top-4 right-4 z-50 pointer-events-none">
        <a
          href="/"
          className="pointer-events-auto bg-black/40 text-white px-4 py-2 rounded-full text-xs border border-white/20 backdrop-blur-md"
        >
          ⬅ خروج
        </a>
      </div>

      {/* رسالة توجيه */}
      <div className="absolute bottom-10 left-0 right-0 z-50 text-center pointer-events-none">
        <div className="bg-black/60 text-yellow-400 inline-block px-5 py-3 rounded-xl text-sm backdrop-blur-md border border-yellow-500/30 shadow-lg">
           وجه الكاميرا نحو علامة "HIRO" 🔳
        </div>
      </div>

      {/* المشهد */}
      {arReady && (
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true;"
          // هذا الستايل يجبر الـ Canvas يغطي الشاشة
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <a-light type="ambient" color="#fff" intensity="1.2" />
          
          <a-marker preset="hiro">
            <a-box 
              position="0 0.5 0" 
              material="color: yellow; opacity: 0.8; transparent: true;"
              animation="property: rotation; to: 0 360 0; loop: true; dur: 3000"
            ></a-box>

            <a-text
              value="Zaman AR"
              position="0 1.5 0"
              align="center"
              color="#fff"
              scale="2 2 2"
            ></a-text>
          </a-marker>

          <a-entity camera></a-entity>
        </a-scene>
      )}

      {/* 
        إصلاح سحري لمشكلة الكاميرا في الجوال:
        نجبر فيديو الكاميرا والكانفاس يملوا الشاشة غصب
      */}
      <style jsx global>{`
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
          background-color: black !important;
        }
        
        /* نجبر فيديو الكاميرا يكون خلفية كاملة */
        video.a-canvas {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 0 !important;
        }
        
        /* نخفي أي حاوية بيضاء */
        .a-enter-vr {
          display: none;
        }
      `}</style>
    </div>
  );
}
