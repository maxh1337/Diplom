import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["empty-houses-know.loca.lt", "ya-budu.ru"],
  },
  preview: {
    allowedHosts: ["ya-budu.ru", "empty-houses-know.loca.lt"],
  },
});
