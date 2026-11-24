"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface RadarMapProps {
  lat: number;
  lon: number;
}

const OWM_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY || "YOUR_OWM_API_KEY_HERE";

const LAYERS = [
  { id: "precipitation_new", label: "🌧️ Rain" },
  { id: "clouds_new", label: "☁️ Clouds" },
  { id: "wind_new", label: "💨 Wind" },
  { id: "temp_new", label: "🌡️ Temp" },
];

export default function RadarMap({ lat, lon }: RadarMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leafletMapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radarLayerRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState("precipitation_new");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!mounted || !mapRef.current || leafletMapRef.current) return;

    let L: typeof import("leaflet");
    import("leaflet").then((mod) => {
      L = mod.default;

      // Fix default marker icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [lat, lon],
        zoom: 7,
        zoomControl: true,
        attributionControl: true,
      });

      // Base tile layer (dark theme)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
}).addTo(map);

      // Location marker
      L.circleMarker([lat, lon], {
        radius: 8,
        fillColor: "#38bdf8",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      // Radar overlay
      const radarLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        { opacity: 0.6, attribution: "OpenWeatherMap" }
      ).addTo(map);

      leafletMapRef.current = map;
      radarLayerRef.current = radarLayer;
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        radarLayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  // Update center when lat/lon changes
  useEffect(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lon], 7, { animate: true });
    }
  }, [lat, lon]);

  // Swap radar layer when activeLayer changes
  useEffect(() => {
    if (!leafletMapRef.current || !radarLayerRef.current) return;
    import("leaflet").then((mod) => {
      const L = mod.default;
      leafletMapRef.current.removeLayer(radarLayerRef.current);
      radarLayerRef.current = L.tileLayer(
        `https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
        { opacity: 0.6, attribution: "OpenWeatherMap" }
      ).addTo(leafletMapRef.current);
    });
  }, [activeLayer]);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-sky-400" />
          <h3 className="text-white font-bold text-lg">Live Radar</h3>
        </div>

        {/* Layer selector */}
        <div className="flex gap-2 flex-wrap justify-end">
          {LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                activeLayer === layer.id
                  ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                  : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full h-80 sm:h-96" />
    </motion.div>
  );
}
