import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
const pkg = JSON.parse(readFileSync("./package.json", "utf-8")) as {
  version: string;
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/stride/",
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
  },
});
