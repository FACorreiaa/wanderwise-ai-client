import js from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "tsconfig.json",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        fetch: "readonly",
        confirm: "readonly",
        alert: "readonly",
        prompt: "readonly",
        FormData: "readonly",
        File: "readonly",
        FileReader: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Headers: "readonly",
        Request: "readonly",
        Response: "readonly",
        AbortController: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "off", // TypeScript handles this
      "prefer-const": "warn",
      "no-console": "warn",
    },
  },
];
