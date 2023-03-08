/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['@detachhead/eslint-config'],
  overrides: [
      {
          files: ['src/**/*.ts'],
          parserOptions: {
              ecmaVersion: 'latest',
              project: './src/tsconfig.json',
          },
      },
  ],
}

module.exports = config
