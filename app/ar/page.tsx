// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function ARPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    
    // دالة واحدة بسيطة عشان الفيديو ما يعمل زوم
    const fix = () => {
      const v = document.getElementById("arjs-video");
      if (v) {
        v.style.width = "100%";   // لا تستخدم vw
        v.style.height = "100%";  // لا تستخدم vh
        v.style.objectFit = "cover";
        v.style.marginLeft = "0";
        v.style.marginTop = "0";
      }
    };
    
    window.addEventListener("resize", fix);
    const i = setInterval(fix, 500);
    return () => { clearInterval(i); window.removeEventListener("resize", fix); };
  }, []);

  return (
    <>
      <Script 
        src="https://aframe.io/releases/1.2.0/aframe.min.js" 
        strategy="beforeInteractive"
      />
      <Script 
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js" 
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      
      {ready && (
        <a-scene embedded arjs="sourceType: webcam; debugUIEnabled: false;">
          <a-marker preset="hiro">
            <a-box position="0 0.5 0" material="color: red; opacity: 0.5;"></a-box>
          </a-marker>
          <a-entity camera></a-entity>
        </a-scene>
      )}
    </>
  );
}
