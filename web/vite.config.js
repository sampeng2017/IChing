import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "ApplicationIcon.png",
        "icons/apple-touch-icon.png",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "images/*.png",
        "images/background.jpg",
      ],
      manifest: {
        name: "易經占蔔",
        short_name: "易經",
        description:
          "I Ching divination and 64-hexagram study app. 易經占卜與六十四卦學習工具。",
        lang: "zh-Hant",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#f3eee7",
        theme_color: "#6f3d2d",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshots/home.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
            label: "Home and method view",
          },
          {
            src: "/screenshots/reading.png",
            sizes: "390x844",
            type: "image/png",
            form_factor: "narrow",
            label: "Hexagram reading view",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,json,webmanifest}"],
        navigateFallback: "/index.html",
      },
    }),
  ],
});
