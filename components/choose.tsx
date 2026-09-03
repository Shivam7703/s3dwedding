"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiStar, FiShield, FiAward } from "react-icons/fi";
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
  {
    title: "Tailored Experiences",
    desc: "Custom layouts and themes designed to mirror your unique personal story.",
    icon: FiStar,
  },
];

export default function Whychoose() {
  return (
    <div className="relative bg-black  flex items-center overflow-hidden ">
      {/* Background Ambient Glow */}
      <div className="absolute -left-3 w-72 sm:w-105 h-80 top-44 bg-red-600/35 blur-[120px] sm:blur-[150px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="w-full flex flex-col lg:flex-row relative gap-8 lg:gap-0">
        
        {/* Left — Content */}
        <div className="w-full lg:w-[55%] px-5 sm:px-8 md:px-12 lg:pl-16 xl:pl-32 max-md:pt-32 lg:py-24 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl lg:text-6xl leading-tight font-bold tracking-tight text-white">
              We Turn Your Big Day {" "}
              <br className="hidden xl:block" />
              <span className="text-red-600">
                Into Magic.
              </span>
            </h2>

            <p className="leading-relaxed text-zinc-200 mb-8 max-w-xl text-sm sm:text-base">
              From the first consultation to the final send-off, we handle every detail with precision — so you get to actually enjoy your own event.
            </p>

            {/* Boxes (Cards) - Grid Layout */}
            <div className="grid grid-cols-2 gap-4 mb-8 sm:mb-10 max-w-2xl">
              {points.map((point, index) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                    className="p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-800/60 hover:border-amber-500/40 transition-all duration-300 group flex flex-col gap-3"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
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

            <Buttonmain href="tel:+918218885483" text="Get Started" variant="primary" />
          </motion.div>
        </div>

        {/* Right — Image */}
        <div className="relative w-full lg:w-[45%] h-165 lg:h-225 lg:sticky lg:top-0 lg:rounded-l-[3rem] overflow-hidden shadow-2xl">
          <Image
            src={bride}
            alt="Bride at wedding event"
            fill
            priority
            className="object-cover object-center lg:object-left hover:scale-105 transition-transform duration-700"
          />
          {/* Mobile & Desktop subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-l lg:from-black/10 lg:to-black/80 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}