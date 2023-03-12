const prettier = require('prettier')
const prettierRC = require('./.prettierrc')

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
    postprocess: (content) => prettier.format(content, { ...prettierRC, parser: 'markdown' }),
}

module.exports = config
