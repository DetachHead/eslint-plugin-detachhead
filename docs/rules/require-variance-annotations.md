# Enforce variance annotations for all generics where they are supported (`detachhead/require-variance-annotations`)

<!-- end auto-generated rule header -->

## Rule Details

this rule enforces that variance annotations (`in` and `out` keywords) are used on any generic where thet are allowed.

typescript infers the variance of generics based on their usage, but there are several benefits to defining the variance explicitly:

-   it can be a useful for a reader to explicitly see how a type parameter is used at a glance
-   can increase performance as the typescript compiler does not need to perform expensive checks to infer the variance where it's explicitly defined
-   can prevent unintentional breaking changes in your API if, for example, a new method is added to a class that changes the variance of its generic

Examples of **incorrect** code for this rule:

```ts
type Foo<T> = {
    bar: (value: T) => void
}

interface Bar<T> {
    baz: () => T
}

interface Baz<T> {
    value: T
}
```

Examples of **correct** code for this rule:

```ts
type Foo<in T> = {
    bar: (value: T) => void
}

interface Bar<out T> {
    baz: () => T
}

interface Baz<in out T> {
    value: T
}

type Qux<T> = T | undefined // Variance annotations are only supported in type aliases for object, function, constructor, and mapped types.
```

## When Not To Use It

if you are using a typescript version older than 4.7

## Further Reading

https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#optional-variance-annotations-for-type-parameters
