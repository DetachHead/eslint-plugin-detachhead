import rule from '../../src/rules/require-variance-annotations'
import { ESLintUtils } from '@typescript-eslint/utils'
import path from 'path'

const ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: path.join(__dirname, '../fixtures'),
    },
})

ruleTester.run('require-variance-annotations', rule, {
    valid: ['class Foo<in T> {value: (value: T) => void}', 'type Foo<T> = number | T'],
    invalid: [
        {
            code: 'class Foo<T> {value: T}',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
        {
            code: 'type Bar<in out T> = {}; type Foo<T> = Bar<T>',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
        {
            code: 'type Baz<in out T> = {}; type Bar<in out T> = Baz<T>; type Foo<T> = Bar<T>',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
        {
            code: 'type Foo<T> = () => {}',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
    ],
})
