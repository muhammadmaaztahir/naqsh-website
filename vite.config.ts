// Vite configuration for TanStack Start project
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  server: {
    proxy: {
      "/_sanity": {
        target: `https://${process.env.VITE_SANITY_PROJECT_ID || "plllrhrs"}.apicdn.sanity.io`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/_sanity/, ""),
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

