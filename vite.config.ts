import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: new URL("./index.html", import.meta.url).pathname,
        research: new URL("./research/index.html", import.meta.url).pathname,
        publications: new URL("./publications/index.html", import.meta.url).pathname,
      },
    },
  },
});
