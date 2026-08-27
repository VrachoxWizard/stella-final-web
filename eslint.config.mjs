import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", ".superdesign/**", "node_modules/**", "coverage/**", "tina/__generated__/**", "js/**", "css/**", "fonts/**", "images/**", "media/**", "public/**", "index.html"])
]);
