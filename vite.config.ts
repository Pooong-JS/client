import { defineConfig } from "vite";
import sdk from "vite-plugin-sdk";

export default defineConfig({
  plugins: [sdk()],
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
