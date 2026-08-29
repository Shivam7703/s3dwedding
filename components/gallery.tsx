"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { aboutbg, gal1, bg11,
  gal2,
  gal3,
  gal4,
  gal5,
  gal6,
  gal7,
  gal8,
  gal9,
  gal10,
  gal11,
  gal12,bg7 } from "@/assets";
import Image from 'next/image';
import * as THREE from 'three';

// ---------- Scroll Progress Hook ----------
function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  const smoothRef = useRef(0);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const target = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
        
        smoothRef.current += (target - smoothRef.current) * 0.08;
        
        if (Math.abs(target - smoothRef.current) < 0.0001) {
          smoothRef.current = target;
        }
        setProgress(smoothRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ref]);

  return progress;
}

// ---------- 3D Particle Pillar ----------
interface PillarProps {
  isMobile: boolean;
}

function PillarParticleCanvas({ isMobile }: PillarProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Use container dimensions so canvas center matches exact DOM center
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    
    const aspect = w / h;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 0, isMobile ? 39: 35); 
    camera.lookAt(0, 0, 0); // Explicitly center target

    const particleCount = isMobile ? 3200 : 3000; 
    const maxRadius = isMobile ? 3.2 : 6.0; 
    const pillarHeight = 50; 

    const positions = new Float32Array(particleCount * 3);
    const basePositions = new Float32Array(particleCount * 3);
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

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.sqrt(Math.random()) * maxRadius; 
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * pillarHeight;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const pair = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      colorsA[i * 3] = pair.a.r; colorsA[i * 3 + 1] = pair.a.g; colorsA[i * 3 + 2] = pair.a.b;
      colorsB[i * 3] = pair.b.r; colorsB[i * 3 + 1] = pair.b.g; colorsB[i * 3 + 2] = pair.b.b;
      colorsC[i * 3] = pair.c.r; colorsC[i * 3 + 1] = pair.c.g; colorsC[i * 3 + 2] = pair.c.b;

      seeds[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
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
      uniform float uSizeMultiplier;

      void main() {
        vColorA = colorA;
        vColorB = colorB;
        vColorC = colorC;
        
        vAngle = seed * 6.28 + uTime * (0.8 + seed * 1.5);
        
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float flip = 0.75 + 0.25 * sin(uTime * 2.0 + seed * 15.0);
        
        gl_PointSize = (uSizeMultiplier * flip) / -mvPosition.z;
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
        float fontMix = clamp((rP.y + 0.35) * 1.4, 0.0, 1.0);
        
        vec3 finalColor;
        if (fontMix < 0.5) {
          finalColor = mix(vColorA, vColorB, fontMix * 2.0);
        } else {
          finalColor = mix(vColorB, vColorC, (fontMix - 0.5) * 2.0);
        }
        
        float shading = 0.82 + 0.18 * sin(rP.x * 3.14 + 1.5);
        gl_FragColor = vec4(finalColor * shading, alpha * 0.94);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: { 
        uTime: { value: 0 },
        uSizeMultiplier: { value: isMobile ? 1200.0 : 1750.0 }
      },
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

    const animate = () => {
      const t = clock.getElapsedTime();
      material.uniforms.uTime.value = t;

      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        let currentY = basePositions[ix + 1] + (t * 2.5);
        while (currentY > pillarHeight / 2) currentY -= pillarHeight;
        
        const radius = Math.sqrt(basePositions[ix]*basePositions[ix] + basePositions[ix+2]*basePositions[ix+2]);
        const angleOffset = t * 0.45; 
        const baseAngle = Math.atan2(basePositions[ix+2], basePositions[ix]);
        
        posAttr.array[ix] = Math.cos(baseAngle + angleOffset) * radius;
        posAttr.array[ix + 1] = currentY;
        posAttr.array[ix + 2] = Math.sin(baseAngle + angleOffset) * radius;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const rw = mount.clientWidth || window.innerWidth;
      const rh = mount.clientHeight || window.innerHeight;
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0" />;
}

// ---------- Gallery Component ----------
export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const images = useMemo(() => [gal2, gal3, gal4, gal5, gal6, gal7, gal8, gal9, gal10, gal11, gal12, gal3, gal2, gal1,bg11, bg7], []);

  const imageDetails = [
    { title: "Ethereal Beginnings", desc: "Embarking on a fluid journey of abstract colors and natural canvas gradients." },
    { title: "Crimson Shards", desc: "A bold exploration of deep ruby architecture paired with sharp geometric lighting." },
    { title: "Sun-Kissed Horizons", desc: "Capturing warm amber overlays balancing seamlessly with high contrast design elements." },
    { title: "Minimal Elegance", desc: "Where space meets silence. A neutral palette crafted for peaceful modern viewing." },
    { title: "Vibrant Echoes", desc: "Neon structures meeting soft rose gold elements to forge an energetic display." },
    { title: "Reimagined Form", desc: "Twisting traditional layouts into dynamic three-dimensional perspectives." },
    { title: "Glow Symphony", desc: "The intersection of luminous particle flows and static architectural frames." },
    { title: "Velvet Atmosphere", desc: "Plunging deep into twilight shades mixed with golden premium undertones." },
    { title: "Infinite Flow", desc: "Concluding the cycle with continuous motions of structured depth and rhythm." },
  ];

  const rotationProgress = Math.min(progress / 0.7, 1);
  const zoomProgress = Math.min(Math.max(0, (progress - 0.7) / 0.2), 1);
  const fadeOutProgress = Math.max(0, (progress - 0.9) / 0.1);
  const galleryOpacity = 1 - fadeOutProgress;

  const activeIndex = Math.min(
    images.length - 1,
    Math.max(0, Math.round(rotationProgress * (images.length - 1)))
  );

  const currentDetail = imageDetails[activeIndex] || { title: "Our Showcase", desc: "Explore our dynamic gallery layers." };
  const whiteOverlayOpacity = Math.max(0, 1 - (progress * 12));
  const textOpacity = Math.max(0, 1 - (zoomProgress * 2.5));

  if (!isMounted) {
    return <div ref={containerRef} className="relative h-[500vh] w-full" />;
  }

  return (
    <>
      <div ref={containerRef} className="relative h-[900vh] w-full bg-black text-zinc-800 ">
         <div 
              className="absolute inset-0 z-100 bg-abs2 bg-top! bg-cover bg-no-repeat pointer-events-none"
              style={{ opacity: whiteOverlayOpacity }}
            />
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          
          {/* Gallery Layer */}
          <div 
            className="absolute inset-0 flex items-center justify-center bg-gal transition-opacity"
            style={{ opacity: galleryOpacity }}
          >

            {/* Header Text */}
            <div 
              className="absolute right-6 top-20 max-md:p-3 max-md:bg-black/40 z-30 max-w-65 max-md:backdrop-blur-md md:max-w-sm text-right pointer-events-none"
              style={{ opacity: textOpacity }}
            >
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wider text-white mb-2 drop-shadow-sm">
                Our Gallery
              </h2>
              <p className="text-sm md:text-base text-zinc-200 font-medium leading-relaxed">
                A seamless merger of dynamic digital physics and architectural layouts, rotating gracefully through infinite space.
              </p>
            </div>

            {/* Active Image Text */}
            <div 
              className="absolute left-6 bottom-6 rounded-lg border border-white/10  bg-black/20 p-5 max-lg:backdrop-blur-lg z-30 max-w-70 md:max-w-sm text-left pointer-events-none transition-all duration-300"
              style={{ opacity: textOpacity }}
            >
              <h3 className="text-2xl md:text-3xl font-extrabold text-amber-500  mb-2 tracking-wide">
                {currentDetail.title}
              </h3>
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal">
                {currentDetail.desc} {currentDetail.desc} {currentDetail.desc}
              </p>
            </div>

            {/* 3D Cards & Pillar Container */}
            <div 
              className="relative w-full h-full flex items-center justify-center mx-auto"
              style={{ perspective: isMobile ? '1200px' : '1600px', transformStyle: 'preserve-3d' }}
            >
              {/* Pillar Canvas positioned at exact screen viewport center */}
              <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center" style={{ transform: 'translateZ(0px)' }}>
                <PillarParticleCanvas isMobile={isMobile} />
              </div>

              {images.map((img, index) => {
                const targetProgress = index / (images.length - 1);
                const ySpread = isMobile ? 1300 : 2200;

                const currentY = (targetProgress - rotationProgress) * ySpread;
                const currentAngle = (targetProgress - rotationProgress) * Math.PI * 5.1; 
                const radius = isMobile ? 280 : 410; 

                const translateX = Math.sin(currentAngle) * radius;
                const translateZ = Math.cos(currentAngle) * radius;

                const isLastImage = index === images.length - 1;

                const scale = isLastImage ? 1 + (zoomProgress * 15) : 1;
                const zIndex = isLastImage && zoomProgress > 0 ? 1000 : Math.round(translateZ);

                const cardOpacity = translateZ >= 0 
                  ? 1 
                  : 0.25 + 0.75 * ((translateZ + radius) / radius);

                return (
                  <div
                    key={index}
                    suppressHydrationWarning
                    className="absolute w-72 h-60 md:w-120 md:h-80 rounded-xl overflow-hidden border border-black/5 shadow-2xl pointer-events-none"
                    style={{
                      transform: `translate3d(${translateX}px, ${currentY}px, ${translateZ}px) rotateY(${currentAngle * (180 / Math.PI)}deg) scale(${scale})`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'visible',
                      opacity: cardOpacity,
                      transition: 'opacity 0.1s linear',
                      zIndex: zIndex,
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      priority={index < 3}
                    />
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}