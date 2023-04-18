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
    valid: [
        'console.log(1)',
        {
            code: 'async () => await 1',
            options: [{ exclude: [80007] }],
        },
        {
            code: 'async () => await 1',
            options: [{ include: [] }],
        },
        {
            code: 'async () => await 1',
            options: [{ include: [80007], exclude: [80007] }],
        },
    ],
    invalid: [
        {
            code: 'async () => await 1',
            errors: [{ messageId: 'tsSuggestionMessage' }],
        },
        {
            code: "import * as ts from 'typescript'",
            errors: [{ messageId: 'tsSuggestionMessage' }],
        },
        {
            code: "import * as ts from 'typescript';async () => await 1",
            errors: [{ messageId: 'tsSuggestionMessage' }, { messageId: 'tsSuggestionMessage' }],
        },
        {
            code: "import * as ts from 'typescript';async () => await 1",
            options: [{ include: [80007] }],
            errors: [{ messageId: 'tsSuggestionMessage' }],
        },
        {
            code: "import * as ts from 'typescript';async () => await 1",
            options: [{ include: [80003] }],
            errors: [{ messageId: 'tsSuggestionMessage' }],
        },
    ],
})
