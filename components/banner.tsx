"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import Buttonmain from "./button";

const TOTAL_FRAMES = 280;

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);
  const targetFrame = useRef(0);
  const rafId = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ---------- CONTENT 1 ----------
  // 0 -> blurred+hidden, fades in clear, stays, blurs out again
  const c1Opacity = useTransform(
    scrollYProgress,
    [ 0.27, 0.33],
    [ 1, 0]
  );
  const c1BlurVal = useTransform(
    scrollYProgress,
    [0.27, 0.33],
    [ 0, 20]
  );
  const c1Blur = useMotionTemplate`blur(${c1BlurVal}px)`;
  const c1Y = useTransform(
    scrollYProgress,
    [ 0.27, 0.33],
    [ 0, -140]
  );

  // ---------- CONTENT 2 ----------
  const c2Opacity = useTransform(
    scrollYProgress,
    [0.33, 0.39, 0.6, 0.66],
    [0, 1, 1, 0]
  );
  const c2BlurVal = useTransform(
    scrollYProgress,
    [0.33, 0.39, 0.6, 0.66],
    [20, 0, 0, 20]
  );
  const c2Blur = useMotionTemplate`blur(${c2BlurVal}px)`;
  const c2Y = useTransform(
    scrollYProgress,
    [0.33, 0.39, 0.6, 0.66],
    [40, 0, 0, -40]
  );

  // ---------- CONTENT 3 ----------
  const c3Opacity = useTransform(
    scrollYProgress,
    [0.66, 0.72, 0.94, 1.0],
    [0, 1, 1, 0]
  );
  const c3BlurVal = useTransform(
    scrollYProgress,
    [0.66, 0.72, 0.94, 1.0],
    [20, 0, 0, 20]
  );
  const c3Blur = useMotionTemplate`blur(${c3BlurVal}px)`;
  const c3Y = useTransform(
    scrollYProgress,
    [0.66, 0.72, 0.94, 1.0],
    [40, 0, 0, -40]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const loadImages = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;
        frames.current.push(img);
      }
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.scale(dpr, dpr);
    };

    const drawCover = (img: HTMLImageElement) => {
      const dpr = window.devicePixelRatio || 1;
      const cWidth = canvas.width / dpr;
      const cHeight = canvas.height / dpr;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = cWidth / cHeight;

      let drawWidth: number, drawHeight: number;
      if (imgRatio > canvasRatio) {
        drawHeight = cHeight;
        drawWidth = drawHeight * imgRatio;
      } else {
        drawWidth = cWidth;
        drawHeight = drawWidth / imgRatio;
      }

      const offsetX = (cWidth - drawWidth) / 2;
      const offsetY = 0;

      ctx.clearRect(0, 0, cWidth, cHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    loadImages();
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const animate = () => {
      currentFrame.current += (targetFrame.current - currentFrame.current) * 0.1;
      const img = frames.current[Math.round(currentFrame.current)];
      if (img?.complete) drawCover(img);
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current!);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    targetFrame.current = latest * (TOTAL_FRAMES - 1);
  });

  useEffect(() => {
    const enterFullscreen = () => {
      const elem = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (document.fullscreenElement) return;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    };

    document.addEventListener("click", enterFullscreen, { once: true });
    document.addEventListener("touchstart", enterFullscreen, { once: true });

    return () => {
      document.removeEventListener("click", enterFullscreen);
      document.removeEventListener("touchstart", enterFullscreen);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[460vh] w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="block" />

        {/* Content 1 */}
        <motion.div
          style={{ opacity: c1Opacity, filter: c1Blur, y: c1Y }}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 max-w-2xl p-6"
        >
          <h1 className="lg:text-[120px] text-6xl font-black leading-[0.9]! text-white mb-6">
            Exquisite Planning Forever <span className="text-red-500">Begins</span>
          </h1>
          <p className="text-gray-50 mb-8 text-lg max-w-xl font-semibold line-clamp-2">
            Crafting bespoke wedding experiences with elegance, precision, and timeless design. Your love story, our canvas.
          </p>
          <div className="flex gap-4">
            <Buttonmain text="View Portfolio" href="tel:+918218885483" variant="primary" />
            <button className="border text-sm font-medium backdrop-blur-sm border-white/60 text-white px-7 py-3 rounded-lg hover:bg-white/10 transition">
              Book Now
            </button>
          </div>
        </motion.div>

        {/* Content 2 */}
        <motion.div
          style={{ opacity: c2Opacity, filter: c2Blur, y: c2Y }}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 max-w-2xl p-6"
        >
          <h1 className="lg:text-[120px] text-6xl font-black leading-[0.9]! text-white mb-6">
            Every Detail, With <span className="text-red-500">Perfection</span>
          </h1>
          <p className="text-gray-50 mb-8 text-lg max-w-xl font-semibold line-clamp-2">
            From venue selection to the final toast, we handle every moment with care and creativity. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          </p>
          <div className="flex gap-4">
            <Buttonmain text="Our Process" href="tel:+918218885483" variant="primary" />
            <button className="border text-sm font-medium backdrop-blur-sm border-white/60 text-white px-7 py-3 rounded-lg hover:bg-white/10 transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Content 3 */}
        <motion.div
          style={{ opacity: c3Opacity, filter: c3Blur, y: c3Y }}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 max-w-2xl p-6"
        >
          <h1 className="lg:text-[120px] text-6xl font-black leading-[0.9]! text-white mb-6">
            We Create Your <span className="text-red-500">Happy Journey</span>
          </h1>
          <p className="text-gray-50 mb-8 text-lg max-w-xl font-semibold line-clamp-2">
            Let's create memories that last a lifetime. Reach out and start planning today Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur quis.
          </p>
          <div className="flex gap-4">
            <Buttonmain text="Get Started" href="tel:+918218885483" variant="primary" />
            <button className="border text-sm font-medium backdrop-blur-sm border-white/60 text-white px-7 py-3 rounded-lg hover:bg-white/10 transition">
              Contact Us
            </button>
          </div>
        </motion.div>

        {/* Bottom-right floating info box */}
        <div className="absolute bottom-2 right-1 z-20 w-44 h-20 bg-black rounded-lg border border-white/20 flex flex-col items-center justify-center gap-1 px-3">
          <p className="text-white text-xs font-medium text-center">
            Managed by <span className="text-red-500 font-semibold">YourBrand</span>
          </p>
          <button
            onClick={() => {/* open your popup/form logic here */}}
            className="text-[11px] text-white border border-white/50 rounded-md px-3 py-1 hover:bg-white/10 transition"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}