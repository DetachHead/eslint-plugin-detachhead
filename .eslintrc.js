/** @type {import('eslint').Linter.Config} */
const config = {
    extends: ['@detachhead/eslint-config', 'plugin:eslint-plugin/all'],
    rules: {
        'eslint-plugin/require-meta-docs-url': 'off', // i'm using md links on github which is the default
        'detachhead/suggestions-as-errors': [
            'error',
            {
                // TODO: remove once eslint-config is updated with this
                exclude: [80001], // File is a CommonJS module; it may be converted to an ES module
            },
        ],
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
