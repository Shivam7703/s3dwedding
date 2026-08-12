"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ser1, ser2, ser3, ser4, ser5 } from "@/assets";
import Buttonmain from "./button";
import Link from "next/link";

const servicesData = [
  {
    num: "01",
    title: "Catering Services",
    desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat officia possimus laudantium.",
    image: ser1,
  },
  {
    num: "02",
    title: "Event Management",
    desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat officia possimus laudantium.",
    image: ser2,
  },
  {
    num: "03",
    title: "Decor & Setup",
    desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat officia possimus laudantium.",
    image: ser3,
  },
  {
    num: "04",
    title: "Corporate Events",
    desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat officia possimus laudantium.",
    image: ser4,
  },
  {
    num: "05",
    title: "Private Parties",
    desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat officia possimus laudantium.",
    image: ser5,
  },
];

export default function Services() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-81%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);

  return (
    <div ref={targetRef} className="relative h-[510vh]">
      <div className="sticky top-0 h-screen flex flex-col bg-ser overflow-hidden py-7 md:py-12">

        {/* Brand Block */}
        <div className="text-center w-full max-w-3xl mx-auto">
              {/* <h4 className="text-red-600 text-sm md:text-lg font-bold mb-4">Our Services</h4> */}
              <h2 className="text-white font-semibold text-3xl capitalize md:text-5xl leading-[1.05] mb-6">
                What Services We <span className="text-red-600 cursive">Provide.</span>
              </h2>
             
            </div>
        {/* Cards Track */}
        <div className="relative mt-6 md:mt-8 w-full overflow-hidden perspective-[1300px]">
          <motion.div
            style={{ x }}
            className="flex items-center justify-end gap-12 p-6 md:pr-20 md:pl-[62vw] w-max relative z-10"
          >
            {servicesData.map((service, index) => (
              <ServiceCard
                key={index}
                service={service}
                index={index}
                total={servicesData.length}
                progress={scrollYProgress}
              />
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function ServiceCard({
  service,
  index,
  total,
  progress,
}: {
  service: (typeof servicesData)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Roughly where this card is centered along the scroll timeline
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;
  const cardCenter = (cardStart + cardEnd) / 2;

  const minVal = Math.max(0, cardCenter - 0.16);
  const maxVal = Math.min(1, cardCenter + 0.16);

  const scale = useTransform(progress, [minVal, cardCenter, maxVal], [0.82, 1.12, 0.82]);
  const opacity = useTransform(progress, [minVal, cardCenter, maxVal], [0.45, 1, 0.45]);
  const y = useTransform(progress, [minVal, cardCenter, maxVal], [24, 0, 24]);

  return (
    <motion.div
      style={{ scale, opacity, y }}
      className="w-[85vw] sm:w-95 md:w-130 shrink-0 rounded-[28px] overflow-hidden"
    >
      <div
        className=" h-max flex flex-col  justify-center backdrop-blur-md relative group transition-colors duration-500 
             shadow-[0_30px_70px_rgba(0,0,0,0.55)]"
      >
        
        {/* Premium Glow Overlay */}
        <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none -z-10 " />

        {/* Image */}
        <div className="relative w-full aspect-5/3 rounded-2xl overflow-hidden mb-3">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" /> */}
         
        </div>

        <div className="px-8 text-center">
          <h3 className="text-xl md:text-3xl cursive font-bold tracking-tight text-white">
            {service.title}
          </h3>

          <p className=" text-sm md:text-base leading-relaxed font-normal text-zinc-400 line-clamp-2">
            {service.desc}
          </p>

          <Link
            href="#"
            className="mt-2 inline-flex items-center gap-2 font-semibold text-sm uppercase tracking-wider transition-colors text-red-400 hover:text-violet-300"
          >
            <span>Know More</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}