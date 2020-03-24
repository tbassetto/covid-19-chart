module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react"
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
    ecmaVersion: 2018,
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: ["react"],
  rules: {
    "react/no-unescaped-entities": "off", // not needed with NextJS
    "react/prop-types": "off", // would rather use TypeScript if needed
    "react/react-in-jsx-scope": "off", // not needed with NextJS
  }
};
