import rule from '../../src/rules/suggestions-as-errors'
import { ESLintUtils } from '@typescript-eslint/utils'
import path from 'path'

const ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: path.join(__dirname, '../fixtures'),
    },
})

ruleTester.run('suggestions-as-errors', rule, {
    valid: ['console.log(1)'],
    invalid: [
        {
            code: 'async () => await asdf',
            errors: [{ messageId: 'tsSuggestionMessage' }],
        },
    ],
})
