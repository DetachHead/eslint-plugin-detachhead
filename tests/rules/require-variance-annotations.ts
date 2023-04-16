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
    valid: [
        'class Foo<in T> {value: (value: T) => void}',
        'type Foo<T> = number | T',
        'const foo: <T>() => void = () => {}',
        'type Foo = <T>() => void',
        'interface Foo { <T>(): void }',
        'interface Foo { foo: <T>() => void }',
        'declare class Foo<in T> {value: (value: T) => void}',
        'declare type Foo<T> = number | T',
        'declare const foo: <T>() => void',
        'declare type Foo = <T>() => void',
        'declare interface Foo { <T>(): void }',
        'declare interface Foo { foo: <T>() => void }',
    ],
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
        {
            code: 'declare class Foo<T> {value: T}',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
        {
            code: 'declare type Bar<in out T> = {}; declare type Foo<T> = Bar<T>',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
        {
            code: 'declare type Baz<in out T> = {}; declare type Bar<in out T> = Baz<T>; declare type Foo<T> = Bar<T>',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
        {
            code: 'declare type Foo<T> = () => {}',
            errors: [{ messageId: 'requireVarianceAnnotation' }],
        },
    ],
})
