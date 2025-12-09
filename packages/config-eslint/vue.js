module.exports = {
  extends: ['./base.js', 'plugin:vue/vue3-recommended', '@vue/typescript/recommended'],
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
};
