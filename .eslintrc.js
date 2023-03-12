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
        // TODO: remove thes when eslint-config is updated
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
                'import/no-extraneous-dependencies': 'off',
            },
        },
    ],
}

module.exports = config
