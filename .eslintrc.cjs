/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: "latest",
  },

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-airbnb-with-typescript",
    "@vue/eslint-config-prettier",
  ],
};
