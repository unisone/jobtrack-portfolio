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
  ]),
  // Custom rules to handle React 19 strict mode patterns
  {
    rules: {
      // Allow setState in useEffect for client-side hydration checks
      // This is a common pattern for SSR/SSG applications
      "react-hooks/set-state-in-effect": "off",
      // Allow Math.random and other "impure" functions during render
      // when properly handled (e.g., for animations, particles)
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
