// ─── Weather API Helpers ───────────────────────────────────────────────────
// Open-Meteo (current + hourly forecast) — FREE, no API key needed
// Nominatim (geocoding)                  — FREE, no API key needed

export interface GeoLocation {
  lat: number;
  lon: number;
  name: string;
  country: string;
  state?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  weatherCode: number;
  isDay: boolean;
  description: string;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyPoint[];
  location: GeoLocation;
}

// WMO Weather Interpretation Codes → human readable description
export const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  71: "Slight Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Slight Showers",
  81: "Moderate Showers",
  82: "Violent Showers",
  85: "Slight Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm w/ Hail",
  99: "Thunderstorm w/ Heavy Hail",
};

// WMO code → emoji icon
export const WMO_ICONS: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "❄️", 77: "❄️",
  80: "🌦️", 81: "🌧️", 82: "⛈️",
  85: "🌨️", 86: "❄️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

// Background gradient based on weather code
export function getWeatherGradient(code: number, isDay: boolean): string {
  if (!isDay) return "from-indigo-950 via-slate-900 to-slate-800";
  if (code === 0 || code === 1) return "from-sky-400 via-blue-500 to-indigo-600";
  if (code === 2 || code === 3) return "from-slate-400 via-gray-500 to-slate-600";
  if (code >= 45 && code <= 48) return "from-gray-400 via-slate-500 to-gray-600";
  if (code >= 51 && code <= 67) return "from-slate-500 via-blue-700 to-indigo-800";
  if (code >= 71 && code <= 77) return "from-blue-100 via-slate-300 to-blue-200";
  if (code >= 80 && code <= 82) return "from-slate-500 via-blue-600 to-indigo-700";
  if (code >= 95) return "from-gray-700 via-slate-800 to-gray-900";
  return "from-sky-400 via-blue-500 to-indigo-600";
}

// ─── Nominatim Geocoding ───────────────────────────────────────────────────
export async function searchCity(query: string): Promise<GeoLocation[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "UltimateWeatherApp/1.0" },
  });
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((item: any) => ({
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    name: item.address?.city || item.address?.town || item.address?.village || item.display_name.split(",")[0],
    country: item.address?.country || "",
    state: item.address?.state,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": "UltimateWeatherApp/1.0" },
  });
  if (!res.ok) throw new Error("Reverse geocoding failed");
  const data = await res.json();
  return {
    lat,
    lon,
    name: data.address?.city || data.address?.town || data.address?.village || data.display_name.split(",")[0],
    country: data.address?.country || "",
    state: data.address?.state,
  };
}

// ─── Open-Meteo Weather Fetch ─────────────────────────────────────────────
export async function fetchWeather(location: GeoLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: location.lat.toString(),
    longitude: location.lon.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index,is_day",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    forecast_days: "2",
    timezone: "auto",
    wind_speed_unit: "kmh",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  const data = await res.json();

  const c = data.current;
  const code = c.weather_code as number;
  const isDay = c.is_day === 1;

  // Next 24 hours only
  const now = new Date();
  const hourly: HourlyPoint[] = data.hourly.time
    .slice(0, 48)
    .map((t: string, i: number) => ({
      time: t,
      temperature: Math.round(data.hourly.temperature_2m[i]),
      precipitationProbability: data.hourly.precipitation_probability[i],
      weatherCode: data.hourly.weather_code[i],
    }))
    .filter((h: HourlyPoint) => new Date(h.time) >= now)
    .slice(0, 24);

  return {
    location,
    current: {
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      humidity: c.relative_humidity_2m,
      windSpeed: Math.round(c.wind_speed_10m),
      uvIndex: Math.round(c.uv_index),
      weatherCode: code,
      isDay,
      description: WMO_DESCRIPTIONS[code] ?? "Unknown",
    },
    hourly,
  };
}
