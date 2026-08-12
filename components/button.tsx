import Link from "next/link";
import React from "react";
import { FaArrowRight } from "react-icons/fa";

/* Main Wrapper Component */
function Buttonmain({
  href,
  text,
  variant ,
}: {
  href: string;
  text: string;
  variant?: "primary" | "secondary";
}) {
  if (variant === "secondary") {
    return <ButtonSecondary href={href} text11={text} />;
  }

  const isExternal =
    href.startsWith("tel:") ||
    href.startsWith("https:") ||
    href.startsWith("mailto:") ||
    href.startsWith("www.");

  if (isExternal) {
    return (
      <a href={href} className="w-max inline-block group/btn">
        <Button text11={text} />
      </a>
    );
  }

  return (
    <Link href={href} className="w-max inline-block group/btn">
      <Button text11={text} />
    </Link>
  );
}

export default Buttonmain;

/* ==========================================================================
   Primary Button UI (Pure Tailwind CSS)
   ========================================================================== */
function Button({ text11 }: { text11: string }) {
  return (
    <span
      className="
        inline-flex items-center gap-2.5 px-6 py-3 rounded-lg
        text-sm font-medium tracking-wide transition-all duration-300 group
        relative overflow-hidden shadow-sm 
        
        /* Light Mode Styles */
        to-rose-500 from-red-600 bg-linear-to-r text-zinc-100 hover:to-pink-500 shadow-zinc-700/30
      "
    >
      <span className="relative z-10">{text11}</span>

      <FaArrowRight
        size={12}
        className="relative z-10 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
      />
    </span>
  );
}

/* ==========================================================================
   Secondary Outlined Button UI (Pure Tailwind CSS)
   ========================================================================== */
function ButtonSecondary({
  text11,
  href,
}: {
  text11: string;
  href: string;
}) {
  const classes = `
    inline-flex items-center gap-2.5 px-7 py-3 rounded-lg
    text-sm font-semibold tracking-wide transition-all duration-300 group
    relative overflow-hidden border backdrop-blur-sm shadow-sm hover:shadow-lg 
        border-zinc-800 text-zinc-800 hover:text-white
  `;

  const inner = (
    <>
      {/* Fill on hover */}
      <span
        className="
          absolute inset-0 translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-in-out -z-10
          bg-zinc-800
                  "
      />

      <span className="relative capitalize z-10">{text11}</span>

      <FaArrowRight
        size={12}
        className="relative z-10 transition-all mt-0.5 duration-300 group-hover:translate-x-1 "
      />
    </>
  );

  const isExternal =
    href.startsWith("tel:") ||
    href.startsWith("https:") ||
    href.startsWith("mailto:") ||
    href.startsWith("www.");

  if (isExternal) {
    return (
      <a href={href} className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}