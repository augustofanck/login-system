import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:8080",
      "/me": "http://localhost:8080",
      "/admin": "http://localhost:8080",
      "/home": "http://localhost:8080",
    },
  },
});