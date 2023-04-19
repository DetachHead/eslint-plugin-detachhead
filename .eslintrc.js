/** @type {import('eslint').Linter.Config} */
const config = {
    extends: ['@detachhead/eslint-config', 'plugin:eslint-plugin/all'],
    rules: {
        'eslint-plugin/require-meta-docs-url': 'off', // i'm using md links on github which is the default
    },
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
