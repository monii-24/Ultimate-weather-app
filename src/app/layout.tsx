import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "The Ultimate Weather App",
  description: "Real-time weather, hourly forecasts, and live radar maps — beautifully visualized.",
  keywords: ["weather", "forecast", "radar", "real-time", "open-meteo"],
  openGraph: {
    title: "The Ultimate Weather App",
    description: "Real-time weather, hourly forecasts, and live radar maps.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <head>
        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
