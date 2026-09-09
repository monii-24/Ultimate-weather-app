"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WeatherCard from "@/components/WeatherCard";
import HourlyForecast from "@/components/HourlyForecast";
import { useWeather } from "@/hooks/useWeather";
import { getWeatherGradient } from "@/lib/weather";

// Dynamically import RadarMap (Leaflet can't run on server)
const RadarMap = dynamic(() => import("@/components/RadarMap"), { ssr: false });

export default function HomePage() {
  const {
    state,
    suggestions,
    suggestionsLoading,
    loadWeather,
    searchAndSuggest,
    useGeolocation,
    clearSuggestions,
  } = useWeather();

  const isLoading = state.status === "loading";
  const weatherData = state.status === "success" ? state.data : null;

  // Dynamic bg gradient based on weather
  const bgGradient =
    weatherData
      ? getWeatherGradient(weatherData.current.weatherCode, weatherData.current.isDay)
      : "from-slate-950 via-slate-900 to-indigo-950";

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${bgGradient} animated-bg transition-all duration-1000`}
    >
      {/* Sticky Navbar */}
      <Navbar
        onSelectLocation={loadWeather}
        onGeolocate={useGeolocation}
        suggestions={suggestions}
        suggestionsLoading={suggestionsLoading}
        onSearch={searchAndSuggest}
        clearSuggestions={clearSuggestions}
        isLoading={isLoading}
      />

      {/* Hero Section (full-screen video) */}
      <HeroSection />

      {/* Weather Content */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        {/* Loading state */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-sky-500/30 border-t-sky-400 animate-spin" />
                <Loader2 size={24} className="absolute inset-0 m-auto text-sky-400 animate-pulse" />
              </div>
              <p className="text-white/60 text-sm animate-pulse">Fetching weather data...</p>
            </motion.div>
          )}

          {/* Error state */}
          {state.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-2xl p-5 text-red-300"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                backdropFilter: "blur(12px)",
              }}
            >
              <AlertTriangle size={20} className="flex-shrink-0 text-red-400" />
              <p className="text-sm">{state.message}</p>
            </motion.div>
          )}

          {/* Idle prompt */}
          {state.status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className="text-6xl mb-4">🌍</p>
              <p className="text-white/60 text-lg">
                Search for a city or use your current location to get started.
              </p>
            </motion.div>
          )}

          {/* Weather data */}
          {weatherData && !isLoading && (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Current weather card */}
              <WeatherCard
                weather={weatherData.current}
                location={weatherData.location}
              />

              {/* Hourly forecast */}
              <HourlyForecast hourly={weatherData.hourly} />

              {/* Radar map */}
              <RadarMap lat={weatherData.location.lat} lon={weatherData.location.lon} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-white/30 text-xs">
        <p>
          Weather data by{" "}
          <a href="https://open-meteo.com" className="text-sky-400/60 hover:text-sky-400 transition-colors" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>{" "}
          · Geocoding by{" "}
          <a href="https://nominatim.openstreetmap.org" className="text-sky-400/60 hover:text-sky-400 transition-colors" target="_blank" rel="noreferrer">
            Nominatim
          </a>{" "}
          · Map by{" "}
          <a href="https://leafletjs.com" className="text-sky-400/60 hover:text-sky-400 transition-colors" target="_blank" rel="noreferrer">
            Leaflet
          </a>
        </p>
      </footer>
    </main>
  );
}
