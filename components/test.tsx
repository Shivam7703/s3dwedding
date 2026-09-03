"use client";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Aarav & Ananya",
    event: "Destination Wedding, Udaipur",
    text: "S3D Weddings made our big day completely magical! From decor to management, everything was executed flawlessly.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Rohan & Meera",
    event: "Royal Wedding, Jaipur",
    text: "The attention to detail was top-notch. We didn't have to worry about a single vendor during the entire event.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Vikram & Sneha",
    event: "Sangeet & Reception, Delhi",
    text: "Pure perfection! Their team handled last-minute changes so effortlessly. Highly recommended for couples!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Kabir & Riya",
    event: "Beach Wedding, Goa",
    text: "Creative designs and super transparent process. They turned our vision into reality without any stress.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white text-zinc-900 lg:p-20 md:p-16 sm:p-12 p-6 space-y-24 overflow-hidden">
      
      {/* ----------------- 1. MARQUEE TESTIMONIALS ----------------- */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-red-600 text-sm font-semibold tracking-widest uppercase">
            Love Stories & Reviews
          </span>
          <h2 className="text-3xl md:text-5xl mt-2 font-semibold">
            What Our Couples Say
          </h2>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex space-x-6 animate-marquee whitespace-nowrap py-4">
            {/* Array double kiya hai infinite loop smooth rakhne ke liye */}
            {[...testimonials, ...testimonials].map((item, index) => (
              <div
                key={index}
                className="w-[320px] md:w-[400px] shrink-0 bg-zinc-100 border border-zinc-800 p-6 rounded-2xl whitespace-normal flex flex-col justify-between hover:border-red-500/50 transition-colors duration-300"
              >
                <p className="text-zinc-700 text-sm md:text-base italic mb-6">
                  "{item.text}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border border-red-500"
                  />
                  <div>
                    <h4 className="font-semibold text-black text-base">
                      {item.name}
                    </h4>
                    <p className="text-xs text-zinc-400">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----------------- 2. CONTACT FORM ----------------- */}
      <div className="max-w-5xl mx-auto bg-zinc-100/80 border-2 border-white rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side: Info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
                Get In Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold  mt-2 mb-4 leading-tight">
                Let’s Craft Your Dream Wedding Together.
              </h2>
              <p className="text-zinc-600 text-sm md:text-base">
                Have questions or ready to start planning? Fill out the form and our team will get back to you within 24 hours.
              </p>
            </div>

         <div className="mt-8 space-y-4 text-sm text-zinc-600">
  <div className="flex items-center space-x-3">
    <FaMapMarkerAlt className="text-amber-500 text-lg shrink-0" />
    <span>Gurgaon / Delhi / Pan India</span>
  </div>

  <div className="flex items-center space-x-3">
    <FaPhoneAlt className="text-amber-500 text-lg shrink-0" />
    <span>+91 82188 85483</span>
  </div>

  <div className="flex items-center space-x-3">
    <FaEnvelope className="text-amber-500 text-lg shrink-0" />
    <span>contact@s3dweddings.com</span>
  </div>
</div>
          </div>

          {/* Right Side: Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Rahul Sharma"
                className="w-full bg-white shadow-sm rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  className="w-full bg-white shadow-sm rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  className="w-full bg-white shadow-sm rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-2">
                Message / Details
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your event plans, guest count, or vision..."
                className="w-full bg-white shadow-sm rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 transition-colors resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full shadow-sm 
        to-rose-700 from-red-600 bg-linear-to-r text-zinc-100 hover:to-red-800 shadow-zinc-700/30 font-semibold py-3.5 rounded-xl transition-all duration-300 "
            >
              Send Message
            </button>
          </form>

        </div>
      </div>

    </section>
  );
}