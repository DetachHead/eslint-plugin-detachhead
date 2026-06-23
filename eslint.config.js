import detachhead from '@detachhead/eslint-config';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
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
