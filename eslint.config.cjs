const detachhead = require('@detachhead/eslint-config').default;
const eslintPlugin = require('eslint-plugin-eslint-plugin').default;
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  detachhead,
  eslintPlugin.configs.all,
  {
    ignores: ['tests/fixtures'],
    rules: {
      'eslint-plugin/require-meta-docs-url': 'off', // i'm using md links on github which is the default
    },
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        project: './src/tsconfig.json',
      },
    },
  },
]);
