"use client";

import { motion } from "framer-motion";
import { Wind, Droplets, Thermometer, Sun, MapPin } from "lucide-react";
import { CurrentWeather, GeoLocation, WMO_ICONS, getWeatherGradient } from "@/lib/weather";

interface WeatherCardProps {
  weather: CurrentWeather;
  location: GeoLocation;
}

export default function WeatherCard({ weather, location }: WeatherCardProps) {
  const icon = WMO_ICONS[weather.weatherCode] ?? "🌡️";
  const gradient = getWeatherGradient(weather.weatherCode, weather.isDay);

  const stats = [
    { icon: <Thermometer size={16} />, label: "Feels Like", value: `${weather.feelsLike}°C` },
    { icon: <Droplets size={16} />, label: "Humidity", value: `${weather.humidity}%` },
    { icon: <Wind size={16} />, label: "Wind", value: `${weather.windSpeed} km/h` },
    { icon: <Sun size={16} />, label: "UV Index", value: `${weather.uvIndex}` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      }}
    >
      {/* Background glow */}
      <div
        className={`absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl pointer-events-none`}
      />

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={16} className="text-sky-400" />
        <div>
          <h2 className="text-white font-bold text-xl leading-tight">{location.name}</h2>
          <p className="text-white/50 text-sm">
            {[location.state, location.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      {/* Main temperature display */}
      <div className="flex items-end gap-4 mb-6">
        <div>
          <div className="flex items-start gap-2">
            <span className="text-8xl sm:text-9xl font-black text-white leading-none">
              {weather.temperature}
            </span>
            <span className="text-4xl font-light text-white/60 mt-4">°C</span>
          </div>
          <p className="text-white/70 text-lg font-medium mt-1">{weather.description}</p>
          <p className="text-white/40 text-sm">{weather.isDay ? "Daytime" : "Nighttime"}</p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="text-7xl sm:text-8xl ml-auto mb-2 select-none"
          style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 rounded-2xl p-3"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-1.5 text-sky-400">
              {s.icon}
              <span className="text-xs text-white/50">{s.label}</span>
            </div>
            <span className="text-white font-bold text-lg">{s.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
