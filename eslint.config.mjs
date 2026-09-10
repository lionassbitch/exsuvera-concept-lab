import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Third-party code we vendor rather than author: linting a minified
    // bundle produces hundreds of findings nobody can or should act on.
    "public/vendor/**",
    // Build outputs.
    "dist/**",
    ".output/**",
    ".vercel/**",
  ]),
]);

export default eslintConfig;
