"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, X, Loader2, Wind } from "lucide-react";
import { GeoLocation } from "@/lib/weather";

interface NavbarProps {
  onSelectLocation: (loc: GeoLocation) => void;
  onGeolocate: () => void;
  suggestions: GeoLocation[];
  suggestionsLoading: boolean;
  onSearch: (q: string) => void;
  clearSuggestions: () => void;
  isLoading: boolean;
}

export default function Navbar({
  onSelectLocation,
  onGeolocate,
  suggestions,
  suggestionsLoading,
  onSearch,
  clearSuggestions,
  isLoading,
}: NavbarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, onSearch]);

  const handleSelect = (loc: GeoLocation) => {
    setQuery(`${loc.name}, ${loc.country}`);
    setFocused(false);
    clearSuggestions();
    onSelectLocation(loc);
  };

  const handleClear = () => {
    setQuery("");
    clearSuggestions();
    inputRef.current?.focus();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mr-auto"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg">
            <Wind size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg hidden sm:block tracking-wide drop-shadow">
            WeatherApp
          </span>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex-1 max-w-md"
        >
          <div
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 backdrop-blur-xl border transition-all duration-300 ${
              focused
                ? "bg-white/20 border-white/40 shadow-lg shadow-black/20"
                : "bg-white/10 border-white/20"
            }`}
          >
            {suggestionsLoading ? (
              <Loader2 size={18} className="text-white/70 animate-spin flex-shrink-0" />
            ) : (
              <Search size={18} className="text-white/70 flex-shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="Search city..."
              className="bg-transparent text-white placeholder-white/50 outline-none flex-1 text-sm"
            />
            {query && (
              <button onClick={handleClear} className="text-white/60 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {focused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 left-0 right-0 rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-2xl"
              >
                {suggestions.map((loc, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelect(loc)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors text-white"
                  >
                    <MapPin size={15} className="text-sky-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{loc.name}</p>
                      <p className="text-xs text-white/50">
                        {[loc.state, loc.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Geolocation button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onGeolocate}
          disabled={isLoading}
          title="Use my location"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-500/80 hover:bg-sky-500 backdrop-blur-xl border border-sky-400/30 text-white text-sm font-medium transition-all duration-200 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <MapPin size={16} />
          )}
          <span className="hidden sm:block">My Location</span>
        </motion.button>
      </div>
    </nav>
  );
}
