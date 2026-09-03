"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import { ser1, ser2, ser3, ser4, ser5 } from "@/assets";
import Buttonmain from "./button";
import Link from "next/link";
import { Utensils, Palette, Briefcase, PartyPopper, ArrowRight, Calendar } from "lucide-react";

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

const serviceIcons: Record<string, React.ReactNode> = {
  "01": <Utensils className="w-6 h-6 text-zinc-800" />,
  "02": <Calendar className="w-6 h-6 text-zinc-800" />,
  "03": <Palette className="w-6 h-6 text-zinc-800" />,
  "04": <Briefcase className="w-6 h-6 text-zinc-800" />,
  "05": <PartyPopper className="w-6 h-6 text-zinc-800" />,
};

export default function Services() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-81%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);

  return (
    <div ref={targetRef} className="  relative h-[480vh]">
      <div
        className="sticky bg-serve top-0 h-screen flex flex-col bg-white justify-center overflow-hidden py-9 md:pt-20"
      // style={{
      //   backgroundImage:
      //     "radial-gradient(circle at -35% 130%,  #981a01 10%, #1c0000 40%, #000000 55%, #000000 100%, #000000 100%)",
      // }}
      >

        {/* Brand Block */}
        <div className="text-center w-full max-w-3xl mx-auto max-md:p-6">
         <h2 className="text-zinc-900 text-5xl capitalize md:text-6xl font-bold leading-[1.05] mb-6">
            What Services We <span className="text-red-600">Provide.</span>
          </h2>
          <p className="text-zinc-700 text-sm max-w-md mx-auto">Lorem ipsum dolor sit amet consectetur adipisicing elit. Error a, fugiat explicabo maiores repellendus tenetur.</p>
        </div>
        {/* Cards Track */}
        <div className="relative mt-12  w-full overflow-hidden perspective-[1300px]">
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
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;
  const cardCenter = (cardStart + cardEnd) / 2;

  const minVal = Math.max(0, cardCenter - 0.16);
  const maxVal = Math.min(1, cardCenter + 0.16);

  const scale = useTransform(progress, [minVal, cardCenter, maxVal], [0.82, 1.12, 0.82]);
  const opacity = useTransform(progress, [minVal, cardCenter, maxVal], [0.65, 1, 0.75]);
  const y = useTransform(progress, [minVal, cardCenter, maxVal], [24, 0, 24]);

  return (
    <motion.div
      style={{ scale, opacity, y }}
      className="w-[85vw] sm:w-95 md:w-110 shrink-0 rounded-[28px] overflow-hidden"
    >
      <div className="relative group overflow-hidden rounded-[28px] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)]">

        {/* Card Main Container with increased height */}
        <div className="relative w-full aspect-5/4 border border-white/30 rounded-[28px] overflow-hidden">

          {/* Background Image */}
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Dark Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-transparent" />
          {/* Top Badge: Service Number & Icon */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
            <div className="p-2.5 rounded-full bg-white border shadow-xl shadow-black/80">
              {serviceIcons[service.num] || <Utensils className="w-6 h-6 text-zinc-800" />}
            </div>
          </div>
          {/* Content Layer Over the Image (Bottom Positioned) */}
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 z-10 flex flex-col justify-end text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 group-hover:text-amber-300 transition-colors">
              {service.title}
            </h3>
            <p className="text-sm md:text-base leading-relaxed font-normal text-zinc-300 line-clamp-2 mb-4">
              {service.desc}
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 font-semibold text-xs md:text-sm uppercase tracking-wider text-amber-400 hover:text-white transition-colors"
            >
              <span>Know More</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}