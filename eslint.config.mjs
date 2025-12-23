import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default [
  ...compat.config({
    extends: ["next/core-web-vitals", "prettier"],
    plugins: ["prettier"],
    rules: {
      "import/no-extraneous-dependencies": 0,
      "import/prefer-default-export": 0,
      "import/extensions": 0,
      "import/no-unresolved": 0,
      "import/no-anonymous-default-export": 0,
      "no-undef": 0,
      "no-unused-expressions": 0,
      "no-shadow": 0,
      "no-unused-vars": 0,
      "no-param-reassign": ["error", { props: false }],
      "no-console": 0,
      "prettier/prettier": 1,
      "react/display-name": ["off"]
    }
  })
];
