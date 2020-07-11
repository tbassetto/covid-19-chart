module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks", "react"],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    'prettier',
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:react-hooks/recommended"
  ],
  globals: {
    Atomics: "readonly",
    React: "writable",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/no-unescaped-entities": "off", // not needed with NextJS
    "react/prop-types": "off", // would rather use TypeScript if needed
    "react/react-in-jsx-scope": "off", // not needed with NextJS
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0 // TO FIX LATER
  }
};
