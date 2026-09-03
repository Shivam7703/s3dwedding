"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { couple, bg10 } from "@/assets";
import * as THREE from "three";
import Buttonmain from "./button";

// ---------- scroll progress (rAF + lerp smoothing) ----------
function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  const smoothRef = useRef(0);
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.8;
        const scrolled = -rect.top + window.innerHeight * 0.2;
        const target = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 1;
        smoothRef.current += (target - smoothRef.current) * 0.1;
        if (Math.abs(target - smoothRef.current) < 0.0005) smoothRef.current = target;
        setProgress(smoothRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref]);
  return progress;
}

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

// ---------- Box Metrics ----------
function useBoxMetrics(
  stickyRef: React.RefObject<HTMLDivElement | null>,
  boxRef: React.RefObject<HTMLDivElement | null>
) {
  const [metrics, setMetrics] = useState({ ready: false, topOffset: 0, boxWidth: 0, boxHeight: 0, boxLeft: 0 });

  useEffect(() => {
    const measure = () => {
      const sticky = stickyRef.current;
      const box = boxRef.current;
      if (!sticky || !box) return;
      const stickyRect = sticky.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      if (boxRect.width === 0 || boxRect.height === 0) return;
      setMetrics({
        ready: true,
        topOffset: boxRect.top - stickyRect.top,
        boxWidth: boxRect.width,
        boxHeight: boxRect.height,
        boxLeft: boxRect.left - stickyRect.left,
      });
    };
    measure();
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 500);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [stickyRef, boxRef]);
  return metrics;
}

function ParticleCanvas({ progress, src, topOffset, boxWidth, boxHeight }: any) {
  const mountRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    if (boxWidth === 0 || boxHeight === 0) return;
    let cleanup = () => {};
    const img = imgRef.current;
    const mount = mountRef.current;
    if (!img || !mount) return;

    const setup = async () => {
      const totalHeight = topOffset + boxHeight;
      const mountAspect = boxWidth / totalHeight;
      const boxAspect = boxWidth / boxHeight;
      const formRatio = boxHeight / totalHeight;
      const imgAspect = img.naturalWidth / img.naturalHeight;

      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgAspect > boxAspect) { sw = img.naturalHeight * boxAspect; sx = (img.naturalWidth - sw) / 2; }
      else { sh = img.naturalWidth / boxAspect; sy = (img.naturalHeight - sh) / 2; }

      const w = 220, h = Math.round(w / boxAspect);
      const offscreen = document.createElement("canvas");
      offscreen.width = w; offscreen.height = h;
      const octx = offscreen.getContext("2d")!;
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      const data = octx.getImageData(0, 0, w, h).data;

      const amber = new THREE.Color("#f59e0b");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, mountAspect, 0.1, 1000);
      camera.position.set(0, 0, 26);

      const vFov = (camera.fov * Math.PI) / 180;
      const planeH = 2 * Math.tan(vFov / 2) * 26;
      const planeW = planeH * mountAspect;
      const planeHBox = planeH * formRatio;

      const step = 2;
      const targets: number[] = [], colors: number[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          if (data[idx + 3] < 40) continue;
          const nx = (x / w - 0.5) * planeW;
          const imgY = -(y / h - 0.5);
          const ny = (imgY + 0.5) * planeHBox - planeH / 2;
          targets.push(nx, ny, (Math.random() - 0.5) * 0.6);
          const realColor = new THREE.Color(data[idx]/255, data[idx+1]/255, data[idx+2]/255);
          const tinted = realColor.clone().lerp(amber, 0.12);
          colors.push(tinted.r, tinted.g, tinted.b);
        }
      }

      const count = targets.length * 2;
      const scatter = new Float32Array(count * 3);
      const controlX = new Float32Array(count);
      const controlY = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        scatter[i * 3] = (Math.random() - 0.5) * planeW * 1.4;
        scatter[i * 3 + 1] = planeH * (0.8 - Math.random() * 0.05);
        scatter[i * 3 + 2] = (Math.random() - 0.5) * 12;
        controlX[i] = (Math.random() < 0.5 ? -1 : 1) * planeW * (0.25 + Math.random() * 0.35);
        controlY[i] = -(planeH * (0.1 + Math.random() * 0.25));
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(scatter), 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));
      
      const vertexShader = `
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 120.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float diamond = abs(center.x) * 0.5 + abs(center.y) * 0.5;
          float alpha = 1.0 - smoothstep(0.25, 0.45, diamond);
          float gradient = 0.8 + 0.2 * (1.0 - diamond * 1.5);
          gl_FragColor = vec4(vColor * gradient, alpha * 0.95);
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        const p = easeInOutCubic(progressRef.current);
        const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
        const inv = 1 - p;
        for (let i = 0; i < count; i++) {
          const ix = i * 3;
          const midX = (scatter[ix] + targets[ix]) / 2 + controlX[i];
          const midY = (scatter[ix+1] + targets[ix+1]) / 2 + controlY[i];
          posAttr.array[ix] = inv * inv * scatter[ix] + 2 * inv * p * midX + p * p * targets[ix] + Math.sin(t * 3.0 + i) * inv * 0.25;
          posAttr.array[ix + 1] = inv * inv * scatter[ix+1] + 2 * inv * p * midY + p * p * targets[ix+1] + Math.sin(t * 3.0 + i) * inv * 0.25;
          posAttr.array[ix + 2] = scatter[ix+2] + (targets[ix+2] - scatter[ix+2]) * p;
        }
        posAttr.needsUpdate = true;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => { 
        renderer.dispose(); 
        if (mount && renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    if (img.complete && img.naturalWidth > 0) setup();
    else img.onload = () => setup();
    return cleanup;
  }, [src, topOffset, boxWidth, boxHeight]);

  return (
    <div className="relative w-full h-full">
      <img ref={imgRef} src={typeof src === "string" ? src : src.src} alt="" className="hidden" crossOrigin="anonymous" />
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}

// ---------- PHASE 3: All particles rise together (SHAPE FIXED) ----------
function FullScreenParticleCanvas({ progress }: any) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    let cleanup = () => {};
    const mount = mountRef.current;
    if (!mount) return;

    const setup = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      
      const aspect = w / h;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
      camera.position.set(0, 0, 26);

      const vFov = (camera.fov * Math.PI) / 180;
      const planeH = 2 * Math.tan(vFov / 2) * 26;
      const planeW = planeH * aspect;

      // Adjust particle density slightly on mobile viewports
      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 1200 : 2000; 

      const scatter = new Float32Array(particleCount * 3);
      const band = new Float32Array(particleCount * 3);
      const target = new Float32Array(particleCount * 3);
      const controlX1 = new Float32Array(particleCount); 
      const controlY1 = new Float32Array(particleCount);
      const controlX2 = new Float32Array(particleCount); 
      const controlY2 = new Float32Array(particleCount);
      
      const colorsA = new Float32Array(particleCount * 3); 
      const colorsB = new Float32Array(particleCount * 3); 
      const colorsC = new Float32Array(particleCount * 3); 
      const seeds = new Float32Array(particleCount);

      const colorPairs = [
        { a: new THREE.Color("#FFFFFF"), b: new THREE.Color("#FFD700"), c: new THREE.Color("#FF8C00") }, 
        { a: new THREE.Color("#F472B6"), b: new THREE.Color("#DC2626"), c: new THREE.Color("#7F1D1D") }, 
        { a: new THREE.Color("#FDA4AF"), b: new THREE.Color("#991B1B"), c: new THREE.Color("#4C0519") }, 
        { a: new THREE.Color("#FF69B4"), b: new THREE.Color("#FFB6C1"), c: new THREE.Color("#FFF0F5") }, 
        { a: new THREE.Color("#FF1493"), b: new THREE.Color("#FF69B4"), c: new THREE.Color("#FFC0CB") }, 
        { a: new THREE.Color("#FFC0CB"), b: new THREE.Color("#FFFFFF"), c: new THREE.Color("#FFD700") }, 
      ];

      const containerVh = 65;
      const bottomY = -planeH / 2;
      const vhToUnits = (vh: number) => (vh / containerVh) * planeH;

      const bandBottomY = bottomY + vhToUnits(1);
      const bandTopY = bottomY + vhToUnits(5);
      const midCeilingY = bottomY + vhToUnits(30);
      const maxRiseY = bottomY + vhToUnits(50);

      const baseStartY = bottomY - 6.0;

      for (let i = 0; i < particleCount; i++) {
        const startX = (Math.random() - 0.5) * planeW * 1.6;
        const startY = baseStartY + (Math.random() - 0.5) * 7.0;
        const startZ = (Math.random() - 0.5) * 6;

        scatter[i * 3] = startX;
        scatter[i * 3 + 1] = startY;
        scatter[i * 3 + 2] = startZ;

        const bandX = startX + (Math.random() - 0.5) * planeW * 0.2;
        const bandY = bandBottomY + Math.random() * (bandTopY - bandBottomY);
        const bandZ = startZ + (Math.random() - 0.5) * 2;
        band[i * 3] = bandX;
        band[i * 3 + 1] = bandY;
        band[i * 3 + 2] = bandZ;

        controlX1[i] = (Math.random() - 0.5) * planeW * 0.25;
        controlY1[i] = Math.random() * planeH * 0.08;

        const roll = Math.random();
        let targetY: number;
        if (roll < 0.40) {
          targetY = bandY;
        } else if (roll < 0.80) {
          targetY = bandTopY + Math.random() * (midCeilingY - bandTopY);
        } else {
          targetY = midCeilingY + Math.random() * (maxRiseY - midCeilingY - 3);
        }

        target[i * 3] = bandX + (Math.random() - 0.5) * planeW * 0.3;
        target[i * 3 + 1] = targetY;
        target[i * 3 + 2] = bandZ + (Math.random() - 0.5) * 3;

        controlX2[i] = (Math.random() - 0.5) * planeW * 0.3;
        controlY2[i] = Math.random() * planeH * 0.1;

        const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
        
        colorsA[i * 3] = pair.a.r; colorsA[i * 3 + 1] = pair.a.g; colorsA[i * 3 + 2] = pair.a.b;
        colorsB[i * 3] = pair.b.r; colorsB[i * 3 + 1] = pair.b.g; colorsB[i * 3 + 2] = pair.b.b;
        colorsC[i * 3] = pair.c.r; colorsC[i * 3 + 1] = pair.c.g; colorsC[i * 3 + 2] = pair.c.b;

        seeds[i] = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(scatter, 3));
      geometry.setAttribute("colorA", new THREE.BufferAttribute(colorsA, 3));
      geometry.setAttribute("colorB", new THREE.BufferAttribute(colorsB, 3));
      geometry.setAttribute("colorC", new THREE.BufferAttribute(colorsC, 3));
      geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

      const vertexShader = `
        attribute vec3 colorA;
        attribute vec3 colorB;
        attribute vec3 colorC;
        attribute float seed;

        varying vec3 vColorA;
        varying vec3 vColorB;
        varying vec3 vColorC;
        varying float vAngle;

        uniform float uTime;

        void main() {
          vColorA = colorA;
          vColorB = colorB;
          vColorC = colorC;
          
          vAngle = seed * 6.28 + uTime * (0.8 + seed * 1.5);
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float flip = 0.75 + 0.25 * sin(uTime * 2.0 + seed * 15.0);
          
          gl_PointSize = (1350.0 * flip) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `;

      const fragmentShader = `
        varying vec3 vColorA;
        varying vec3 vColorB;
        varying vec3 vColorC;
        varying float vAngle;

        void main() {
          vec2 p = gl_PointCoord - vec2(0.5);
          float cosA = cos(vAngle);
          float sinA = sin(vAngle);
          vec2 rP = vec2(p.x * cosA - p.y * sinA, p.x * sinA + p.y * cosA);
          
          float shapeX = rP.x * (1.35 - rP.y * 0.95);
          float dist = length(vec2(shapeX, rP.y * 1.15));
          
          float alpha = smoothstep(0.38, 0.31, dist);
          float gradMix = clamp((rP.y + 0.35) * 1.4, 0.0, 1.0);
          
          vec3 finalColor;
          if (gradMix < 0.5) {
            finalColor = mix(vColorA, vColorB, gradMix * 2.0);
          } else {
            finalColor = mix(vColorB, vColorC, (gradMix - 0.5) * 2.0);
          }
          
          float shading = 0.82 + 0.18 * sin(rP.x * 3.14 + 1.5);
          gl_FragColor = vec4(finalColor * shading, alpha * 0.94);
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      mount.appendChild(renderer.domElement);

      const clock = new THREE.Clock();

      const stage1End = 0.4;

      const animate = () => {
        const t = clock.getElapsedTime();
        material.uniforms.uTime.value = t;

        const phase3Progress = Math.max(0, Math.min(1, (progressRef.current - 0.55) / 0.45));
        const pOut = easeInOutCubic(phase3Progress);

        const pStage1 = Math.min(1, pOut / stage1End);
        const pStage2 = Math.max(0, Math.min(1, (pOut - stage1End) / (1 - stage1End)));

        const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

        for (let i = 0; i < particleCount; i++) {
          const ix = i * 3;

          const inv1 = 1 - pStage1;
          const midX1 = (scatter[ix] + band[ix]) / 2 + controlX1[i];
          const midY1 = (scatter[ix + 1] + band[ix + 1]) / 2 + controlY1[i];
          let baseX = inv1 * inv1 * scatter[ix] + 2 * inv1 * pStage1 * midX1 + pStage1 * pStage1 * band[ix];
          let baseY = inv1 * inv1 * scatter[ix + 1] + 2 * inv1 * pStage1 * midY1 + pStage1 * pStage1 * band[ix + 1];
          let baseZ = scatter[ix + 2] + (band[ix + 2] - scatter[ix + 2]) * pStage1;

          if (pStage2 > 0) {
            const inv2 = 1 - pStage2;
            const midX2 = (band[ix] + target[ix]) / 2 + controlX2[i];
            const midY2 = (band[ix + 1] + target[ix + 1]) / 2 + controlY2[i];
            baseX = inv2 * inv2 * band[ix] + 2 * inv2 * pStage2 * midX2 + pStage2 * pStage2 * target[ix];
            baseY = inv2 * inv2 * band[ix + 1] + 2 * inv2 * pStage2 * midY2 + pStage2 * pStage2 * target[ix + 1];
            baseZ = band[ix + 2] + (target[ix + 2] - band[ix + 2]) * pStage2;
          }

          const driftX = Math.sin(t * 1.2 + i) * 0.15;
          const driftY = Math.cos(t * 0.9 + i * 0.4) * 0.12;

          posAttr.array[ix] = baseX + driftX;
          posAttr.array[ix + 1] = baseY + driftY;
          posAttr.array[ix + 2] = baseZ;
        }

        posAttr.needsUpdate = true;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        renderer.dispose();
        if (mount && renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    const timer = setTimeout(setup, 100);
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}


export default function Aboutsection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const rawProgress = useScrollProgress(outerRef);
  
  // Phase 1 timing: 0 to 150vh
  const phase1End = 150 / 220;
  const formProgress = Math.min(1, rawProgress / phase1End);
  const phase1Progress = rawProgress <= phase1End ? formProgress : 1;

  const { ready, topOffset, boxWidth, boxHeight, boxLeft } = useBoxMetrics(stickyRef, boxRef);
  
  // Show Phase 1 canvas only during Phase 1 (0 to 150vh)
  const showPhase1Canvas = rawProgress > 0.02 && rawProgress <= phase1End;

  // Phase 4 white overlay
  const phase4Start = 190;
  const phase4End = 210;
  
  const phase4StartProgress = phase4Start / 220;
  const phase4EndProgress = phase4End / 220;
  
  const whiteOverlayOpacity = Math.max(0, Math.min(1, 
    (rawProgress - phase4StartProgress) / (phase4EndProgress - phase4StartProgress)
  ));

  return (
    <div className="w-full text-zinc-100 bg-about relative">
      {/* Outer container for scroll handling */}
      <div ref={outerRef} style={{ height: "240vh" }} className="relative z-10">
        
        {/* Phase 3 Canvas */}
        <div 
          className="absolute -bottom-8 left-0 w-full pointer-events-none h-[60vh] md:h-[80vh]"
          style={{ zIndex: 5, opacity: 1 }}
        >
          <FullScreenParticleCanvas progress={rawProgress} />
        </div>

        {/* Content & Phase 1 */}
        <div ref={stickyRef} className="sticky top-0 h-screen w-full flex items-center overflow-hidden py-6 md:py-0">
          <div className="mx-auto w-full px-4 sm:px-6 md:px-10 lg:px-24 flex flex-col md:flex-row justify-between gap-y-6 items-center">
            
            {/* Left Content */}
            <div className="md:w-[50%] w-full order-2 md:order-1">
              <h4 className="font1 font-black mb-2 sm:mb-3 text-xl sm:text-4xl">About Us</h4>
              <h2 className="font-bold text-2xl sm:text-3xl md:text-[65px] leading-[1.1] md:leading-[1.05] mb-3 sm:mb-5 capitalize">
                Every love story, shaped <span className="text-red-600">with intention.</span>
              </h2>
              
              <p className="text-zinc-300 mb-3 sm:mb-5 leading-relaxed text-sm sm:text-base">
                We believe every couple has a unique story waiting to be told. Our approach combines artistic vision with technical precision to create films that capture the true essence of your love.
              </p>
              <p className="text-zinc-300 mb-4 sm:mb-8 leading-relaxed text-sm sm:text-base">
                We believe every couple has a unique story waiting to be told. Our approach combines artistic vision with technical precision to create films that capture the true essence of your love. 
              </p>

              {/* Feature Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 max-md:hidden">
                <div className="p-2 px-4 rounded-xl bg-zinc-100/5 backdrop-blur-md border border-zinc-400">
                  <h3 className="font-semibold text-sm sm:text-lg text-amber-400 mb-1 sm:mb-2 border-b">Artistic Vision</h3>
                  <p className="text-xs text-zinc-300">Cinematic storytelling tailored to your vibe.</p>
                </div>

                <div className="p-2 px-4 rounded-xl bg-zinc-100/5 backdrop-blur-md border border-zinc-400">
                  <h3 className="font-semibold text-sm sm:text-lg text-amber-400 mb-1 sm:mb-2 border-b">Artistic Vision</h3>
                  <p className="text-xs text-zinc-300 mb-1 sm:mb-2">Cinematic storytelling tailored to your vibe.</p>
                </div>
                
                <div className="p-2 px-4 rounded-xl bg-zinc-100/5 backdrop-blur-md border border-zinc-400">
                  <h3 className="font-semibold text-sm sm:text-lg text-amber-400 mb-1 sm:mb-2 border-b">Artistic Vision</h3>
                  <p className="text-xs text-zinc-300 mb-1 sm:mb-2">Cinematic storytelling tailored to your vibe.</p>
                </div>
              </div>
            </div>

            {/* Right Image Container */}
            <div className="relative h-86 md:h-137.5 w-full md:w-[45%] order-1 md:order-2">
              <Image src={bg10} alt="About" className="w-full absolute top-0 right-0 h-full object-cover rounded-xl" />
              <div ref={boxRef} className="w-[70%] h-[87%] left-[15%] absolute -bottom-3 rounded-xl overflow-hidden">
                <img
                  src={typeof couple === "string" ? couple : couple.src}
                  alt="About"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                  style={{ opacity: Math.max(0, Math.min(1, (phase1Progress - 0.82) / 0.18)) }}
                />
              </div>
            </div>

          </div>

          {/* Phase 1 Canvas - Only visible during Phase 1 */}
          {ready && showPhase1Canvas && (
            <div
              className="absolute pointer-events-none"
              style={{ top: 0, left: boxLeft, width: boxWidth, height: topOffset + boxHeight }}
            >
              <ParticleCanvas 
                progress={phase1Progress} 
                src={couple} 
                topOffset={topOffset} 
                boxWidth={boxWidth} 
                boxHeight={boxHeight}
              />
            </div>
          )}
        </div>
      </div>

      {/* Phase 4: White Overlay */}
      <div 
        className="absolute w-full h-full top-0 left-0 z-70 bg-abs1 bg-bottom! bg-cover bg-no-repeat pointer-events-none"
        style={{ 
          opacity: whiteOverlayOpacity,
          transition: 'opacity 0.2s linear' 
        }}
      />
    </div>
  );
}