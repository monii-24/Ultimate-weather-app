"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Umbrella } from "lucide-react";
import { HourlyPoint, WMO_ICONS } from "@/lib/weather";

interface HourlyForecastProps {
  hourly: HourlyPoint[];
}

function formatHour(isoTime: string): string {
  const date = new Date(isoTime);
  const h = date.getHours();
  return h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`;
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative rounded-3xl p-6"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">24-Hour Forecast</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {hourly.map((h, i) => {
          const icon = WMO_ICONS[h.weatherCode] ?? "🌡️";
          const isNow = i === 0;
          return (
            <motion.div
              key={h.time}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`flex-shrink-0 flex flex-col items-center gap-2 rounded-2xl px-4 py-3 min-w-[80px] transition-all ${
                isNow
                  ? "bg-sky-500/30 border border-sky-400/40"
                  : "bg-white/5 border border-white/8 hover:bg-white/10"
              }`}
            >
              <span className={`text-xs font-medium ${isNow ? "text-sky-300" : "text-white/50"}`}>
                {isNow ? "Now" : formatHour(h.time)}
              </span>
              <span className="text-2xl">{icon}</span>
              <span className="text-white font-bold text-sm">{h.temperature}°</span>
              {h.precipitationProbability > 0 && (
                <div className="flex items-center gap-1">
                  <Umbrella size={10} className="text-blue-300" />
                  <span className="text-blue-300 text-xs">{h.precipitationProbability}%</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
