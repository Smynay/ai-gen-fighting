import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/ai-gen-fighting/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "./src/core"),
      "@web": path.resolve(__dirname, "./src/web"),
      "@server": path.resolve(__dirname, "./src/server"),
    },
  },
  server: {
    port: 5173,
  },
});
