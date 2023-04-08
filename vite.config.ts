import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

import { icons } from "./icons.json";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      srcDir: "src",
      filename: "service-worker.js",
      // Compile custom service-worker script and inject the manifest file.
      strategies: "injectManifest",
      // Don't automatically register the service worker, we will do it manually.
      injectRegister: false,
      manifest: {
        display: "standalone",
        lang: "en",
        id: "?standalone=1",
        start_url: "/",
        scope: "/",
        short_name: "Denise-Audio",
        name: "Denise-Audio",
        description: "Denise-Audio application to listen to music.",
        theme_color: "#1b1917",
        background_color: "#1b1917",
        icons,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
