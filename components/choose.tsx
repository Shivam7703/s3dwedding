"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiStar, FiShield, FiAward } from "react-icons/fi"; // Icons update kiye hain
import { bride } from "@/assets";
import Buttonmain from "./button";

const points = [
  {
    title: "Handpicked Vendors",
    desc: "Every partner is vetted personally — absolutely no last-minute surprises.",
    icon: FiStar,
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden charges. What's quoted upfront is exactly what you pay.",
    icon: FiShield,
  },
  {
    title: "Flawless Execution",
    desc: "Over a decade of experience delivering perfect events across the country.",
    icon: FiAward,
  },
];

export default function Whychoose() {
  return (
    <section className="relative bg-black pt-24 pb-0 md:min-h-screen flex items-center overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/15 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Container - Flexbox se image ko right me push kiya hai */}
      <div className="w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
        
        {/* Left — Content */}
        <div className="w-full lg:w-[55%] px-6 md:px-12 lg:pl-16 xl:pl-32 py-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Pill Badge */}
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md">
              <span className="text-xs font-bold tracking-widest uppercase text-violet-400">
                Why Choose Us
              </span>
            </div>

            <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
              We Turn Your Big Day <br className="hidden xl:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Into Magic.
              </span>
            </h2>

            <p className="text-base md:text-lg leading-relaxed text-zinc-400 mb-10 max-w-xl">
              From the first consultation to the final send-off, we handle every detail with precision — so you get to actually enjoy your own event.
            </p>

            {/* Boxes (Cards) - Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl">
              {points.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    // Last box ko full width diya hai symmetry ke liye
                    className={`p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-violet-500/40 transition-all duration-300 group ${
                      index === 2 ? 'sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4' : 'flex flex-col gap-3'
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-violet-500/30 bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-xl" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">
                        {point.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Buttonmain href={"tel:+918218885483"} text={"Get Started"} variant={"primary"} />
          </motion.div>
        </div>

        {/* Right — Image (Full Bleed to the Right Edge) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full lg:w-[45%] h-[500px] lg:h-[800px] lg:rounded-l-[3rem] overflow-hidden shadow-2xl"
        >
          <Image
            src={bride}
            alt="Bride at wedding event"
            fill
            className="object-cover object-center lg:object-left hover:scale-105 transition-transform duration-700"
          />
          {/* Gradient overlay to blend with background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-l lg:from-black/10 lg:to-black/80" />

          {/* Upgraded Floating Stat Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute bottom-8 left-6 lg:bottom-16 lg:-left-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-8 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-12 bg-violet-500 rounded-full" />
              <div>
                <p className="text-4xl md:text-5xl font-black text-white tracking-tight">500+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-300 mt-1">
                  Events Delivered
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}