"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/hero-bg.jpg"
      >
        {/* Free nature timelapse from Pexels CDN */}
        <source
          src="https://videos.pexels.com/video-files/856974/856974-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
        {/* Fallback: show image if video can't load */}
      </video>

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-indigo-900/20" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 backdrop-blur-sm mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-sky-300 text-sm font-medium tracking-wide">Live Weather Data</span>
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none mb-4"
          style={{ textShadow: "0 4px 40px rgba(56,189,248,0.4), 0 0 80px rgba(56,189,248,0.2)" }}
        >
          The{" "}
          <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            Ultimate
          </span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none mb-8"
          style={{ textShadow: "0 4px 40px rgba(56,189,248,0.4)" }}
        >
          Weather App
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="text-white/70 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Real-time forecasts, live radar maps, and hourly weather data — all beautifully visualized.
        </motion.p>

        {/* CTA */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-white/50 text-sm"
        >
          Search a city or allow location access above ↑
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={scrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors group"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="group-hover:text-sky-400 transition-colors" />
        </motion.div>
      </motion.button>
    </section>
  );
}
