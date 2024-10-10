// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: "/",
//   plugins: [react()],
//   server: {
//     host: true,
//     proxy: {
//       "/v1": {
//         target: "http://localhost:8000/api",
//         // target: "https://youtube-clone-41ll.onrender.com/api",
//         withCredentials: true,
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // Adjust the base path if needed for production deployment
  plugins: [react()],
  build: {
    outDir: "dist", // Output directory for build
    sourcemap: false, // Set true if you need source maps for debugging in production
    minify: "esbuild", // Fast minification
  },
  // You can leave server settings for development only. No need to include them for production
});
