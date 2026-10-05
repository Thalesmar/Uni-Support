import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy: the React app runs on 5173, Express on 1337.
    // fetch("/api/...") stays same-origin in the browser, then Vite
    // forwards it to Express. This also lets the login cookie work.
    proxy: {
      "/api": {
        target: "http://localhost:1337",
        changeOrigin: true,
      },
    },
  },
  base: '/Uni-Support',
});

