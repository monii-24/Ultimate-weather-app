"use client";

import { useState, useCallback } from "react";
import {
  GeoLocation,
  WeatherData,
  fetchWeather,
  searchCity,
  reverseGeocode,
} from "@/lib/weather";

export type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherData }
  | { status: "error"; message: string };

export function useWeather() {
  const [state, setState] = useState<WeatherState>({ status: "idle" });
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const loadWeather = useCallback(async (location: GeoLocation) => {
    setState({ status: "loading" });
    try {
      const data = await fetchWeather(location);
      setState({ status: "success", data });
      setSuggestions([]);
    } catch (err) {
      setState({ status: "error", message: (err as Error).message });
    }
  }, []);

  const searchAndSuggest = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const results = await searchCity(query);
      setSuggestions(results);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const useGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: "error", message: "Geolocation not supported by your browser." });
      return;
    }
    setState({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const location = await reverseGeocode(coords.latitude, coords.longitude);
          await loadWeather(location);
        } catch (err) {
          setState({ status: "error", message: (err as Error).message });
        }
      },
      () => {
        setState({ status: "error", message: "Location access denied. Please allow location access." });
      }
    );
  }, [loadWeather]);

  return {
    state,
    suggestions,
    suggestionsLoading,
    loadWeather,
    searchAndSuggest,
    useGeolocation,
    clearSuggestions: () => setSuggestions([]),
  };
}
