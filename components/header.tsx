"use client";
import { motion, useScroll, useMotionValueEvent, useTransform, useMotionValue } from "framer-motion";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import Buttonmain from "./button";

const NAV_LINKS = ["Portfolio", "About", "Services", "Gallery"];

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // 1. Appearance logic (background change at 1250px)
    // setIsScrolled(latest > 1850);

    // 2. Hide/Show logic (top -24px vs 0)
  //   const diff = latest - lastScrollY.get();
  //   if (latest > 100) { // Thoda scroll hone ke baad hi effect shuru ho
  //     if (diff > 0) setIsHidden(true);  // Down scroll -> Hide (-24px)
  //     else setIsHidden(false);         // Up scroll -> Show (0px)
  //   } else {
  //     setIsHidden(false);              // Top par hai to show
  //   }
  //   lastScrollY.set(latest);

  });

  return (
    <motion.header
      initial={{ top: 0 }}
      animate={{ top:  0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed left-0 w-full z-50 transition-all duration-500 flex items-center justify-center ${
        isScrolled 
          ? "py-2  backdrop-blur-xs" 
          : "py-3 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-x-1 cursor-pointer group">
          <div className="relative">
            <FaHeart className="text-red-500 text-4xl -rotate-45 transition-all duration-300" />
          </div>
          <div className="flex flex-col leading-none">
            <span className={`font-serif text-2xl font-bold text-white`}>
              S3D
            </span>
            <span className="text-base border-t border-red-500 font-bold text-red-500 tracking-[0.3em]">
              Weddings
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center rounded-4xl backdrop-blur-2xl bg-black/5 border border-white/20">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`relative text-xs uppercase px-4 py-3  font-medium tracking-widest hover:bg-white/25 rounded-4xl transition-colors group text-white`}
            >
              {link}
            </a>
          ))}
        </nav>

        <Buttonmain href="tel:+918218885483" text="Book An Event" variant="primary" />
      </div>
    </motion.header>
  );
}