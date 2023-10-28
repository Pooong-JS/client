import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: true,
    emptyOutDir: false,
    lib: {
			entry: {
				index: "./index.ts",
			},
		},
  },
});
