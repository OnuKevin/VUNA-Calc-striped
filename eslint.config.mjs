import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        module: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_", varsIgnorePattern: "^(toggleTheme|appendToResult|bracketToResult|backspace|operatorToResult|clearResult|percentToResult|calculateResult)$" }],
      "no-console": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "assets/js/bootstrap.min.js",
      "assets/css/**",
    ],
  },
];
