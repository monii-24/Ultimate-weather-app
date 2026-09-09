# 🌤️ The Ultimate Weather App

A stunning, immersive weather application built with **Next.js 14**, **Tailwind CSS**, **Leaflet.js**, and **Framer Motion**.

![Hero](./public/hero-bg.jpg)

## ✨ Features

- 🎬 **Cinematic Hero Section** — Full-screen looping nature video with animated title overlay
- 🔍 **City Search** — Autocomplete search powered by Nominatim (OpenStreetMap) — no API key needed
- 📍 **Geolocation** — One-click "My Location" button using the browser's Geolocation API
- 🌡️ **Real-time Weather** — Current temperature, feels like, humidity, wind speed, UV index via **Open-Meteo** (free, no key)
- 📈 **24-Hour Forecast** — Scrollable hourly forecast strip with weather icons and rain probability
- 🗺️ **Live Radar Map** — Interactive Leaflet map with OWM overlay (Rain, Clouds, Wind, Temperature)
- 🌈 **Dynamic Theming** — Background gradient changes based on current weather condition
- 💎 **Glassmorphism UI** — Beautiful frosted-glass cards with smooth Framer Motion animations

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/monii-24/ultimate-weather-app.git
cd ultimate-weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.local.example` to `.env.local` (or edit `.env.local` directly):

```bash
NEXT_PUBLIC_OWM_API_KEY=your_openweathermap_api_key_here
```

> Get a **free** API key at [openweathermap.org/api](https://openweathermap.org/api)  
> The radar map tiles use this key. All weather data (Open-Meteo) works without any key.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### 5. Build for production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | Framework (App Router) |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Leaflet.js](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org) | Interactive radar map |
| [Open-Meteo](https://open-meteo.com) | Weather API (free, no key) |
| [Nominatim](https://nominatim.openstreetmap.org) | Geocoding (free, no key) |
| [OpenWeatherMap](https://openweathermap.org/api/weathermaps) | Radar tile overlay (free tier) |
| [Pexels](https://www.pexels.com) | Hero background video |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Main page (orchestration)
│   └── globals.css       # Global styles
├── components/
│   ├── Navbar.tsx        # Glassmorphism navbar + search + geolocation
│   ├── HeroSection.tsx   # Video hero + animated title
│   ├── WeatherCard.tsx   # Current weather display
│   ├── HourlyForecast.tsx# 24h scrollable forecast
│   └── RadarMap.tsx      # Leaflet radar map
├── hooks/
│   └── useWeather.ts     # Data fetching + state management
└── lib/
    └── weather.ts        # API helpers + WMO code mappings
```

## 📄 License

MIT © [monii-24](https://github.com/monii-24)
