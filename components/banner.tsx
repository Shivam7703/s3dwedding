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
  // NOTE: extra "1" stop at the end forces opacity/blur/y to stay locked
  // at their final value for the rest of the scroll, instead of relying
  // on implicit clamping (which was letting content1 creep back up while
  // content2/content3 were on screen).
  const c1Opacity = useTransform(scrollYProgress, [0.27, 0.33, 1], [1, 0, 0]);
  const c1BlurVal = useTransform(scrollYProgress, [0.27, 0.33, 1], [0, 20, 20]);
  const c1Blur = useMotionTemplate`blur(${c1BlurVal}px)`;
  const c1Y = useTransform(scrollYProgress, [0.27, 0.33, 1], [0, -40, -40]);
  // FIX: when opacity hits 0, remove this layer from hit-testing so it
  // doesn't sit on top of / block whatever is rendered underneath.
  const c1Pointer = useTransform(c1Opacity, (v) => (v > 0.05 ? "auto" : "none"));

  // ---------- CONTENT 2 ----------
  const c2Opacity = useTransform(
    scrollYProgress,
    [0.33, 0.39, 0.6, 0.66, 1],
    [0, 1, 1, 0, 0]
  );
  const c2BlurVal = useTransform(
    scrollYProgress,
    [0.33, 0.39, 0.6, 0.66, 1],
    [20, 0, 0, 20, 20]
  );
  const c2Blur = useMotionTemplate`blur(${c2BlurVal}px)`;
  const c2Y = useTransform(
    scrollYProgress,
    [0.33, 0.39, 0.6, 0.66, 1],
    [40, 0, 0, -40, -40]
  );
  const c2Pointer = useTransform(c2Opacity, (v) => (v > 0.05 ? "auto" : "none"));

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
  const c3Pointer = useTransform(c3Opacity, (v) => (v > 0.05 ? "auto" : "none"));

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
          style={{ opacity: c1Opacity, filter: c1Blur, y: c1Y, pointerEvents: c1Pointer }}
          className="absolute md:left-5 left-2 md:top-1/2 top-[70%] rounded-xl max-sm:bg-black/60 max-sm:backdrop-blur-md max-sm:m-3 -translate-y-1/2 z-10 max-w-2xl p-6"
        >
          <h1 className="lg:text-[80px] md:text-5xl text-4xl font-bold leading-none text-white sm:mb-6">
            Exquisite Planning Forever <span className="text-red-600">Begins</span>
          </h1>
          <p className="text-zinc-300 sm:mb-8 my-4 leading-[1.7] max-w-xl font-medium line-clamp-3">
            Crafting bespoke wedding experiences with elegance, precision, and timeless design. Your love story, our canvas. Crafting bespoke wedding experiences with elegance, precision, and timeless design.
          </p>
          <div className="flex gap-4">
            <Buttonmain text="View Portfolio" href="tel:+918218885483" variant="primary" />
            <button className="border text-sm font-medium backdrop-blur-sm border-white/60 text-white px-7 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer">
              Book Now
            </button>
          </div>
        </motion.div>

        {/* Content 2 */}
        <motion.div
          style={{ opacity: c2Opacity, filter: c2Blur, y: c2Y, pointerEvents: c2Pointer }}
          className="absolute md:left-5 left-2 md:top-1/2 top-[70%] rounded-xl max-sm:bg-black/60 max-sm:backdrop-blur-md max-sm:m-3 -translate-y-1/2 z-10 max-w-2xl p-6"
        >
          <h1 className="lg:text-[80px] md:text-5xl text-4xl font-bold leading-none text-white sm:mb-6">
            Every Detail, With Proper <span className="text-red-600">Perfection</span>
          </h1>
          <p className="text-zinc-300 sm:mb-8 my-4 leading-[1.7] max-w-xl font-medium line-clamp-3">
            From venue selection to the final toast, we handle every moment with care and creativity. Lorem ipsum dolor sit amet consectetur adipisicing elit.  Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className="flex gap-4">
            <Buttonmain text="Our Process" href="tel:+918218885483" variant="primary" />
            <button className="border text-sm font-medium backdrop-blur-sm border-white/60 text-white px-7 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Content 3 */}
        <motion.div
          style={{ opacity: c3Opacity, filter: c3Blur, y: c3Y, pointerEvents: c3Pointer }}
          className="absolute md:left-5 left-2 md:top-1/2 top-[70%] rounded-xl max-sm:bg-black/60 max-sm:backdrop-blur-md max-sm:m-3 -translate-y-1/2 z-10 max-w-2xl p-6"
        >
          <h1 className="lg:text-[80px] md:text-5xl text-4xl font-bold leading-none text-white sm:mb-6">
            We Create Your <span className="text-red-600">Happy Journey</span>
          </h1>
          <p className="text-zinc-300 sm:mb-8 my-4 leading-[1.7] max-w-xl font-medium line-clamp-3">
            Let's create memories that last a lifetime. Reach out and start planning today. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consequatur quis.  Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className="flex gap-4">
            <Buttonmain text="Get Started" href="tel:+918218885483" variant="primary" />
            <button className="border text-sm font-medium backdrop-blur-sm border-white/60 text-white px-7 py-3 rounded-lg hover:bg-white/10 transition cursor-pointer">
              Contact Us
            </button>
          </div>
        </motion.div>

        {/* Bottom-right floating info box */}
        <div className="absolute bottom-2 right-1 z-20 w-44 h-20 bg-black rounded-lg border border-white/20 flex flex-col items-center justify-center gap-1 px-3">
          <p className="text-white text-xs font-medium text-center">
            Managed by <span className="text-red-600 font-bold">S3d Wedding</span>
          </p>
          <button
            onClick={() => {
              /* open your popup/form logic here */
            }}
            className="text-[11px] text-white border border-white/50 rounded-md px-3 py-1 hover:bg-white/10 transition cursor-pointer"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}